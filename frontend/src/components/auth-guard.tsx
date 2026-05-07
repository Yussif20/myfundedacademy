"use client";

import { useRouter } from "@/i18n/navigation";
import { useGetMeQuery } from "@/redux/api/usersApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logout, setUser } from "@/redux/authSlice";
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
  const { data, isLoading, isError, error } = useGetMeQuery(undefined, {
    skip: !stored,
  });

  useEffect(() => {
    if (!stored) {
      router.replace("/login");
      return;
    }
    if (data?.data) {
      dispatch(
        setUser({
          user: {
            id: data.data.id,
            email: data.data.email,
            fullName: data.data.fullName,
            role: data.data.role,
          },
          token: "", // RTK reauth refreshes token automatically
        }),
      );
    }
    if (isError) {
      const status = (error as { status?: number })?.status;
      if (status === 401 || status === 403) {
        dispatch(logout());
        router.replace("/login");
      }
    }
  }, [stored, data, isError, error, dispatch, router]);

  if (!stored || isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--background)]">
        <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (roles && stored.role && !roles.includes(stored.role)) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="text-center">
          <p className="font-display text-3xl font-bold">403</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            You don't have access to this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
