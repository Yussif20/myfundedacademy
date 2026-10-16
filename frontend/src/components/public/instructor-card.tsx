import { Link } from "@/i18n/navigation";
import type { InstructorProfile } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";

export function InstructorCard({ instructor }: { instructor: InstructorProfile }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const headline = (isAr && instructor.headlineArabic) || instructor.headline;

  return (
    <Link
      href={{ pathname: `/instructors/${instructor.id}` }}
      className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-border bg-paper-2">
        {instructor.user.profile ? (
          <Image
            src={instructor.user.profile}
            alt=""
            fill
            className="object-cover"
            sizes="56px"
            unoptimized
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-xl text-primary">
            {instructor.user.fullName.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg leading-tight">{instructor.user.fullName}</p>
        {headline && (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{headline}</p>
        )}
        {instructor.expertise.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {instructor.expertise.slice(0, 3).join(" · ")}
          </p>
        )}
      </div>
      <ArrowRight
        className="mt-1 size-4 shrink-0 text-rule-strong transition-transform group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
