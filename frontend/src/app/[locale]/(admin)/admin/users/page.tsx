"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Link } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useAppSelector } from "@/redux/store";
import {
  useDeleteUserMutation,
  useListUsersQuery,
  useUpdateUserMutation,
  type Profile,
  type UserRole,
} from "@/redux/api/usersApi";

import { Loader2, Plus, ShieldCheck, Trash2, UserCheck, UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AdminUsersPage() {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("common");
  const me = useAppSelector((s) => s.auth.user);

  const [page, setPage] = useState(1);
  const [role, setRole] = useState<UserRole | "">("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isFetching } = useListUsersQuery({
    page,
    limit: 20,
    role: role || undefined,
    search: search || undefined,
  });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const toggleStatus = async (u: Profile) => {
    const next = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (next === "SUSPENDED" && !confirm(t("confirmSuspend"))) return;
    try {
      await updateUser({ id: u.id, patch: { status: next } }).unwrap();
    } catch (err) {
      alert(extractApiError(err));
    }
  };

  const onDelete = async (u: Profile) => {
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteUser(u.id).unwrap();
    } catch (err) {
      alert(extractApiError(err));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new" className="gap-2">
            <Plus className="size-4" />
            {t("newButton")}
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("filtersTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSearch} className="grid gap-3 sm:grid-cols-[1fr_200px_auto]">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Select
              value={role}
              onChange={(e) => {
                setPage(1);
                setRole(e.target.value as UserRole | "");
              }}
            >
              <option value="">{t("allRoles")}</option>
              <option value="STUDENT">{t("role.STUDENT")}</option>
              <option value="INSTRUCTOR">{t("role.INSTRUCTOR")}</option>
              <option value="ADMIN">{t("role.ADMIN")}</option>
            </Select>
            <Button type="submit" variant="secondary">
              {tCommon("search")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("listTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
            </div>
          ) : !users.length ? (
            <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
              {t("noUsers")}
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {users.map((u) => {
                const isSelf = me?.id === u.id;
                const roleBadge =
                  u.role === "ADMIN" ? (
                    <Badge variant="warning" className="gap-1">
                      <ShieldCheck className="size-3" />
                      {t("role.ADMIN")}
                    </Badge>
                  ) : u.role === "INSTRUCTOR" ? (
                    <Badge variant="success">{t("role.INSTRUCTOR")}</Badge>
                  ) : (
                    <Badge variant="secondary">{t("role.STUDENT")}</Badge>
                  );
                const statusBadge =
                  u.status === "ACTIVE" ? (
                    <Badge variant="success">{t("status.ACTIVE")}</Badge>
                  ) : u.status === "SUSPENDED" ? (
                    <Badge variant="destructive">{t("status.SUSPENDED")}</Badge>
                  ) : (
                    <Badge variant="outline">{t("status.DELETED")}</Badge>
                  );
                return (
                  <li key={u.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-medium">{u.fullName}</span>
                        {roleBadge}
                        {statusBadge}
                        {!u.isEmailVerified && (
                          <Badge variant="outline" className="text-[10px]">
                            {t("unverified")}
                          </Badge>
                        )}
                        {isSelf && (
                          <Badge variant="outline" className="text-[10px]">
                            {t("you")}
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-[var(--muted-foreground)]">{u.email}</p>
                      {u.country && (
                        <p className="text-xs text-[var(--muted-foreground)]">{u.country}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {!isSelf && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={u.status === "ACTIVE" ? t("suspend") : t("reactivate")}
                            title={u.status === "ACTIVE" ? t("suspend") : t("reactivate")}
                            disabled={isUpdating}
                            onClick={() => toggleStatus(u)}
                          >
                            {u.status === "ACTIVE" ? (
                              <UserX className="size-4 text-[var(--accent)]" />
                            ) : (
                              <UserCheck className="size-4 text-[var(--primary)]" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={tCommon("delete")}
                            title={tCommon("delete")}
                            disabled={isDeleting}
                            onClick={() => onDelete(u)}
                          >
                            <Trash2 className="size-4 text-[var(--destructive)]" />
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {meta && meta.totalPage > 1 && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
              <p className="text-xs text-[var(--muted-foreground)]">
                {t("paginationLabel", {
                  page: meta.page,
                  totalPage: meta.totalPage,
                  total: meta.total,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {t("prev")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={page >= meta.totalPage || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("next")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
