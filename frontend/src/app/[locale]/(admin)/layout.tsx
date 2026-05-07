import { AdminSidebar } from "@/components/admin/sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { Wordmark } from "@/components/brand/wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" aria-label="Home">
              <Wordmark />
            </Link>
            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
          <aside className="w-56 shrink-0">
            <div className="sticky top-20">
              <AdminSidebar />
            </div>
          </aside>

          <section className="min-w-0 flex-1">{children}</section>
        </div>
      </main>
    </AuthGuard>
  );
}
