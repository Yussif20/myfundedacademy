import chalk from "chalk";
import "dotenv/config";
import { z } from "zod";
import { logger } from "./utils/logger";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PROJECT_NAME: z.string().min(1).default("Nibras"),
  PORT: z.coerce.number().positive().max(65536).default(5000),

  BASE_URL_SERVER_DEV: z.string().url(),
  BASE_URL_SERVER: z.string().url(),
  BASE_URL_CLIENT: z.string().url(),
  COOKIE_DOMAIN: z.string().optional().default(""),
  CORS_ORIGINS: z.string().optional().default(""),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1).optional(),

  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  INVITE_TOKEN_SECRET: z.string().min(1),

  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(1),

  RESEND_API_KEY: z.string().optional().default(""),
  EMAIL_FROM: z.string().optional().default("no-reply@nibras.yousefayman.com"),

  STRIPE_SECRET_KEY: z.string().optional().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(""),
  STRIPE_CONNECT_CLIENT_ID: z.string().optional().default(""),
  STRIPE_PRICE_STARTER_MONTHLY: z.string().optional().default(""),
  STRIPE_PRICE_PRO_MONTHLY: z.string().optional().default(""),
  STRIPE_PRICE_PRO_ANNUAL: z.string().optional().default(""),

  VDOCIPHER_API_SECRET: z.string().optional().default(""),

  S3_ACCESS_KEY: z.string().optional().default(""),
  S3_SECRET_KEY: z.string().optional().default(""),
  S3_BUCKET: z.string().optional().default(""),
  S3_REGION: z.string().optional().default("auto"),
  S3_ENDPOINT: z.string().optional().default(""),
  S3_PUBLIC_URL: z.string().optional().default(""),
});

type EnvBase = z.infer<typeof EnvSchema>;

type EnvType = EnvBase & {
  FRONTEND_URL: string;
  SERVER_URL: string;
};

let env: EnvType;

try {
  const parsed = EnvSchema.parse(process.env);
  env = {
    ...parsed,
    FRONTEND_URL: parsed.BASE_URL_CLIENT,
    SERVER_URL:
      parsed.NODE_ENV === "development" ? parsed.BASE_URL_SERVER_DEV : parsed.BASE_URL_SERVER,
  };
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log(
      chalk.bgRedBright.white.bold("\n ❌ ") +
        chalk.bgRedBright.black.bold(" ENV VALIDATION FAILED ") +
        chalk.bgRedBright.yellow.bold(" ❌ \n"),
    );
    logger.error("Env validation error");
    err.issues.forEach((e) => {
      console.log(
        chalk.yellow("• ") +
          chalk.cyanBright(e.path.join(".")) +
          chalk.redBright(` → ${e.message}`),
      );
    });
    console.log(chalk.magentaBright("\nFix your .env (see .env.example) before running.\n"));
    process.exit(1);
  }
  throw err;
}

export { env };
