"use client";

import { AvatarUploader } from "@/components/public/avatar-uploader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { useLogoutMutation } from "@/redux/api/authApi";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateMeMutation,
} from "@/redux/api/usersApi";
import { logout } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data, refetch } = useGetMeQuery();
  const me = data?.data;

  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changing }] = useChangePasswordMutation();
  const [doLogout] = useLogoutMutation();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  useEffect(() => {
    if (me) {
      setFullName(me.fullName);
      setBio(me.bio || "");
      setCountry(me.country || "");
    }
  }, [me]);

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileErr(null);
    try {
      await updateMe({ fullName, bio, country }).unwrap();
      setProfileMsg(t("saved"));
      refetch();
    } catch (err) {
      setProfileErr(extractApiError(err));
    }
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    setPwErr(null);
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setPwMsg(t("passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwErr(extractApiError(err));
    }
  };

  const onLogout = async () => {
    try {
      await doLogout().unwrap();
    } catch {
      // best effort; logout locally regardless
    }
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-4xl font-medium tracking-tight">{t("title")}</h1>
        <Button variant="outline" onClick={onLogout} className="gap-2 self-start sm:self-auto">
          <LogOut className="size-4" /> {tNav("signOut")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("profileSection")}</CardTitle>
          <CardDescription>{t("profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <AvatarUploader
              value={me?.profile || ""}
              initial={(me?.fullName || me?.email || "?").charAt(0)}
              onChange={async (url) => {
                try {
                  await updateMe({ profile: url }).unwrap();
                  refetch();
                } catch (err) {
                  setProfileErr(extractApiError(err));
                }
              }}
              disabled={saving}
            />
          </div>
          <form onSubmit={onSaveProfile} className="space-y-4">
            {profileErr && (
              <Alert variant="destructive">
                <AlertDescription>{profileErr}</AlertDescription>
              </Alert>
            )}
            {profileMsg && (
              <Alert variant="success">
                <AlertDescription>{profileMsg}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("fullNameLabel")}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">{t("bioLabel")}</Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t("countryLabel")}</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? tCommon("loading") : tCommon("saveChanges")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("passwordSection")}</CardTitle>
          <CardDescription>{t("passwordDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onChangePassword} className="space-y-4">
            {pwErr && (
              <Alert variant="destructive">
                <AlertDescription>{pwErr}</AlertDescription>
              </Alert>
            )}
            {pwMsg && (
              <Alert variant="success">
                <AlertDescription>{pwMsg}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("currentPasswordLabel")}</Label>
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={changing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("newPasswordLabel")}</Label>
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                disabled={changing}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={changing}>
                {changing ? tCommon("loading") : tCommon("save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
