"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const items: Array<{ href: AccountPath; key: "profile" | "courses" | "certificates" | "billing" }> =
  [
    { href: "/account", key: "profile" },
    { href: "/account/courses", key: "courses" },
    { href: "/account/certificates", key: "certificates" },
    { href: "/account/billing", key: "billing" },
  ];

type AccountPath = "/account" | "/account/courses" | "/account/certificates" | "/account/billing";

export function AccountSubNav() {
  const pathname = usePathname();
  const t = useTranslations("accountNav");
  return (
    <nav className="mb-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-card p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-paper-2 hover:text-foreground",
            )}
          >
            {t(it.key)}
          </Link>
        );
      })}
    </nav>
  );
}
