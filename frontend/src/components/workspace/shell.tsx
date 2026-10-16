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
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={tCommon("menu")}
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-paper-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
            <Link href="/" aria-label="Home">
              <Wordmark height={36} />
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-10">
        <aside className="hidden w-56 shrink-0 border-e border-border pe-4 md:block">
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
