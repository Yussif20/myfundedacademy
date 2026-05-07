import { Wordmark } from "@/components/brand/wordmark";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function PublicFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <Wordmark />
          <p className="max-w-sm text-sm text-[var(--muted-foreground)]">{tF("tagline")}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-3">
          <div>
            <p className="mb-3 font-semibold">{t("courses")}</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {t("courses")}
                </Link>
              </li>
              <li>
                <Link
                  href="/instructors"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {t("instructors")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {t("pricing")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold">{t("account")}</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {t("signIn")}
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {t("signUp")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted-foreground)]">
        © {new Date().getFullYear()} My Funded Academy. {tF("rights")}
      </div>
    </footer>
  );
}
