/**
 * Idempotent "Try the demo" seed: wipes demo-owned data (isDemo users and the
 * courses they own) and recreates it. Never touches non-demo rows.
 *
 * Usage: npm run seed:demo
 */
import "dotenv/config";
import { prisma } from "../src/lib/db/db";
import { resetDemoData } from "../src/app/demo/demo.seed";

resetDemoData(prisma)
  .then((summary) => console.log("Demo data reset:", JSON.stringify(summary, null, 2)))
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
