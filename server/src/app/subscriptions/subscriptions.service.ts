import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { env } from "@/env";
import {
  createBillingPortalSession,
  createSubscriptionCheckoutSession,
  getOrCreateCustomer,
  getStripe,
} from "@/lib/payments/stripe";
import type { SubscriptionPlan } from "@prisma/client";

export const SubscriptionsService = {
  async checkout(userId: string, plan: SubscriptionPlan) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, stripeCustomerId: true },
    });
    if (!user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");

    const customerId = await getOrCreateCustomer(user);

    const successUrl = `${env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=subscription`;
    const cancelUrl = `${env.FRONTEND_URL}/checkout/cancel`;

    const session = await createSubscriptionCheckoutSession({
      customerId,
      userId,
      plan,
      successUrl,
      cancelUrl,
    });

    return { url: session.url, sessionId: session.id };
  },

  async getMine(userId: string) {
    return prisma.subscription.findUnique({ where: { userId } });
  },

  async cancelAtPeriodEnd(userId: string) {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (!sub || !sub.stripeSubscriptionId) {
      throw new AppError(httpStatus.NOT_FOUND, "No active subscription.");
    }
    const stripe = getStripe();
    const updated = await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: updated.canceled_at ? new Date(updated.canceled_at * 1000) : new Date(),
      },
    });
    return prisma.subscription.findUnique({ where: { id: sub.id } });
  },

  async billingPortal(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });
    if (!user?.stripeCustomerId) {
      throw new AppError(httpStatus.NOT_FOUND, "No billing customer found.");
    }
    const session = await createBillingPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${env.FRONTEND_URL}/account/billing`,
    });
    return { url: session.url };
  },
};
