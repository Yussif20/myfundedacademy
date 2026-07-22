"use client";

import { ScrollReveal } from "@/components/motion";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type Testimonial = {
  name: string;
  role: string;
  body: string;
  bodyArabic: string;
  initials: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ahmed K.",
    role: "Funded trader · FTMO 100k",
    initials: "AK",
    rating: 5,
    body: "The risk-management course alone paid back the subscription in a week. The watermark on every video is a nice trust touch.",
    bodyArabic:
      "دورة إدارة المخاطر وحدها أعادت قيمة الاشتراك خلال أسبوع. والعلامة المائية على كل فيديو لمسة موثوقية رائعة.",
  },
  {
    name: "Lina M.",
    role: "Day trader · 2 years",
    initials: "LM",
    rating: 5,
    body: "I've taken three other prop trading programs. This is the only one with instructors who actually publish their funded accounts.",
    bodyArabic:
      "أخذت ثلاثة برامج تداول أخرى. هذا الوحيد الذي يعرض فيه المدربون حساباتهم الممولة بشكل فعلي.",
  },
  {
    name: "Yusuf R.",
    role: "New trader",
    initials: "YR",
    rating: 5,
    body: "The classroom UX is sharp — quizzes between modules made everything stick. Got my certificate in 6 weeks.",
    bodyArabic:
      "تجربة الفصل الدراسي رائعة — الاختبارات بين الوحدات جعلت كل شيء يثبت في ذهني. حصلت على شهادتي خلال 6 أسابيع.",
  },
];

/** Testimonials as one hairline-partitioned obsidian panel — three ruled
 *  columns like adjacent terminal panes, mono ratings, prism-ringed initials. */
export function HoloTestimonials() {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="flex justify-center">
              <span className="dxholo-eyebrow">07</span>
            </div>
            <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">{t("subtitle")}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal amount={0.2}>
          <div className="dxholo-glass grid overflow-hidden rounded-[10px] md:grid-cols-3">
            {TESTIMONIALS.map((tm, i) => (
              <article
                key={tm.name}
                className={`flex h-full flex-col gap-5 p-7 ${
                  i > 0 ? "border-t border-[var(--border)] md:border-s md:border-t-0" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="dxholo-num text-xs font-semibold text-[#FFC46B]">
                    {tm.rating.toFixed(1)}
                  </span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: tm.rating }).map((_, star) => (
                      <Star
                        key={star}
                        className="size-3.5 fill-[#FFC46B] text-[#FFC46B]"
                        aria-hidden
                      />
                    ))}
                  </span>
                </div>

                <p className="flex-1 text-[15px] leading-relaxed text-[var(--foreground)]">
                  {isAr ? tm.bodyArabic : tm.body}
                </p>

                <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
                  <span className="dxholo-avatar-ring">
                    <span className="font-display grid size-9 place-items-center rounded-full bg-[var(--card)] text-xs font-semibold text-[var(--foreground)]">
                      {tm.initials}
                    </span>
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-[var(--foreground)]">
                      {tm.name}
                    </span>
                    <span className="block text-xs text-[var(--muted-foreground)]">{tm.role}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
