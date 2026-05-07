"use client";

import { Button } from "@/components/ui/button";
import { extractApiError } from "@/lib/errors";
import { uploadToR2 } from "@/lib/uploads";
import { useAvatarPresignMutation } from "@/redux/api/uploadsApi";
import { Loader2, Trash2, Upload, UserCircle2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  /** Current avatar URL (e.g. user.profile). Empty string = no avatar yet. */
  value: string;
  /** Initial letter for the placeholder when no image is set. */
  initial?: string;
  /** Called with the new public URL after a successful upload, or "" on remove. */
  onChange: (url: string) => void | Promise<void>;
  /** Disable interaction (e.g. while parent form is saving). */
  disabled?: boolean;
};

export function AvatarUploader({ value, initial, onChange, disabled }: Props) {
  const t = useTranslations("avatarUploader");
  const inputRef = useRef<HTMLInputElement>(null);
  const [presign] = useAvatarPresignMutation();
  const [progress, setProgress] = useState<number | null>(null);

  const onPick = () => inputRef.current?.click();

  const onFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("errImage"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("errSize"));
      return;
    }
    setProgress(0);
    try {
      const presigned = await presign({
        fileName: file.name,
        contentType: file.type,
        contentLength: file.size,
      }).unwrap();

      await uploadToR2({
        uploadUrl: presigned.data.uploadUrl,
        headers: presigned.data.headers,
        file,
        onProgress: setProgress,
      });

      await onChange(presigned.data.publicUrl);
      toast.success(t("uploaded"));
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onRemove = async () => {
    if (!value) return;
    if (!confirm(t("removeConfirm"))) return;
    try {
      await onChange("");
      toast.success(t("removed"));
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const showProgress = progress !== null;

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <div
          className="grid size-24 place-items-center overflow-hidden rounded-full text-3xl font-semibold text-[var(--primary)]"
          style={{
            background: "color-mix(in oklch, var(--primary) 12%, transparent)",
            border: "2px solid color-mix(in oklch, var(--primary) 30%, transparent)",
          }}
        >
          {value ? (
            <Image
              src={value}
              alt="Profile photo"
              width={96}
              height={96}
              className="size-full object-cover"
              unoptimized
            />
          ) : initial ? (
            <span className="font-display">{initial.toUpperCase()}</span>
          ) : (
            <UserCircle2 className="size-12 opacity-70" />
          )}
        </div>
        {showProgress && (
          <div className="absolute inset-0 grid place-items-center rounded-full bg-black/50 text-xs font-semibold text-white">
            {progress}%
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
          className="hidden"
          disabled={disabled || showProgress}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={onPick}
            variant="outline"
            size="sm"
            disabled={disabled || showProgress}
            className="gap-2"
          >
            {showProgress ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {value ? t("change") : t("upload")}
          </Button>
          {value && !showProgress && (
            <Button
              type="button"
              onClick={onRemove}
              variant="ghost"
              size="sm"
              disabled={disabled}
              className="gap-2 text-[var(--destructive)] hover:text-[var(--destructive)]"
            >
              <Trash2 className="size-4" />
              {t("remove")}
            </Button>
          )}
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">{t("hint")}</p>
      </div>
    </div>
  );
}
