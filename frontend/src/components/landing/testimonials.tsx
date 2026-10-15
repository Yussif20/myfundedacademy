"use client";

import { ScrollReveal } from "@/components/motion";
import { Quote, Star } from "lucide-react";
import { showcaseTestimonials, type ShowcaseTestimonial } from "@/lib/showcase";
import { useLocale, useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-balance text-3xl font-bold tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">{t("subtitle")}</p>
          </div>
        </ScrollReveal>

        {/* Mobile: horizontal scroll-snap carousel */}
        <div className="mask-fade-edges -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:hidden">
          {showcaseTestimonials.map((tm) => (
            <div key={tm.name} className="w-[80%] shrink-0 snap-center">
              <TestimonialCard testimonial={tm} isAr={isAr} />
            </div>
          ))}
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {showcaseTestimonials.map((tm, i) => (
            <ScrollReveal key={tm.name} delay={i * 0.1} amount={0.3}>
              <TestimonialCard testimonial={tm} isAr={isAr} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  isAr,
}: {
  testimonial: ShowcaseTestimonial;
  isAr: boolean;
}) {
  const body = isAr ? testimonial.bodyArabic : testimonial.body;
  const name = isAr ? testimonial.nameArabic : testimonial.name;
  const role = isAr ? testimonial.roleArabic : testimonial.role;

  return (
    <div className="group relative h-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in oklch, var(--primary) 30%, transparent), transparent 70%)",
        }}
      />
      <article className="glass relative flex h-full flex-col gap-5 rounded-2xl p-7 transition-transform duration-500 group-hover:-translate-y-1">
        <Quote className="size-7 text-[var(--primary)] opacity-40" aria-hidden />
        <p className="flex-1 text-[15px] leading-relaxed text-[var(--foreground)]">{body}</p>
        <div className="flex items-center justify-between border-t border-[color-mix(in_oklch,var(--border)_60%,transparent)] pt-4">
          <div className="flex items-center gap-3">
            <span
              className="grid size-10 place-items-center rounded-full font-display text-sm font-semibold text-[var(--primary)]"
              style={{
                background: "color-mix(in oklch, var(--primary) 15%, transparent)",
                border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
              }}
            >
              {testimonial.initials}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{role}</p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-[var(--accent)] text-[var(--accent)]" />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
