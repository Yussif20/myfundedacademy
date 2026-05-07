"use client";

import { useRouter } from "@/i18n/navigation";
import { roleHome } from "@/lib/role-home";
import { useGetMeQuery } from "@/redux/api/usersApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: ("STUDENT" | "INSTRUCTOR" | "ADMIN")[];
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stored = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  const { isLoading, isError, error } = useGetMeQuery(undefined, {
    skip: !stored || !token,
  });

  const roleMismatch = Boolean(roles && stored?.role && !roles.includes(stored.role));

  useEffect(() => {
    if (!stored || !token) {
      router.replace("/login");
      return;
    }
    if (isError) {
      const status = (error as { status?: number })?.status;
      if (status === 401 || status === 403) {
        dispatch(logout());
        router.replace("/login");
      }
      return;
    }
    if (roleMismatch && stored?.role) {
      // Send the user to the surface that matches their role rather than a
      // dead-end 403 — keeps cross-role navigation friendly.
      router.replace(roleHome(stored.role) as Parameters<typeof router.replace>[0]);
    }
  }, [stored, token, isError, error, dispatch, router, roleMismatch]);

  if (!stored || !token || isLoading || roleMismatch) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--background)]">
        <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return <>{children}</>;
}
