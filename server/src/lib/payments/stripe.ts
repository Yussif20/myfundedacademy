import Stripe from "stripe";
import { env } from "@/env";
import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import type { SubscriptionPlan } from "@prisma/client";

let cachedStripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (cachedStripe) return cachedStripe;
  if (!env.STRIPE_SECRET_KEY) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Payments are not configured. Set STRIPE_SECRET_KEY.",
    );
  }
  cachedStripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
  });
  return cachedStripe;
};

export const isStripeConfigured = (): boolean => Boolean(env.STRIPE_SECRET_KEY);

/**
 * Looks up or creates a Stripe Customer for the given user, persisting the
 * customer id back to the User row so we never create duplicates.
 */
export const getOrCreateCustomer = async (user: {
  id: string;
  email: string;
  fullName: string;
  stripeCustomerId: string | null;
}): Promise<string> => {
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.fullName,
    metadata: { userId: user.id },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });
  return customer.id;
};

const planToPriceId = (plan: SubscriptionPlan): string => {
  const map: Record<SubscriptionPlan, string> = {
    STARTER_MONTHLY: env.STRIPE_PRICE_STARTER_MONTHLY,
    PRO_MONTHLY: env.STRIPE_PRICE_PRO_MONTHLY,
    PRO_ANNUAL: env.STRIPE_PRICE_PRO_ANNUAL,
  };
  const priceId = map[plan];
  if (!priceId) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      `Stripe price for plan ${plan} is not configured.`,
    );
  }
  return priceId;
};

export const priceIdToPlan = (priceId: string): SubscriptionPlan | null => {
  if (priceId === env.STRIPE_PRICE_STARTER_MONTHLY) return "STARTER_MONTHLY";
  if (priceId === env.STRIPE_PRICE_PRO_MONTHLY) return "PRO_MONTHLY";
  if (priceId === env.STRIPE_PRICE_PRO_ANNUAL) return "PRO_ANNUAL";
  return null;
};

/**
 * Stripe only accepts absolute https image URLs (and doesn't render SVG), so
 * relative paths like the demo courses' `/demo/courses/x.svg` would make the
 * whole Checkout Session fail with "Not a valid URL". Send the thumbnail only
 * when Stripe can use it; otherwise the checkout page simply has no image.
 */
export const stripeProductImages = (thumbnail?: string | null): string[] | undefined => {
  if (!thumbnail) return undefined;
  try {
    const url = new URL(thumbnail);
    if (url.protocol !== "https:" || url.pathname.toLowerCase().endsWith(".svg")) return undefined;
    return [url.toString()];
  } catch {
    return undefined;
  }
};

/**
 * Creates a Checkout Session for a one-time course purchase. Course price
 * and title are sent inline as price_data so we don't need to pre-create
 * a Stripe Product per course.
 */
export const createCourseCheckoutSession = async (args: {
  customerId: string;
  userId: string;
  course: { id: string; title: string; thumbnail: string; oneTimePrice: number };
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> => {
  const stripe = getStripe();
  const images = stripeProductImages(args.course.thumbnail);
  return stripe.checkout.sessions.create({
    mode: "payment",
    customer: args.customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(args.course.oneTimePrice * 100),
          product_data: {
            name: args.course.title,
            ...(images ? { images } : {}),
          },
        },
      },
    ],
    success_url: args.successUrl,
    cancel_url: args.cancelUrl,
    metadata: {
      type: "ONE_TIME",
      userId: args.userId,
      courseId: args.course.id,
    },
  });
};

export const createSubscriptionCheckoutSession = async (args: {
  customerId: string;
  userId: string;
  plan: SubscriptionPlan;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> => {
  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: args.customerId,
    line_items: [{ price: planToPriceId(args.plan), quantity: 1 }],
    success_url: args.successUrl,
    cancel_url: args.cancelUrl,
    metadata: {
      type: "SUBSCRIPTION",
      userId: args.userId,
      plan: args.plan,
    },
    subscription_data: {
      metadata: {
        userId: args.userId,
        plan: args.plan,
      },
    },
  });
};

export const createBillingPortalSession = async (args: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> => {
  const stripe = getStripe();
  return stripe.billingPortal.sessions.create({
    customer: args.customerId,
    return_url: args.returnUrl,
  });
};

/** Verifies a webhook signature and returns the parsed event. */
export const constructWebhookEvent = (
  rawBody: Buffer | string,
  signature: string,
): Stripe.Event => {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new AppError(httpStatus.SERVICE_UNAVAILABLE, "Webhook secret is not configured.");
  }
  const stripe = getStripe();
  try {
    return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Webhook signature verification failed: ${(err as Error).message}`,
    );
  }
};

export type { Stripe };
