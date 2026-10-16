"use client";

import { InstructorCard } from "@/components/public/instructor-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
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
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrows.instructors")}
            title={t("featuredInstructors")}
            lead={t("featuredInstructorsSub")}
            action={
              <Button asChild variant="outline">
                <Link href="/instructors">
                  {t("browseAll")}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </Link>
              </Button>
            }
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((i, idx) => (
            <Reveal as="li" key={i.id} delay={(idx % 3) * 80}>
              <InstructorCard instructor={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
