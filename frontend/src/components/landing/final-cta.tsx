import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

/** Closing invitation: a paper panel split with a photo of learners at work. */
export function FinalCta() {
  const t = useTranslations("home");

  return (
    <section className="pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="grid overflow-hidden rounded-2xl border border-border bg-paper-2 lg:grid-cols-2">
          <div className="relative aspect-[16/10] lg:order-last lg:aspect-auto lg:min-h-[30rem]">
            <Image
              src="/images/home/study.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-14 text-center md:px-14 md:py-20 lg:text-start">
            <Eyebrow className="justify-center lg:justify-start">{t("eyebrows.cta")}</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-normal leading-[1.08] tracking-tight text-balance md:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-6 max-w-xl leading-7 text-muted-foreground text-pretty max-lg:mx-auto md:text-lg">
              {t("pricingTeaser.subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
