import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { showcaseTestimonials, type ShowcaseTestimonial } from "@/lib/showcase";
import { useLocale, useTranslations } from "next-intl";

/** Serif pull quotes on hairline columns, each opened by a large gold quote mark. */
export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const tHome = useTranslations("home");
  const isAr = useLocale() === "ar";

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={tHome("eyebrows.stories")}
            title={t("title")}
            lead={t("subtitle")}
          />
        </Reveal>

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border md:rtl:divide-x-reverse">
          {showcaseTestimonials.map((tm, i) => (
            <Reveal
              as="li"
              key={tm.name}
              delay={i * 100}
              className="md:px-10 md:first:ps-0 md:last:pe-0"
            >
              <Quote testimonial={tm} isAr={isAr} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Quote({ testimonial, isAr }: { testimonial: ShowcaseTestimonial; isAr: boolean }) {
  const body = isAr ? testimonial.bodyArabic : testimonial.body;
  const name = isAr ? testimonial.nameArabic : testimonial.name;
  const role = isAr ? testimonial.roleArabic : testimonial.role;

  return (
    <figure className="flex h-full flex-col">
      <span aria-hidden className="font-display text-6xl leading-none text-gold">
        {isAr ? "”" : "“"}
      </span>
      <blockquote className="mt-2 flex-1 font-display text-xl leading-8 text-foreground">
        {body}
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3">
        <span className="h-px w-8 bg-gold" aria-hidden />
        <span>
          <span className="block text-sm font-medium">{name}</span>
          <span className="block text-xs text-muted-foreground">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
