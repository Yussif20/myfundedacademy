import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full blur-[120px] opacity-25"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 size-[500px] rounded-full blur-[100px] opacity-15"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)" }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" aria-label="Home">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-md flex-col px-6 pb-16 pt-8 md:pt-16">
        {children}
      </section>
    </main>
  );
}
