"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Sheet } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Shared shell for the admin and instructor workspaces. Renders a sticky
 * header with brand + locale + theme controls, a desktop sidebar to the
 * inline-start, and a mobile drawer that holds the same sidebar content.
 * Drawer auto-closes on route change.
 */
export function WorkspaceShell({ sidebar, children }: Props) {
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={tCommon("menu")}
              className="grid size-9 place-items-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
            <Link href="/" aria-label="Home">
              <Wordmark height={44} />
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20">{sidebar}</div>
        </aside>

        <section className="min-w-0 flex-1">{children}</section>
      </div>

      <Sheet open={open} onOpenChange={setOpen} side="start" title={tCommon("menu")}>
        {sidebar}
      </Sheet>
    </main>
  );
}
