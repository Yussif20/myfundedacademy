/**
 * One-shot backfill: tombstone the emails of users who were soft-deleted before
 * the admin Delete endpoint started rewriting emails. Idempotent — running it
 * twice is a no-op because already-tombstoned emails end with @purged.local.
 *
 * Usage: npm run backfill:tombstone-emails
 */
import { prisma } from "../src/lib/db/db";
import { logger } from "../src/utils/logger";

async function main(): Promise<void> {
  const orphans = await prisma.user.findMany({
    where: {
      isDeleted: true,
      NOT: { email: { endsWith: "@purged.local" } },
    },
    select: { id: true, email: true },
  });

  if (!orphans.length) {
    logger.info("No un-tombstoned deleted users found. Nothing to do.", { type: "BACKFILL" });
    return;
  }

  logger.info(`Found ${orphans.length} user(s) to tombstone.`, { type: "BACKFILL" });

  for (const u of orphans) {
    const tombstone = `deleted+${u.id}+${u.email}@purged.local`.toLowerCase();
    await prisma.user.update({
      where: { id: u.id },
      data: { email: tombstone },
    });
    logger.success(`${u.email} -> ${tombstone}`, { type: "BACKFILL" });
  }

  logger.success(`Done. Tombstoned ${orphans.length} email(s).`, { type: "BACKFILL" });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
