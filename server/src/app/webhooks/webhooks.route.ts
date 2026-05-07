import express from "express";
import { StripeWebhookController } from "./webhooks.controller";

const router = express.Router();

// IMPORTANT: this route must receive the RAW body for Stripe signature
// verification. The route registration in routes.ts uses express.raw() to
// override the global express.json() middleware.
router.post("/stripe", StripeWebhookController);

export const WebhooksRoutes = router;
