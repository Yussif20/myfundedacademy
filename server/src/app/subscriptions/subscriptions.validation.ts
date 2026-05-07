import { z } from "zod";

export const SubscriptionsValidation = {
  checkout: z.object({
    body: z.object({
      plan: z.enum(["STARTER_MONTHLY", "PRO_MONTHLY", "PRO_ANNUAL"]),
    }),
  }),
};
