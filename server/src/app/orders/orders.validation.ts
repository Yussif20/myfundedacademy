import { z } from "zod";

export const OrdersValidation = {
  checkoutCourse: z.object({
    body: z.object({
      courseId: z.string().uuid(),
    }),
  }),
};
