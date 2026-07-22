"use client";

import { ScrollReveal } from "@/components/motion";
import { InstructorCard } from "@/components/public/instructor-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function InstructorsSection() {
  const t = useTranslations("home");

  const { data: instructorsRes } = useListInstructorsQuery({ featured: true });
  const instructors = instructorsRes?.data || [];

  if (instructors.length === 0) return null;

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {t("featuredInstructors")}
              </h2>
              <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
                {t("featuredInstructorsSub")}
              </p>
            </div>
            <Button asChild variant="outline" className="self-start gap-2 sm:self-auto">
              <Link href="/instructors">
                {t("browseAll")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((i, idx) => (
            <ScrollReveal key={i.id} delay={idx * 0.06} amount={0.2}>
              <InstructorCard instructor={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
