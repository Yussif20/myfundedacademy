"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { extractApiError } from "@/lib/errors";
import type { CourseDetail } from "@/redux/api/coursesApi";
import { useCheckoutCourseMutation } from "@/redux/api/paymentsApi";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  const reduced = useReducedMotion();
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
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center md:inset-x-auto md:bottom-6 md:right-6"
        >
          <div className="glass pointer-events-auto flex w-full max-w-md items-center gap-4 rounded-2xl p-3 pl-5 shadow-xl shadow-black/20 md:w-auto md:min-w-[420px]">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
                {title}
              </p>
              <p className="font-display mt-0.5 text-lg font-bold leading-none">
                {course.oneTimePrice > 0 ? `$${course.oneTimePrice.toFixed(2)}` : "Free"}
              </p>
            </div>

            {course.viewerHasAccess ? (
              <Button asChild size="sm" className="brand-glow shrink-0">
                <Link href={`/learn/${course.slug}` as `/learn/${string}`}>
                  {t("continueLearning")}
                </Link>
              </Button>
            ) : course.oneTimePrice > 0 ? (
              loggedIn ? (
                <Button
                  size="sm"
                  className="brand-glow shrink-0"
                  disabled={isLoading}
                  onClick={handleBuy}
                >
                  {isLoading
                    ? "Redirecting…"
                    : t("enrollNow", { price: course.oneTimePrice.toFixed(2) })}
                </Button>
              ) : (
                <Button asChild size="sm" className="brand-glow shrink-0">
                  <Link href="/login">
                    {t("enrollNow", { price: course.oneTimePrice.toFixed(2) })}
                  </Link>
                </Button>
              )
            ) : (
              <Button asChild size="sm" className="brand-glow shrink-0">
                <Link href={loggedIn ? "/pricing" : "/login"}>{t("subscribeForAccess")}</Link>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
