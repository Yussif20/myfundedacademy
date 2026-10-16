"use client";

import { Link } from "@/i18n/navigation";
import { roleHome } from "@/lib/role-home";
import { useLogoutMutation } from "@/redux/api/authApi";
import { logout as logoutAction } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LayoutDashboard, LogOut, ShieldCheck, UserSquare2 } from "lucide-react";
import type { useTranslations } from "next-intl";

/**
 * Signed-in account dropdown used by the public header. Token-driven so it
 * follows the light/dark theme.
 */
export function UserMenu({
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
          className="ms-1 grid size-9 place-items-center rounded-full border border-primary/30 bg-primary/10 font-display text-base text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {initial}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-40 w-64 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg shadow-foreground/5"
        >
          <div className="mb-1 px-3 py-2.5">
            <p className="line-clamp-1 font-display text-base">{user.fullName || "—"}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">{user.email}</p>
            <span className="eyebrow mt-2 inline-flex items-center rounded-full border border-gold/40 px-2 py-0.5">
              {user.role || "STUDENT"}
            </span>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild>
            <Link
              href={home as "/account" | "/instructor" | "/admin"}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-paper-2 focus:bg-paper-2"
            >
              <DashIcon className="size-4 text-primary" />
              {dashLabel}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button
              type="button"
              onClick={onSignOut}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/8 focus:bg-destructive/8"
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
