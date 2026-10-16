"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, DollarSign, LayoutDashboard, UserSquare2, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const items = [
  { href: "/instructor", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/instructor/profile", icon: UserSquare2, key: "profile" as const },
  { href: "/instructor/courses", icon: BookOpen, key: "courses" as const },
  { href: "/instructor/students", icon: Users, key: "students" as const },
  { href: "/instructor/earnings", icon: DollarSign, key: "earnings" as const },
];

export function InstructorSidebar() {
  const pathname = usePathname();
  const t = useTranslations("instructor.nav");

  return (
    <nav className="space-y-0.5">
      {items.map((it) => {
        const active =
          it.href === "/instructor"
            ? pathname === "/instructor"
            : pathname === it.href || pathname.startsWith(it.href + "/");
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "group flex items-center gap-3 rounded-e-lg border-s-2 px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-s-primary bg-primary/8 text-primary"
                : "border-s-transparent text-muted-foreground hover:bg-paper-2 hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <it.icon className="size-4" aria-hidden />
            {t(it.key)}
          </Link>
        );
      })}
    </nav>
  );
}
