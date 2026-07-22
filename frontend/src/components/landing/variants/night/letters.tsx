"use client";

import { ScrollReveal } from "@/components/motion";
import { useLocale, useTranslations } from "next-intl";
import { EditionSection } from "./edition-section";

type Letter = {
  name: string;
  role: string;
  body: string;
  bodyArabic: string;
  rating: number;
};

/* Same voices as the shared testimonials section. */
const letters: Letter[] = [
  {
    name: "Ahmed K.",
    role: "Funded trader · FTMO 100k",
    rating: 5,
    body: "The risk-management course alone paid back the subscription in a week. The watermark on every video is a nice trust touch.",
    bodyArabic:
      "دورة إدارة المخاطر وحدها أعادت قيمة الاشتراك خلال أسبوع. والعلامة المائية على كل فيديو لمسة موثوقية رائعة.",
  },
  {
    name: "Lina M.",
    role: "Day trader · 2 years",
    rating: 5,
    body: "I've taken three other prop trading programs. This is the only one with instructors who actually publish their funded accounts.",
    bodyArabic:
      "أخذت ثلاثة برامج تداول أخرى. هذا الوحيد الذي يعرض فيه المدربون حساباتهم الممولة بشكل فعلي.",
  },
  {
    name: "Yusuf R.",
    role: "New trader",
    rating: 5,
    body: "The classroom UX is sharp — quizzes between modules made everything stick. Got my certificate in 6 weeks.",
    bodyArabic:
      "تجربة الفصل الدراسي رائعة — الاختبارات بين الوحدات جعلت كل شيء يثبت في ذهني. حصلت على شهادتي خلال 6 أسابيع.",
  },
];

/**
 * Testimonials as letters to the editor — three hairline-divided columns,
 * each opened by an oversized serif quote mark, closed by a signed dash line
 * and a vermilion star row in mono. No avatars, no glass, no glow.
 */
export function NightLetters({ index }: { index: string }) {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <EditionSection index={index}>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="max-w-2xl">
              <h2 className="dxnight-headline font-display text-3xl md:text-5xl">{t("title")}</h2>
              <p className="mt-3 text-[var(--muted-foreground)]">{t("subtitle")}</p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
            {letters.map((letter, i) => (
              <ScrollReveal key={letter.name} delay={i * 0.1} amount={0.3}>
                <article
                  className={`flex h-full flex-col md:pe-10 ${
                    i > 0
                      ? "border-t border-[var(--border)] pt-8 md:border-s md:border-t-0 md:ps-10 md:pt-0"
                      : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="font-display text-5xl leading-none text-[var(--accent)]"
                  >
                    “
                  </span>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[var(--foreground)]">
                    {isAr ? letter.bodyArabic : letter.body}
                  </p>
                  <div className="mt-6">
                    <div className="dxnight-hairline text-[var(--foreground)]" aria-hidden />
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-semibold">— {letter.name}</p>
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {letter.role}
                        </p>
                      </div>
                      <span
                        className="dxnight-mono text-xs text-[var(--accent)]"
                        aria-label={`${letter.rating}/5`}
                      >
                        {"★".repeat(letter.rating)}
                      </span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </EditionSection>
  );
}
