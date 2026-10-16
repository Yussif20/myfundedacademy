"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import type { CourseDetail } from "@/redux/api/coursesApi";
import { useCheckoutCourseMutation } from "@/redux/api/paymentsApi";
import { useTranslations } from "next-intl";
import { useEffect, useState, type RefObject } from "react";
import { toast } from "sonner";

type Props = {
  course: CourseDetail;
  loggedIn: boolean;
  triggerRef: RefObject<HTMLDivElement | null>;
};

export function StickyCourseCta({ course, loggedIn, triggerRef }: Props) {
  const t = useTranslations("courseDetail");
  const [visible, setVisible] = useState(false);
  const [checkout, { isLoading }] = useCheckoutCourseMutation();

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA when the inline CTA card is OUT of view
        setVisible(!entry.isIntersecting);
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerRef]);

  const handleBuy = async () => {
    try {
      const res = await checkout({ courseId: course.id }).unwrap();
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const title = course.title;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`pointer-events-none fixed inset-x-3 bottom-3 z-40 flex justify-center transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none sm:inset-x-4 sm:bottom-4 md:inset-x-auto md:bottom-6 md:end-6 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <div
        className={`flex w-full max-w-md items-center gap-4 rounded-full border border-border bg-card p-2 ps-6 shadow-[0_12px_32px_-16px_rgb(28_27_24/0.35)] md:w-auto md:min-w-[420px] ${visible ? "pointer-events-auto" : ""}`}
      >
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-xs text-muted-foreground">{title}</p>
          <p className="mt-0.5 font-display text-xl leading-none tabular-nums">
            {course.oneTimePrice > 0 ? `$${course.oneTimePrice.toFixed(2)}` : t("free")}
          </p>
        </div>

        {course.viewerHasAccess ? (
          <Button asChild size="sm" className="shrink-0">
            <Link href={`/learn/${course.slug}` as `/learn/${string}`}>
              {t("continueLearning")}
            </Link>
          </Button>
        ) : course.oneTimePrice > 0 ? (
          loggedIn ? (
            <Button size="sm" className="shrink-0" disabled={isLoading} onClick={handleBuy}>
              {isLoading
                ? t("redirecting")
                : t("enrollNow", { price: course.oneTimePrice.toFixed(2) })}
            </Button>
          ) : (
            <Button asChild size="sm" className="shrink-0">
              <Link href="/login">{t("enrollNow", { price: course.oneTimePrice.toFixed(2) })}</Link>
            </Button>
          )
        ) : (
          <Button asChild size="sm" className="shrink-0">
            <Link href={loggedIn ? "/pricing" : "/login"}>{t("subscribeForAccess")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
