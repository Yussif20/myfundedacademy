import { Request, Response, NextFunction } from "express";
import { prisma } from "@/lib/db/db";
import { logger } from "@/utils/logger";
import { constructWebhookEvent, getStripe, priceIdToPlan } from "@/lib/payments/stripe";
import type Stripe from "stripe";
import type { SubscriptionStatus } from "@prisma/client";

const stripeStatusMap: Record<string, SubscriptionStatus> = {
  active: "ACTIVE",
  trialing: "TRIALING",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  unpaid: "UNPAID",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE_EXPIRED",
};

const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  const meta = (session.metadata || {}) as Record<string, string>;
  const userId = meta.userId;
  const sessionId = session.id;

  if (!userId) {
    logger.warning(`Checkout session ${sessionId} missing userId in metadata.`, {
      type: "WEBHOOK",
    });
    return;
  }

  if (meta.type === "ONE_TIME") {
    const courseId = meta.courseId;
    if (!courseId) {
      logger.warning(`ONE_TIME session ${sessionId} missing courseId.`, { type: "WEBHOOK" });
      return;
    }

    // Use a transaction so order update + enrollment creation are atomic.
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { stripeSessionId: sessionId } });
      if (!order) {
        logger.warning(`Order missing for session ${sessionId} — creating one.`, {
          type: "WEBHOOK",
        });
        await tx.order.create({
          data: {
            userId,
            courseId,
            type: "ONE_TIME",
            status: "COMPLETED",
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || "usd",
            stripeSessionId: sessionId,
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            paidAt: new Date(),
          },
        });
      } else if (order.status !== "COMPLETED") {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "COMPLETED",
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            paidAt: new Date(),
          },
        });
      }

      // Idempotent enrollment grant.
      await tx.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId, source: "PURCHASE" },
        update: {},
      });
    });

    logger.success(`Granted enrollment: user=${userId} course=${courseId}`, { type: "WEBHOOK" });
    return;
  }

  if (meta.type === "SUBSCRIPTION") {
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (!subscriptionId) {
      logger.warning(`SUBSCRIPTION session ${sessionId} has no subscription id.`, {
        type: "WEBHOOK",
      });
      return;
    }
    // Defer to subscription.updated which Stripe also fires; nothing to do here.
    return;
  }
};

const upsertSubscription = async (sub: Stripe.Subscription) => {
  const userId = (sub.metadata || {})["userId"] as string | undefined;
  if (!userId) {
    logger.warning(`Subscription ${sub.id} missing userId in metadata.`, { type: "WEBHOOK" });
    return;
  }

  const item = sub.items.data[0];
  const priceId = item?.price?.id;
  const plan = priceId ? priceIdToPlan(priceId) : null;
  if (!plan) {
    logger.warning(`Subscription ${sub.id} has unknown price ${priceId}.`, { type: "WEBHOOK" });
    return;
  }

  const status = stripeStatusMap[sub.status] || "INCOMPLETE";

  const data = {
    plan,
    status,
    stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
    stripeSubscriptionId: sub.id,
    stripePriceId: priceId,
    currentPeriodStart: sub.current_period_start ? new Date(sub.current_period_start * 1000) : null,
    currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
    cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
    canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
  };

  // Upsert with idempotent error handling. Stripe fires
  // checkout.session.completed and customer.subscription.created in
  // parallel; both can hit this code path before either commits, so
  // both attempt CREATE and one loses on the unique constraint. When
  // that happens, fall through to UPDATE — the data converges.
  try {
    await prisma.subscription.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      await prisma.subscription.update({ where: { userId }, data });
    } else {
      throw err;
    }
  }

  logger.success(`Sync subscription: user=${userId} plan=${plan} status=${status}`, {
    type: "WEBHOOK",
  });
};

export const StripeWebhookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      res.status(400).send("Missing or invalid stripe-signature header.");
      return;
    }
    if (!Buffer.isBuffer(req.body)) {
      res.status(400).send("Webhook handler requires raw request body.");
      return;
    }

    const event = constructWebhookEvent(req.body, signature);
    logger.info(`Stripe event: ${event.type}`, { type: "WEBHOOK" });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // For subscription flow we used to also retrieve+upsert the
        // subscription here, but that races with the
        // customer.subscription.created event Stripe fires concurrently
        // and produced a benign 409. Skip the inline upsert; the
        // subscription handlers below will sync the row.
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(sub);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
        if (subId) {
          const stripe = getStripe();
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(sub);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
        if (subId) {
          const stripe = getStripe();
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertSubscription(sub);
        }
        break;
      }

      default:
        // Other events are intentionally ignored for the MVP scope.
        break;
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};
