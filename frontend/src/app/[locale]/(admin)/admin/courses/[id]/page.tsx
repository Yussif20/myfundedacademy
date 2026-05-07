"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import { uploadToR2, uploadToVdoCipher } from "@/lib/uploads";
import { useListCategoriesQuery } from "@/redux/api/categoriesApi";
import {
  useCreateLessonMutation,
  useCreateSectionMutation,
  useDeleteLessonMutation,
  useDeleteSectionMutation,
  useGetCourseQuery,
  usePublishCourseMutation,
  useUnpublishCourseMutation,
  useUpdateCourseMutation,
  useUpdateLessonMutation,
  useUpdateSectionMutation,
  type Lesson,
  type Section,
} from "@/redux/api/coursesApi";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { useThumbnailPresignMutation, useVideoCredentialsMutation } from "@/redux/api/uploadsApi";
import { ChevronDown, ChevronRight, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCoursePage() {
  const t = useTranslations("admin.courses");
  const tField = useTranslations("admin.fields");
  const tStatus = useTranslations("admin.fields.status");
  const tCommon = useTranslations("common");
  const params = useParams();
  const id = String(params?.id || "");
  const router = useRouter();

  const { data, isLoading, refetch } = useGetCourseQuery(id, { skip: !id });
  const course = data?.data;

  const { data: instructorsData } = useListInstructorsQuery();
  const { data: categoriesData } = useListCategoriesQuery();

  const [updateCourse, { isLoading: saving }] = useUpdateCourseMutation();
  const [publish] = usePublishCourseMutation();
  const [unpublish] = useUnpublishCourseMutation();
  const [thumbnailPresign] = useThumbnailPresignMutation();

  const [form, setForm] = useState<{
    title: string;
    titleArabic: string;
    shortDescription: string;
    shortDescriptionArabic: string;
    description: string;
    descriptionArabic: string;
    thumbnail: string;
    instructorId: string;
    categoryId: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
    language: "EN" | "AR" | "BOTH";
    accessTier: "FREE" | "STARTER" | "PRO";
    oneTimePrice: number;
    isFeatured: boolean;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [thumbProgress, setThumbProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!course) return;
    setForm({
      title: course.title,
      titleArabic: course.titleArabic,
      shortDescription: course.shortDescription,
      shortDescriptionArabic: course.shortDescriptionArabic,
      description: course.description,
      descriptionArabic: course.descriptionArabic,
      thumbnail: course.thumbnail,
      instructorId: course.instructor.id,
      categoryId: course.category?.id || "",
      level: course.level,
      language: course.language,
      accessTier: course.accessTier,
      oneTimePrice: course.oneTimePrice,
      isFeatured: course.isFeatured,
    });
  }, [course]);

  if (isLoading || !course || !form) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const set = <K extends keyof NonNullable<typeof form>>(k: K, v: NonNullable<typeof form>[K]) =>
    setForm((s) => (s ? { ...s, [k]: v } : s));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form) return;
    try {
      await updateCourse({
        id,
        patch: {
          ...form,
          categoryId: form.categoryId || null,
        },
      }).unwrap();
      refetch();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const onUploadThumbnail = async (file: File) => {
    setError(null);
    setThumbProgress(0);
    try {
      const presigned = await thumbnailPresign({
        fileName: file.name,
        contentType: file.type,
        contentLength: file.size,
      }).unwrap();

      await uploadToR2({
        uploadUrl: presigned.data.uploadUrl,
        headers: presigned.data.headers,
        file,
        onProgress: setThumbProgress,
      });

      await updateCourse({ id, patch: { thumbnail: presigned.data.publicUrl } }).unwrap();
      set("thumbnail", presigned.data.publicUrl);
      refetch();
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setThumbProgress(null);
    }
  };

  const onPublish = async () => {
    setError(null);
    try {
      if (course.status === "PUBLISHED") {
        await unpublish(id).unwrap();
      } else {
        await publish(id).unwrap();
      }
      refetch();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const statusVariant = (s: string) =>
    s === "PUBLISHED" ? "success" : s === "PENDING" ? "warning" : "outline";

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("editTitle")}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={statusVariant(course.status) as never}>
              {tStatus(course.status as never)}
            </Badge>
            <p className="text-sm text-[var(--muted-foreground)]">{course.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/courses")}>
            {tCommon("back")}
          </Button>
          <Button onClick={onPublish}>
            {course.status === "PUBLISHED" ? t("unpublish") : t("publish")}
          </Button>
        </div>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("editTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="grid gap-4 md:grid-cols-2">
            <FormField label={t("title_")} htmlFor="title">
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                disabled={saving}
              />
            </FormField>
            <FormField label={t("titleArabic")} htmlFor="titleArabic">
              <Input
                id="titleArabic"
                value={form.titleArabic}
                onChange={(e) => set("titleArabic", e.target.value)}
                disabled={saving}
              />
            </FormField>

            <FormField label={t("shortDescription")} htmlFor="shortDescription" wide>
              <Textarea
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                rows={2}
                disabled={saving}
              />
            </FormField>
            <FormField label={t("shortDescriptionArabic")} htmlFor="shortDescriptionArabic" wide>
              <Textarea
                id="shortDescriptionArabic"
                value={form.shortDescriptionArabic}
                onChange={(e) => set("shortDescriptionArabic", e.target.value)}
                rows={2}
                disabled={saving}
              />
            </FormField>

            <FormField label={t("description")} htmlFor="description" wide>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                disabled={saving}
              />
            </FormField>
            <FormField label={t("descriptionArabic")} htmlFor="descriptionArabic" wide>
              <Textarea
                id="descriptionArabic"
                value={form.descriptionArabic}
                onChange={(e) => set("descriptionArabic", e.target.value)}
                rows={5}
                disabled={saving}
              />
            </FormField>

            <FormField label={t("instructor")} htmlFor="instructorId">
              <Select
                id="instructorId"
                value={form.instructorId}
                onChange={(e) => set("instructorId", e.target.value)}
                disabled={saving}
              >
                {(instructorsData?.data || []).map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.user.fullName}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label={t("category")} htmlFor="categoryId">
              <Select
                id="categoryId"
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                disabled={saving}
              >
                <option value="">—</option>
                {(categoriesData?.data || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label={t("level")} htmlFor="level">
              <Select
                id="level"
                value={form.level}
                onChange={(e) => set("level", e.target.value as never)}
                disabled={saving}
              >
                {(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"] as const).map((l) => (
                  <option key={l} value={l}>
                    {tField(`level.${l}`)}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label={t("language")} htmlFor="language">
              <Select
                id="language"
                value={form.language}
                onChange={(e) => set("language", e.target.value as never)}
                disabled={saving}
              >
                {(["EN", "AR", "BOTH"] as const).map((l) => (
                  <option key={l} value={l}>
                    {tField(`language.${l}`)}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label={t("tier")} htmlFor="accessTier">
              <Select
                id="accessTier"
                value={form.accessTier}
                onChange={(e) => set("accessTier", e.target.value as never)}
                disabled={saving}
              >
                {(["FREE", "STARTER", "PRO"] as const).map((l) => (
                  <option key={l} value={l}>
                    {tField(`tier.${l}`)}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label={t("price")} htmlFor="oneTimePrice" hint={t("priceHelp")}>
              <Input
                id="oneTimePrice"
                type="number"
                step="0.01"
                min={0}
                value={form.oneTimePrice}
                onChange={(e) => set("oneTimePrice", Number(e.target.value))}
                disabled={saving}
              />
            </FormField>

            <div className="flex items-end gap-3">
              <Switch
                checked={form.isFeatured}
                onCheckedChange={(v) => set("isFeatured", v)}
                disabled={saving}
                id="isFeatured"
              />
              <Label htmlFor="isFeatured">{t("isFeatured")}</Label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t("thumbnail")}</Label>
              <div className="flex items-center gap-4">
                {form.thumbnail ? (
                  <div className="relative h-20 w-32 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--secondary)]">
                    <Image
                      src={form.thumbnail}
                      alt="thumbnail"
                      fill
                      className="object-cover"
                      sizes="128px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="grid h-20 w-32 place-items-center rounded-md border border-dashed border-[var(--border)] bg-[var(--secondary)]/50 text-xs text-[var(--muted-foreground)]">
                    No image
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={thumbProgress !== null}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onUploadThumbnail(f);
                    }}
                  />
                  <span className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-medium hover:bg-[var(--secondary)]">
                    <Upload className="size-4" />
                    {thumbProgress !== null
                      ? t("videoUploading", { pct: String(thumbProgress) })
                      : t("uploadThumbnail")}
                  </span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? tCommon("loading") : tCommon("saveChanges")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <CurriculumEditor courseId={id} sections={course.sections} onChange={refetch} />
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  hint,
  wide,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${wide ? "md:col-span-2" : ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
    </div>
  );
}

function CurriculumEditor({
  courseId,
  sections,
  onChange,
}: {
  courseId: string;
  sections: Section[];
  onChange: () => void;
}) {
  const t = useTranslations("admin.courses");
  const [createSection, { isLoading: addingSection }] = useCreateSectionMutation();
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const onAddSection = async () => {
    if (!newSectionTitle) return;
    await createSection({ courseId, title: newSectionTitle }).unwrap();
    setNewSectionTitle("");
    onChange();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("curriculum")}</CardTitle>
        <p className="text-sm text-[var(--muted-foreground)]">{t("publishHint")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.length === 0 ? (
          <p className="rounded-md border border-dashed border-[var(--border)] py-8 text-center text-sm text-[var(--muted-foreground)]">
            {t("noSectionsYet")}
          </p>
        ) : (
          sections.map((s) => (
            <SectionEditor key={s.id} courseId={courseId} section={s} onChange={onChange} />
          ))
        )}

        <div className="flex items-center gap-2 border-t border-[var(--border)] pt-4">
          <Input
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder={t("sectionTitle")}
            disabled={addingSection}
          />
          <Button
            type="button"
            onClick={onAddSection}
            disabled={!newSectionTitle || addingSection}
            className="gap-2"
          >
            <Plus className="size-4" />
            {t("addSection")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionEditor({
  courseId,
  section,
  onChange,
}: {
  courseId: string;
  section: Section;
  onChange: () => void;
}) {
  const t = useTranslations("admin.courses");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(true);
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [createLesson, { isLoading: addingLesson }] = useCreateLessonMutation();
  const [title, setTitle] = useState(section.title);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  useEffect(() => setTitle(section.title), [section.title]);

  const onSaveTitle = async () => {
    if (title === section.title || !title.trim()) return;
    await updateSection({ id: section.id, courseId, patch: { title } }).unwrap();
    onChange();
  };

  const onDelete = async () => {
    if (!confirm(tCommon("confirmDelete"))) return;
    await deleteSection({ id: section.id, courseId }).unwrap();
    onChange();
  };

  const onAddLesson = async () => {
    if (!newLessonTitle) return;
    await createLesson({
      sectionId: section.id,
      courseId,
      title: newLessonTitle,
    }).unwrap();
    setNewLessonTitle("");
    onChange();
  };

  return (
    <div className="rounded-lg border border-[var(--border)]">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          aria-label={open ? "Collapse" : "Expand"}
        >
          {open ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4 rtl:rotate-180" />
          )}
        </button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onSaveTitle}
          className="flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label={tCommon("delete")}
        >
          <Trash2 className="size-4 text-[var(--destructive)]" />
        </Button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-[var(--border)] bg-[var(--background)]/50 px-4 py-3">
          {section.lessons.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No lessons yet.</p>
          ) : (
            section.lessons.map((l) => (
              <LessonEditor key={l.id} courseId={courseId} lesson={l} onChange={onChange} />
            ))
          )}
          <div className="flex items-center gap-2">
            <Input
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              placeholder={t("lessonTitle")}
              disabled={addingLesson}
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddLesson}
              disabled={!newLessonTitle || addingLesson}
              className="gap-2"
            >
              <Plus className="size-4" />
              {t("addLesson")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonEditor({
  courseId,
  lesson,
  onChange,
}: {
  courseId: string;
  lesson: Lesson;
  onChange: () => void;
}) {
  const t = useTranslations("admin.courses");
  const tCommon = useTranslations("common");
  const [updateLesson] = useUpdateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();
  const [videoCredentials] = useVideoCredentialsMutation();

  const [title, setTitle] = useState(lesson.title);
  const [duration, setDuration] = useState(lesson.durationMin);
  const [free, setFree] = useState(lesson.isFreePreview);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(lesson.title);
    setDuration(lesson.durationMin);
    setFree(lesson.isFreePreview);
  }, [lesson]);

  const persist = async (patch: Partial<Lesson>) => {
    await updateLesson({ id: lesson.id, courseId, patch }).unwrap();
    onChange();
  };

  const onUploadVideo = async (file: File) => {
    setError(null);
    setProgress(0);
    try {
      const credsRes = await videoCredentials({ title: lesson.title || file.name }).unwrap();
      const c = credsRes.data;
      await uploadToVdoCipher({
        uploadLink: c.uploadLink,
        clientPayload: c.clientPayload,
        file,
        onProgress: setProgress,
      });
      await updateLesson({
        id: lesson.id,
        courseId,
        patch: { vdoVideoId: c.videoId },
      }).unwrap();
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setProgress(null);
    }
  };

  const onDelete = async () => {
    if (!confirm(tCommon("confirmDelete"))) return;
    await deleteLesson({ id: lesson.id, courseId }).unwrap();
    onChange();
  };

  return (
    <div className="space-y-3 rounded-md border border-[var(--border)] bg-[var(--card)] p-3">
      <div className="grid gap-2 md:grid-cols-[1fr_120px_auto_auto] md:items-center">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== lesson.title && title.trim() && persist({ title })}
          placeholder={t("lessonTitle")}
        />
        <Input
          type="number"
          min={0}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          onBlur={() => duration !== lesson.durationMin && persist({ durationMin: duration })}
          placeholder={t("lessonDuration")}
        />
        <div className="flex items-center gap-2">
          <Switch
            checked={free}
            onCheckedChange={(v) => {
              setFree(v);
              persist({ isFreePreview: v });
            }}
            id={`free-${lesson.id}`}
          />
          <Label htmlFor={`free-${lesson.id}`} className="text-xs">
            {t("lessonFreePreview")}
          </Label>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label={tCommon("delete")}
        >
          <Trash2 className="size-4 text-[var(--destructive)]" />
        </Button>
      </div>

      <div className="flex items-center gap-3 border-t border-[var(--border)] pt-3 text-sm">
        {lesson.vdoVideoId ? (
          <Badge variant="success">{t("videoUploaded")}</Badge>
        ) : (
          <Badge variant="outline">No video</Badge>
        )}

        <label className="cursor-pointer">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={progress !== null}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUploadVideo(f);
            }}
          />
          <span className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-xs font-medium hover:bg-[var(--secondary)]">
            <Upload className="size-3.5" />
            {progress !== null ? t("videoUploading", { pct: String(progress) }) : t("uploadVideo")}
          </span>
        </label>

        {error && <span className="text-xs text-[var(--destructive)]">{error}</span>}
      </div>
    </div>
  );
}
