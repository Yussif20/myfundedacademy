import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <header className="relative z-10 flex items-center justify-between gap-2 px-4 py-5 sm:px-6 sm:py-6 md:px-12">
        <Link href="/" aria-label="Home">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-md flex-col px-4 pb-16 pt-6 sm:px-6 md:pt-16">
        {children}
      </section>
    </main>
  );
}
