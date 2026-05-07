import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen, Tag, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminHomePage() {
  const t = useTranslations("admin.dashboard");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <DashCard
          href="/admin/categories"
          title={t("categoriesCard")}
          description={t("categoriesDesc")}
          icon={<Tag className="size-5" />}
          cta={t("manage")}
        />
        <DashCard
          href="/admin/instructors"
          title={t("instructorsCard")}
          description={t("instructorsDesc")}
          icon={<Users className="size-5" />}
          cta={t("manage")}
        />
        <DashCard
          href="/admin/courses"
          title={t("coursesCard")}
          description={t("coursesDesc")}
          icon={<BookOpen className="size-5" />}
          cta={t("manage")}
        />
      </div>
    </div>
  );
}

function DashCard({
  href,
  title,
  description,
  icon,
  cta,
}: {
  href: "/admin/categories" | "/admin/instructors" | "/admin/courses";
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-colors hover:border-[var(--primary)]">
        <CardHeader>
          <div className="grid size-10 place-items-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            {icon}
          </div>
          <CardTitle className="mt-3 text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center text-sm font-medium text-[var(--primary)]">
          {cta}
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
