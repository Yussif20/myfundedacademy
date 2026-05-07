import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { InstructorProfile } from "@/redux/api/instructorsApi";
import Image from "next/image";
import { useLocale } from "next-intl";

export function InstructorCard({ instructor }: { instructor: InstructorProfile }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const headline = (isAr && instructor.headlineArabic) || instructor.headline;

  return (
    <Link
      href={{ pathname: `/instructors/${instructor.id}` }}
      className="group flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--primary)]/40"
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[var(--secondary)]">
        {instructor.user.profile ? (
          <Image
            src={instructor.user.profile}
            alt={instructor.user.fullName}
            fill
            className="object-cover"
            sizes="56px"
            unoptimized
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--primary)]/30 to-[var(--accent)]/20 font-display text-lg font-semibold text-[var(--primary)]">
            {instructor.user.fullName.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{instructor.user.fullName}</p>
          {instructor.isFeatured && <Badge variant="warning">★</Badge>}
        </div>
        {headline && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{headline}</p>
        )}
        {instructor.expertise.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {instructor.expertise.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
