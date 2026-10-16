import { CountUp } from "@/components/ui/count-up";
import { Stat } from "@/components/ui/stat";
import { useTranslations } from "next-intl";

type Key = "courses" | "instructors" | "students" | "watchTime";

const stats: { key: Key; value: number; suffix?: string }[] = [
  { key: "courses", value: 12, suffix: "+" },
  { key: "instructors", value: 8 },
  { key: "students", value: 2400, suffix: "+" },
  { key: "watchTime", value: 60, suffix: "+" },
];

/** A hairline band of figures, Auto Range style: serif numerals that count up once. */
export function StatsRow() {
  const t = useTranslations("home.stats");

  return (
    <section className="border-y border-border">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-border px-6 md:grid-cols-4 md:divide-x md:rtl:divide-x-reverse">
        {stats.map((s) => (
          <Stat
            key={s.key}
            className="items-center py-10 text-center"
            label={t(s.key)}
            value={<CountUp value={s.value} suffix={s.suffix} className="text-primary" />}
          />
        ))}
      </dl>
    </section>
  );
}
