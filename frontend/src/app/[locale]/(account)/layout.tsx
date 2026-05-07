import { AccountSubNav } from "@/components/account/sub-nav";
import { AuthGuard } from "@/components/auth-guard";
import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["STUDENT"]}>
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" aria-label="Home">
              <Wordmark />
            </Link>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <section className="mx-auto max-w-3xl px-6 py-10">
          <AccountSubNav />
          {children}
        </section>
      </main>
    </AuthGuard>
  );
}
