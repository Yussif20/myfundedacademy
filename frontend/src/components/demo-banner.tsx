"use client";

import { useAppSelector } from "@/redux/store";
import { FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/** Thin strip shown on every page while signed in to a "Try the demo" account. */
export function DemoBanner() {
  const t = useTranslations("demoBanner");
  const isDemo = useAppSelector((s) => s.auth.user?.isDemo === true);
  // Auth state is rehydrated from localStorage, so wait for mount to avoid a
  // hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !isDemo) return null;

  return (
    <div
      role="status"
      data-testid="demo-banner"
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 border-b border-gold/40 bg-paper-2 px-4 py-1.5 text-center text-xs font-medium text-foreground"
    >
      <FlaskConical className="size-3.5 shrink-0 text-accent" aria-hidden />
      <span>{t("text")}</span>
      <span aria-hidden className="text-gold">
        ·
      </span>
      <span>{t("card")}</span>
    </div>
  );
}
