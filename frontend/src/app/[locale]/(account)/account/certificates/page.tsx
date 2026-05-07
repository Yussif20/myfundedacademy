"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useListMyCertificatesQuery } from "@/redux/api/quizzesApi";
import { Award, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MyCertificatesPage() {
  const { data, isLoading } = useListMyCertificatesQuery();
  const certs = data?.data || [];
  const t = useTranslations("accountCertificates");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">{t("subtitle")}</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
        </div>
      ) : certs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Award className="mx-auto size-10 text-[var(--muted-foreground)]" />
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">{t("none")}</p>
            <Button asChild className="mt-4">
              <Link href="/account/courses">{t("myCourses")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {certs.map((cert) => (
            <li key={cert.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Award className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="line-clamp-1 text-base">{cert.course?.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {t("issuedAt", {
                          date: new Date(cert.issuedAt).toLocaleDateString(),
                          code: cert.code,
                        })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={
                        `/learn/${cert.course?.slug}/certificate` as `/learn/${string}/certificate`
                      }
                    >
                      {t("viewCertificate")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
