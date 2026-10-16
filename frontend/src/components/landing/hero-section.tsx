import { LampGlow } from "@/components/brand/lamp-glow";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

/** Editorial hero: the headline on the reading side, a sunlit study photo on the other. */
export function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden">
      <LampGlow />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="text-center lg:text-start">
          <Reveal>
            <Eyebrow>{t("heroEyebrow")}</Eyebrow>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-8 font-display text-[clamp(2.75rem,5.4vw,4.75rem)] font-normal leading-[1.04] tracking-tight text-balance">
              {t.rich("heroTitle", {
                accent: (chunks) => <em className="font-normal italic text-primary">{chunks}</em>,
              })}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-muted-foreground text-pretty lg:mx-0">
              {t("heroSubtitle")}
            </p>
          </Reveal>

          <Reveal
            delay={240}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button asChild size="lg" className="group">
              <Link href="/courses">
                {t("heroCta")}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/courses">
                <PlayCircle className="size-4" aria-hidden />
                {t("heroSecondary")}
              </Link>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          {/* A thin gold offset frame behind the photo, like a passe-partout. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-2xl border border-gold/50 rtl:-translate-x-3"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-paper-2 shadow-[0_30px_60px_-30px_rgb(28_27_24/0.35)]">
            <Image
              src="/images/home/hero.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>

      <div className="horizon mx-auto max-w-7xl" />
    </section>
  );
}
