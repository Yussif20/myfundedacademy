"use client";

import { showcaseTopics } from "@/lib/showcase";
import { useLocale, useTranslations } from "next-intl";

export function TopicsMarquee() {
  const t = useTranslations("home");
  const isAr = useLocale() === "ar";

  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {t("trustedBy")}
        </p>
        <div className="mask-fade-edges relative overflow-hidden">
          <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
            {[...showcaseTopics, ...showcaseTopics].map((topic, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center px-2 font-display text-xl font-semibold tracking-tight text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] md:text-2xl"
              >
                {isAr ? topic.ar : topic.en}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
