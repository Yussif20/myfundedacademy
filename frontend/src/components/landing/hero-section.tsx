import { LampGlow } from "@/components/brand/lamp-glow";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden">
      <LampGlow />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-24 text-center md:pb-32 md:pt-32">
        <Reveal>
          <Eyebrow>{t("heroEyebrow")}</Eyebrow>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 font-display text-[clamp(2.75rem,6vw,5rem)] font-normal leading-[1.04] tracking-tight text-balance">
            {t.rich("heroTitle", {
              accent: (chunks) => <em className="font-normal italic text-primary">{chunks}</em>,
            })}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
            {t("heroSubtitle")}
          </p>
        </Reveal>

        <Reveal
          delay={240}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
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

      <div className="horizon mx-auto max-w-5xl" />
    </section>
  );
}
