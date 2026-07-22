"use client";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/public/user-menu";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { useAppSelector } from "@/redux/store";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type NavHref = "/courses" | "/instructors" | "/pricing";

const NAV: { href: NavHref; key: "courses" | "instructors" | "pricing"; index: string }[] = [
  { href: "/courses", key: "courses", index: "01" },
  { href: "/instructors", key: "instructors", index: "02" },
  { href: "/pricing", key: "pricing", index: "03" },
];

/**
 * Phosphor Terminal Noir — brand lockup.
 * The shared SVG wordmark is teal, so the identity carries a typographic
 * callsign instead: a hairline-boxed mono "MFA" cell + a stacked small-caps
 * Archivo lockup. Language-neutral by design.
 */
export function PhosphorBrand() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center border border-[var(--primary)] font-mono text-[11px] font-bold leading-none tracking-[0.08em] text-[var(--primary)]"
      >
        MFA
      </span>
      <span className="font-display flex flex-col text-[11px] font-bold uppercase leading-[1.3] tracking-[0.18em] text-[var(--foreground)]">
        <span>My Funded</span>
        <span>Academy</span>
      </span>
    </span>
  );
}

/** Live UTC clock — digits only, language-neutral. Placeholder until mounted. */
function UtcClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-[10px] tracking-[0.08em] text-[var(--muted-foreground)]">
      {time ?? "--:--:--"} UTC
    </span>
  );
}

/**
 * Sticky terminal command bar. Two rows: a hairline telemetry strip
 * (LED · callsign · UTC clock) and the main rail with indexed nav links.
 * Solid carbon — no glass, no blur; depth comes from the hairline only.
 */
export function PhosphorHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]">
      {/* Telemetry strip — decorative, language-neutral */}
      <div
        aria-hidden
        className="hidden items-center justify-between border-b border-[var(--border)] px-6 py-1.5 sm:flex"
      >
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
          <span className="dxphosphor-led dxphosphor-led--cyan" />
          MFA/TERMINAL
        </span>
        <span className="flex items-center gap-4 font-mono text-[10px] tracking-[0.08em] text-[var(--muted-foreground)]">
          <span>EN·AR</span>
          <UtcClock />
        </span>
      </div>

      {/* Main rail */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Home" className="shrink-0">
          <PhosphorBrand />
        </Link>

        <nav className="hidden items-center md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <span
                aria-hidden
                className="font-mono text-[10px] text-[var(--muted-foreground)] opacity-50 transition-all group-hover:text-[var(--primary)] group-hover:opacity-100"
              >
                {item.index}
              </span>
              <span className="relative">
                {t(item.key)}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-200 group-hover:scale-x-100 rtl:origin-right"
                />
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          {user ? (
            <UserMenu user={user} t={t} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm" className="rounded-[2px]">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button asChild size="sm" className="rounded-[2px]">
                <Link href="/signup">{t("signUp")}</Link>
              </Button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={tCommon("menu")}
            className="grid size-9 place-items-center rounded-[2px] border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* Mobile drawer — restyled by the direction tokens (sharp radii, carbon) */}
      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        <div className="flex h-full flex-col gap-4">
          <nav className="flex flex-col border-t border-[var(--border)]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 border-b border-[var(--border)] px-2 py-3.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--secondary)]"
              >
                <span aria-hidden className="font-mono text-[10px] text-[var(--primary)]">
                  {item.index}
                </span>
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="border border-[var(--border)] p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
              {t("preferences")}
            </p>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
          {!user && (
            <div className="mt-auto flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full rounded-[2px]">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button asChild className="w-full rounded-[2px]">
                <Link href="/signup">{t("signUp")}</Link>
              </Button>
            </div>
          )}
        </div>
      </Sheet>
    </header>
  );
}
