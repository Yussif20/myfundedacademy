import { StatusPage } from "@/components/public/status-page";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("status");
  return (
    <StatusPage code="404" eyebrow={t("eyebrow404")} title={t("title404")} body={t("body404")}>
      <Button asChild size="lg">
        <Link href="/">
          <Home className="size-4" aria-hidden />
          {t("home")}
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/courses">
          {t("browse")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      </Button>
    </StatusPage>
  );
}
