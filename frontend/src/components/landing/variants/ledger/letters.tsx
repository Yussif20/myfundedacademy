"use client";

import { ScrollReveal } from "@/components/motion";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SectionHead } from "./ornaments";

type Letter = {
  name: string;
  role: string;
  body: string;
  bodyArabic: string;
  rating: number;
};

const LETTERS: Letter[] = [
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
 * "The Ledger Club" letters of reference — testimonials typeset as framed
 * letters: a gold serif drop cap opens each body (suppressed in Arabic, where
 * a floated initial would break letter joining), and the signature line runs
 * a dotted leader from the member's name to a gold mono rating.
 */
export function LedgerLetters() {
  const t = useTranslations("home.testimonials");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionHead index="№ 05" title={t("title")} sub={t("subtitle")} />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {LETTERS.map((letter, i) => (
            <ScrollReveal key={letter.name} delay={i * 0.1} amount={0.3}>
              <LetterPlate letter={letter} isAr={isAr} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LetterPlate({ letter, isAr }: { letter: Letter; isAr: boolean }) {
  const body = isAr ? letter.bodyArabic : letter.body;

  return (
    <article className="dxledger-frame dxledger-ticks-hover group relative flex h-full flex-col gap-5 p-7 transition-[border-color] duration-300 hover:border-[var(--dxledger-gold-strong)]">
      <p className="dxledger-dropcap flex-1 text-[15px] leading-relaxed text-[var(--foreground)]">
        {body}
      </p>

      {/* Signature line: name …… rating */}
      <footer className="border-t border-[var(--border)] pt-4">
        <div className="flex items-baseline gap-3">
          <span className="font-display truncate text-sm font-semibold tracking-tight">
            {letter.name}
          </span>
          <span className="dxledger-dots" aria-hidden />
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="font-mono text-sm font-semibold text-[var(--dxledger-gold)]">
              {letter.rating.toFixed(1)}
            </span>
            <Star
              className="size-3 fill-[var(--dxledger-gold)] text-[var(--dxledger-gold)]"
              aria-hidden
            />
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">{letter.role}</p>
      </footer>
    </article>
  );
}
