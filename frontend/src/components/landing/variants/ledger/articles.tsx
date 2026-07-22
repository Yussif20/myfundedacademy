"use client";

import { ScrollReveal } from "@/components/motion";
import { Award, BookOpen, Compass, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionHead } from "./ornaments";

type Article = {
  icon: LucideIcon;
  numeral: string;
  titleKey: "browseTitle" | "learnTitle" | "certifyTitle";
  bodyKey: "browseBody" | "learnBody" | "certifyBody";
};

const ARTICLES: Article[] = [
  { icon: Compass, numeral: "I", titleKey: "browseTitle", bodyKey: "browseBody" },
  { icon: BookOpen, numeral: "II", titleKey: "learnTitle", bodyKey: "learnBody" },
  { icon: Award, numeral: "III", titleKey: "certifyTitle", bodyKey: "certifyBody" },
];

/**
 * "The Ledger Club" articles of admission — how-it-works recast as three
 * numbered clauses of a charter: Roman-numeral plates in Fraunces gold, a
 * dotted leader running to a small engraved icon, and the clause text
 * beneath. Registration ticks appear as each article is inspected.
 */
export function LedgerArticles() {
  const t = useTranslations("home.howItWorks");

  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionHead index="№ 01" title={t("title")} sub={t("subtitle")} />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {ARTICLES.map((article, i) => (
            <ScrollReveal key={article.titleKey} delay={i * 0.12} amount={0.3}>
              <ArticleClause
                Icon={article.icon}
                numeral={article.numeral}
                title={t(article.titleKey)}
                body={t(article.bodyKey)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleClause({
  Icon,
  numeral,
  title,
  body,
}: {
  Icon: LucideIcon;
  numeral: string;
  title: string;
  body: string;
}) {
  return (
    <div className="dxledger-frame dxledger-ticks-hover group relative h-full p-7 transition-[border-color] duration-300 hover:border-[var(--dxledger-gold-strong)]">
      {/* Clause header: Roman numeral …… engraved icon */}
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-3xl font-semibold leading-none text-[var(--dxledger-gold)]"
          aria-hidden
        >
          {numeral}.
        </span>
        <span className="dxledger-dots" aria-hidden />
        <Icon
          className="size-5 shrink-0 translate-y-0.5 text-[var(--dxledger-gold)] opacity-70"
          aria-hidden
        />
      </div>

      <h3 className="font-display mt-6 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
    </div>
  );
}
