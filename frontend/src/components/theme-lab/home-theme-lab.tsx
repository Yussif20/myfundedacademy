"use client";

import CurrentHome from "@/components/landing/variants/current/home";
import { DirectionSwitcher } from "@/components/theme-lab/direction-switcher";
import { isDirectionKey, type DirectionKey } from "@/components/theme-lab/directions";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ComponentType } from "react";

/**
 * PROTOTYPE — theme lab host for the home route.
 * Renders the home page in the visual identity picked via ?variant=<key> and
 * stamps html[data-direction] so the direction's token sheet (globals.css →
 * directions/<key>.css) restyles the header/footer chrome too.
 */
const VARIANT_HOMES: Record<Exclude<DirectionKey, "current">, ComponentType> = {
  phosphor: dynamic(() => import("@/components/landing/variants/phosphor/home")),
  ledger: dynamic(() => import("@/components/landing/variants/ledger/home")),
  night: dynamic(() => import("@/components/landing/variants/night/home")),
  holo: dynamic(() => import("@/components/landing/variants/holo/home")),
  burn: dynamic(() => import("@/components/landing/variants/burn/home")),
  acid: dynamic(() => import("@/components/landing/variants/acid/home")),
};

function ThemeLabInner() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("variant");
  const variant: DirectionKey = isDirectionKey(raw) ? raw : "current";

  useEffect(() => {
    const el = document.documentElement;
    if (variant === "current") {
      delete el.dataset.direction;
    } else {
      el.dataset.direction = variant;
    }
    return () => {
      delete el.dataset.direction;
    };
  }, [variant]);

  const VariantHome = variant === "current" ? CurrentHome : VARIANT_HOMES[variant];

  return (
    <>
      <VariantHome />
      <DirectionSwitcher current={variant} />
    </>
  );
}

export function HomeThemeLab() {
  return (
    <Suspense fallback={null}>
      <ThemeLabInner />
    </Suspense>
  );
}
