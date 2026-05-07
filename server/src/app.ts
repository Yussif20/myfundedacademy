import {
  attachUser,
  errorMiddleware,
  i18nextMiddleware,
  notFoundMiddleware,
  rootMiddleware,
} from "@/middlewares";
import router from "@/routes";
import { env } from "@/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import path from "path";
import rateLimiterMiddleware from "./middlewares/rateLimiter";
import { StripeWebhookController } from "@/app/webhooks/webhooks.controller";

const app: Application = express();
app.set("trust proxy", 1);

const corsOrigins = [
  "https://myfundedacademy.com",
  "https://www.myfundedacademy.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  env.BASE_URL_CLIENT,
].filter(Boolean);

app.use(rateLimiterMiddleware);
app.use(helmet());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);

// Stripe webhook MUST receive the raw request body so the signature
// verification works. Register it BEFORE express.json() takes over.
app.post(
  "/api/v1/webhooks/stripe",
  express.raw({ type: "application/json" }),
  StripeWebhookController,
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/public", express.static(path.join(process.cwd(), "public")));

app.use(i18nextMiddleware);
app.use(attachUser);

app.get("/", rootMiddleware);
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1", router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
