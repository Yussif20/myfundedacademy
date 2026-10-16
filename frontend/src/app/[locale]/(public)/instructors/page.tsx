"use client";

import { InstructorCard } from "@/components/public/instructor-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useListInstructorsQuery } from "@/redux/api/instructorsApi";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function InstructorsDirectoryPage() {
  const t = useTranslations("instructorsPage");
  const tHome = useTranslations("home");
  const { data, isLoading } = useListInstructorsQuery();
  const instructors = data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <Reveal>
        <SectionHeading
          as="h1"
          eyebrow={tHome("eyebrows.instructors")}
          title={t("title")}
          lead={t("subtitle")}
        />
      </Reveal>

      <div className="mt-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
          </div>
        ) : instructors.length === 0 ? (
          <p className="rounded-xl border border-dashed border-rule-strong/50 py-20 text-center text-muted-foreground">
            {t("noInstructors")}
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {instructors.map((i, idx) => (
              <Reveal as="li" key={i.id} delay={(idx % 3) * 80}>
                <InstructorCard instructor={i} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
