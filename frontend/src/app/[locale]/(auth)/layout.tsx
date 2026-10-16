import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

/** Two panels: the form on paper, and a lamplit photo with a short line on ink. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth.panel");

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1fr_minmax(0,40rem)]">
      <div className="flex flex-col">
        <header className="flex items-center justify-between gap-2 px-4 py-5 sm:px-6 sm:py-6 md:px-12">
          <Link href="/" aria-label="Home">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16 pt-6 sm:px-6">
          {children}
        </section>
      </div>

      <aside className="dark relative hidden overflow-hidden bg-background text-foreground lg:flex lg:flex-col lg:justify-between lg:p-16">
        <Image
          src="/images/auth/lamp.jpg"
          alt=""
          fill
          priority
          sizes="40rem"
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background from-15% via-background/40 via-50% to-transparent"
        />
        <p className="eyebrow relative">{t("eyebrow")}</p>
        <div className="relative">
          <p className="max-w-md font-display text-4xl font-medium leading-tight tracking-tight text-balance xl:text-5xl">
            {t("line")}
          </p>
          <p className="mt-6 max-w-sm leading-7 text-muted-foreground">{t("sub")}</p>
          <div
            aria-hidden
            className="mt-10 h-px w-full bg-gradient-to-r from-gold/60 to-transparent rtl:bg-gradient-to-l"
          />
        </div>
      </aside>
    </main>
  );
}
