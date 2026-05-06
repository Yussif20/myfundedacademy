import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("site");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] rounded-full blur-[120px] opacity-30"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 size-[500px] rounded-full blur-[100px] opacity-20"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)" }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Wordmark />
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-20 text-center md:py-32">
        <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          {t("comingSoon")}
        </span>

        <h1 className="font-display mt-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          {t("name")}
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg text-[var(--muted-foreground)] md:text-xl">
          {t("tagline")}
        </p>

        <p className="mt-4 max-w-xl text-balance text-sm text-[var(--muted-foreground)]">
          {t("comingSoonBlurb")}
        </p>

        <div className="mt-12 flex flex-col items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <div className="h-px w-24 bg-[var(--border)]" />
          <span>Batch 0 — scaffolding shipped</span>
        </div>
      </section>
    </main>
  );
}
