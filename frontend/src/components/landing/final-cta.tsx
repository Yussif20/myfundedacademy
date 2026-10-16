import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

/** Closing invitation: a quiet paper panel with a serif headline. */
export function FinalCta() {
  const t = useTranslations("home");

  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="relative overflow-hidden rounded-2xl border border-border bg-paper-2 px-6 py-16 text-center md:px-16 md:py-24">
          <Eyebrow className="justify-center">{t("eyebrows.cta")}</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-normal leading-[1.08] tracking-tight text-balance md:text-6xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-7 text-muted-foreground text-pretty md:text-lg">
            {t("pricingTeaser.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/pricing">
                {t("pricingTeaser.cta")}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">{t("ctaButton")}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
