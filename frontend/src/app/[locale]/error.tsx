"use client";

import { StatusPage } from "@/components/public/status-page";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Home, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("status");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="500"
      eyebrow={t("eyebrow500")}
      title={t("title500")}
      body={t("body500")}
      footnote={error.digest ? `${t("ref")}: ${error.digest}` : undefined}
    >
      <Button onClick={reset} size="lg">
        <RotateCcw className="size-4" aria-hidden />
        {t("retry")}
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/">
          <Home className="size-4" aria-hidden />
          {t("home")}
        </Link>
      </Button>
    </StatusPage>
  );
}
