import express from "express";
import { requestsLimiter } from "@/middlewares/rateLimiter";
import { DemoController } from "./demo.controller";

const router = express.Router();

// Called nightly by .github/workflows/demo-reset.yml with the shared secret.
router.post("/demo-reset", requestsLimiter(3600, 6), DemoController.reset);

export const InternalRoutes = router;
