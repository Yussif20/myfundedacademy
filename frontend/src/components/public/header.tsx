"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { roleHome } from "@/lib/role-home";
import { useLogoutMutation } from "@/redux/api/authApi";
import { logout as logoutAction } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LayoutDashboard, LogOut, ShieldCheck, UserSquare2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function PublicHeader() {
  const t = useTranslations("nav");
  const user = useAppSelector((s) => s.auth.user);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="Home">
          <Wordmark height={52} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/courses" label={t("courses")} />
          <NavLink href="/instructors" label={t("instructors")} />
          <NavLink href="/pricing" label={t("pricing")} />
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} t={t} />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">{t("signUp")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  user,
  t,
}: {
  user: { fullName?: string; email?: string; role?: string };
  t: ReturnType<typeof useTranslations>;
}) {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const initial = (user.fullName || user.email || "?").charAt(0).toUpperCase();
  const home = roleHome(user.role);
  const dashLabel =
    user.role === "ADMIN"
      ? t("adminPanel")
      : user.role === "INSTRUCTOR"
        ? t("instructorWorkspace")
        : t("studentDashboard");
  const DashIcon =
    user.role === "ADMIN"
      ? ShieldCheck
      : user.role === "INSTRUCTOR"
        ? LayoutDashboard
        : UserSquare2;

  const onSignOut = async () => {
    try {
      await logout().unwrap();
    } catch {
      // even if logout API fails, drop client state
    }
    dispatch(logoutAction());
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Account menu"
          className="ml-1 grid size-9 place-items-center rounded-full text-sm font-semibold text-[var(--primary)] transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          style={{
            background: "color-mix(in oklch, var(--primary) 15%, transparent)",
            border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
          }}
        >
          {initial}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-40 w-64 overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_92%,transparent)] p-1 shadow-xl shadow-black/20 backdrop-blur"
        >
          <div className="mb-1 px-3 py-2.5">
            <p className="line-clamp-1 text-sm font-semibold">{user.fullName || "—"}</p>
            <p className="line-clamp-1 text-xs text-[var(--muted-foreground)]">{user.email}</p>
            <span
              className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]"
              style={{
                background: "color-mix(in oklch, var(--primary) 12%, transparent)",
                color: "var(--primary)",
                border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
              }}
            >
              {user.role || "STUDENT"}
            </span>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-[color-mix(in_oklch,var(--border)_70%,transparent)]" />
          <DropdownMenu.Item asChild>
            <Link
              href={home as "/account" | "/instructor" | "/admin"}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-[color-mix(in_oklch,var(--primary)_8%,transparent)] focus:bg-[color-mix(in_oklch,var(--primary)_8%,transparent)]"
            >
              <DashIcon className="size-4 text-[var(--primary)]" />
              {dashLabel}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={onSignOut}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--destructive)] outline-none transition-colors hover:bg-[color-mix(in_oklch,var(--destructive)_8%,transparent)] focus:bg-[color-mix(in_oklch,var(--destructive)_8%,transparent)]"
            >
              <LogOut className="size-4" />
              {t("signOut")}
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function NavLink({
  href,
  label,
}: {
  href: "/courses" | "/instructors" | "/pricing";
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
    >
      {label}
    </Link>
  );
}
