"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/account", label: "Profile" },
  { href: "/account/courses", label: "My courses" },
  { href: "/account/certificates", label: "Certificates" },
  { href: "/account/billing", label: "Billing" },
];

type AccountPath = "/account" | "/account/courses" | "/account/certificates" | "/account/billing";

export function AccountSubNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-8 flex gap-1 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href as AccountPath}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
              active
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]",
            )}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
