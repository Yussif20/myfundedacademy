/**
 * Read-only JSON dump of every table + a short summary (row counts, users by
 * role, courses by status). Run before any destructive data change.
 *
 * Usage: npm run db:backup   → server/backups/backup-<timestamp>.json (gitignored)
 */
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/db/db";

const MODELS = [
  "user",
  "instructorProfile",
  "category",
  "course",
  "section",
  "lesson",
  "lessonAttachment",
  "order",
  "subscription",
  "enrollment",
  "progress",
  "quiz",
  "quizQuestion",
  "quizOption",
  "quizAttempt",
  "certificate",
  "review",
] as const;

async function main(): Promise<void> {
  const dump: Record<string, unknown[]> = {};
  for (const model of MODELS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const delegate = (prisma as any)[model];
    if (!delegate) continue;
    dump[model] = await delegate.findMany();
    console.log(`${model.padEnd(18)} ${dump[model].length}`);
  }

  const users = (dump.user ?? []) as { role: string; email: string }[];
  const byRole = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});
  console.log("\nUsers by role:", byRole);

  const courses = (dump.course ?? []) as { slug: string; status: string; title: string }[];
  console.log("\nCourses:");
  for (const c of courses) console.log(`  [${c.status}] ${c.slug} — ${c.title}`);

  const dir = path.join(__dirname, "..", "backups");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(file, JSON.stringify(dump, null, 2));
  console.log(`\nSaved ${file}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
