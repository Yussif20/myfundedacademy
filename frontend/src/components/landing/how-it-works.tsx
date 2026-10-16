import { IndexNumber } from "@/components/ui/index-number";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useTranslations } from "next-intl";

const steps = [
  { titleKey: "browseTitle", bodyKey: "browseBody" },
  { titleKey: "learnTitle", bodyKey: "learnBody" },
  { titleKey: "certifyTitle", bodyKey: "certifyBody" },
] as const;

/** Three numbered steps on a shared hairline, like the chapters of a book. */
export function HowItWorks() {
  const t = useTranslations("home.howItWorks");
  const tHome = useTranslations("home");

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={tHome("eyebrows.steps")}
            title={t("title")}
            lead={t("subtitle")}
          />
        </Reveal>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.titleKey} delay={i * 100} className="bg-card p-8 md:p-10">
              <IndexNumber n={i + 1} className="text-5xl font-light" />
              <p className="eyebrow mt-6 text-muted-foreground">
                {tHome("step")} {i + 1}
              </p>
              <h3 className="mt-2 font-display text-2xl font-medium tracking-tight">
                {t(step.titleKey)}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{t(step.bodyKey)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
