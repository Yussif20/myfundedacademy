"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { type CSSProperties } from "react";
import { SnapIn } from "./snap";

/**
 * Acid Ledger closing entry — the final page of the ledger: one hard-shadow
 * sheet on the graph-paper ground, a giant hollow ↗ bleeding off its corner,
 * a live eyebrow sticker, the Archivo Black closing line, and the two CTAs
 * that physically click. A magenta stamp seals the book.
 */
export function AcidFinalCta() {
  const t = useTranslations("home");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SnapIn>
          <div className="dxacid-hard dxacid-grid relative overflow-hidden p-10 text-center md:p-16">
            <span
              aria-hidden
              className="dxacid-watermark bottom-[-0.18em] end-[-0.1em] text-[clamp(8rem,20vw,16rem)]"
            >
              ↗
            </span>

            <span
              aria-hidden
              className="dxacid-stamp absolute start-6 top-6 hidden md:inline-block"
              style={{
                transform: "rotate(calc(-6deg * var(--dxacid-flip)))",
              }}
            >
              № 001
            </span>

            <div className="relative">
              <span
                className="dxacid-sticker"
                style={{ "--dxacid-tilt": "-2deg" } as CSSProperties}
              >
                <span className="dxacid-led animate-pulse" aria-hidden />
                {t("pricingTeaser.title")}
              </span>

              <h2 className="font-display mx-auto mt-8 max-w-3xl text-balance text-4xl md:text-6xl">
                {t("ctaTitle")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-balance font-mono text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
                {t("pricingTeaser.subtitle")}
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
                <Link
                  href="/pricing"
                  className="dxacid-btn inline-flex h-13 items-center gap-2 px-8 text-sm"
                >
                  {t("pricingTeaser.cta")}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </Link>
                <Link
                  href="/signup"
                  className="dxacid-btn-ghost inline-flex h-13 items-center px-7 text-sm"
                >
                  {t("ctaButton")}
                </Link>
              </div>
            </div>
          </div>
        </SnapIn>
      </div>
    </section>
  );
}
