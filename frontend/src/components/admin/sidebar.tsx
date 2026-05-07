"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, LayoutDashboard, Tag, UserSquare2, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const items = [
  { href: "/admin", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/admin/categories", icon: Tag, key: "categories" as const },
  { href: "/admin/instructors", icon: Users, key: "instructors" as const },
  { href: "/admin/courses", icon: BookOpen, key: "courses" as const },
  { href: "/admin/profile", icon: UserSquare2, key: "profile" as const },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("admin.nav");

  return (
    <nav className="space-y-1">
      {items.map((it) => {
        const active =
          it.href === "/admin"
            ? pathname === "/admin"
            : pathname === it.href || pathname.startsWith(it.href + "/");
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]",
            )}
          >
            <it.icon className="size-4" aria-hidden />
            {t(it.key)}
          </Link>
        );
      })}
    </nav>
  );
}
