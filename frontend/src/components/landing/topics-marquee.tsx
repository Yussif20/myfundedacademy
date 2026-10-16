import { showcaseTopics } from "@/lib/showcase";
import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";

/** A quiet line of topics, separated by gold dots. (Was a scrolling marquee.) */
export function TopicsMarquee() {
  const t = useTranslations("home");
  const isAr = useLocale() === "ar";

  return (
    <section className="py-14">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="eyebrow">{t("trustedBy")}</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-display text-xl text-muted-foreground md:gap-x-5 md:text-2xl">
          {showcaseTopics.map((topic, i) => (
            <Fragment key={topic.en}>
              {i > 0 && (
                <li aria-hidden className="text-gold">
                  ·
                </li>
              )}
              <li>{isAr ? topic.ar : topic.en}</li>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
