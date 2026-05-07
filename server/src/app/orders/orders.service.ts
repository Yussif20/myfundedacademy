import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { env } from "@/env";
import { createCourseCheckoutSession, getOrCreateCustomer } from "@/lib/payments/stripe";

export const OrdersService = {
  async checkoutCourse(userId: string, courseId: string) {
    const [user, course] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, fullName: true, stripeCustomerId: true },
      }),
      prisma.course.findFirst({
        where: { id: courseId, isDeleted: false, status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          oneTimePrice: true,
          accessTier: true,
        },
      }),
    ]);

    if (!user) throw new AppError(httpStatus.UNAUTHORIZED, "Sign in required.");
    if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not available.");
    if (course.oneTimePrice <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "This course doesn't support one-time purchase.");
    }

    // Already enrolled? Block to prevent duplicate purchases.
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existingEnrollment) {
      throw new AppError(httpStatus.CONFLICT, "You're already enrolled in this course.");
    }

    const customerId = await getOrCreateCustomer(user);

    // Frontend success page reads ?session_id={CHECKOUT_SESSION_ID}
    const successUrl = `${env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${env.FRONTEND_URL}/checkout/cancel`;

    const session = await createCourseCheckoutSession({
      customerId,
      userId,
      course,
      successUrl,
      cancelUrl,
    });

    // Persist a PENDING order so we have a paper trail even if the user
    // abandons checkout.
    await prisma.order.create({
      data: {
        userId,
        courseId,
        type: "ONE_TIME",
        status: "PENDING",
        amount: course.oneTimePrice,
        stripeSessionId: session.id,
      },
    });

    return { url: session.url, sessionId: session.id };
  },

  async listMyOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        course: {
          select: { id: true, slug: true, title: true, titleArabic: true, thumbnail: true },
        },
      },
    });
  },

  async getMyOrderBySession(userId: string, sessionId: string) {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        course: {
          select: { id: true, slug: true, title: true, titleArabic: true, thumbnail: true },
        },
      },
    });
    if (!order || order.userId !== userId) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found.");
    }
    return order;
  },
};
