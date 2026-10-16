"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const switchTo = locale === "en" ? "ar" : "en";
  const label = locale === "en" ? t("arabic") : t("english");

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: switchTo })}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-sm",
        "text-muted-foreground transition-colors hover:border-rule-strong/60 hover:text-foreground",
      )}
      aria-label={t("switchLocale")}
    >
      <Globe className="size-4" aria-hidden />
      <span>{label}</span>
    </button>
  );
}
