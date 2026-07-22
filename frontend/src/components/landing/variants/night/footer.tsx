"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

type FootHref = "/courses" | "/instructors" | "/pricing" | "/login" | "/signup";

/**
 * The Night Edition colophon — the back page of the broadsheet. Opens on a
 * Scotch rule with folio marks, sets the brand as a nameplate with an italic
 * epigraph tagline, frames the newsletter as a subscription notice plate,
 * indexes links in ruled columns, and closes on a mono imprint line.
 */
export function NightFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");

  return (
    <footer className="mt-8">
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <div className="dxnight-rule text-[var(--foreground)]" aria-hidden />
        <div
          aria-hidden
          className="dxnight-masthead mt-2.5 flex items-center justify-between text-[var(--muted-foreground)]"
        >
          <span>MFA — EST. 2026</span>
          <span className="hidden sm:inline">№ 001</span>
          <span>EN / AR</span>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {/* Nameplate + epigraph + subscription notice */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              aria-label="My Funded Academy"
              className="inline-flex flex-col leading-none"
            >
              <span className="dxnight-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                № 001
              </span>
              <span className="dxnight-headline font-display mt-1 text-2xl">My Funded Academy</span>
            </Link>
            <p className="dxnight-deck dxnight-byline mt-5 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              {tF("tagline")}
            </p>

            <NewsletterPlate
              title={tF("newsletterTitle")}
              sub={tF("newsletterSub")}
              placeholder={tF("newsletterPlaceholder")}
              cta={tF("newsletterCta")}
              successMessage={tF("newsletterSuccess")}
            />

            <div className="mt-6 flex items-center gap-2.5">
              <SocialPlate href="https://twitter.com" Icon={Twitter} label="Twitter" />
              <SocialPlate href="https://youtube.com" Icon={Youtube} label="YouTube" />
              <SocialPlate href="https://linkedin.com" Icon={Linkedin} label="LinkedIn" />
              <SocialPlate href="https://github.com" Icon={Github} label="GitHub" />
            </div>
          </div>

          {/* Ruled index columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FootIndex title={tF("explore")}>
              <FootLink href="/courses">{t("courses")}</FootLink>
              <FootLink href="/instructors">{t("instructors")}</FootLink>
              <FootLink href="/pricing">{t("pricing")}</FootLink>
            </FootIndex>
            <FootIndex title={t("account")}>
              <FootLink href="/login">{t("signIn")}</FootLink>
              <FootLink href="/signup">{t("signUp")}</FootLink>
            </FootIndex>
            <FootIndex title={tF("legal")}>
              <FootLink href="/courses">{tF("terms")}</FootLink>
              <FootLink href="/courses">{tF("privacy")}</FootLink>
              <FootLink href="/courses">{tF("refund")}</FootLink>
            </FootIndex>
          </div>
        </div>

        {/* Imprint line */}
        <div className="dxnight-hairline mt-14 text-[var(--foreground)]" aria-hidden />
        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-xs text-[var(--muted-foreground)] md:flex-row">
          <p className="dxnight-mono">
            © {new Date().getFullYear()} My Funded Academy · {tF("rights")}
          </p>
          <p aria-hidden className="dxnight-mono hidden md:block">
            — № 001 —
          </p>
          <a
            href="mailto:hello@myfundedacademy.com"
            className="dxnight-mono inline-flex items-center gap-2 transition-colors hover:text-[var(--foreground)]"
          >
            <Mail className="size-3.5" aria-hidden />
            hello@myfundedacademy.com
          </a>
        </div>
      </div>
    </footer>
  );
}

function FootIndex({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="dxnight-kicker text-[var(--accent)]">{title}</p>
      <div className="dxnight-hairline mt-2 text-[var(--foreground)]" aria-hidden />
      <ul className="mt-4 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FootLink({ href, children }: { href: FootHref; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="dxnight-underline text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialPlate({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="dxnight-social"
    >
      <Icon className="size-4" />
    </a>
  );
}

function NewsletterPlate({
  title,
  sub,
  placeholder,
  cta,
  successMessage,
}: {
  title: string;
  sub: string;
  placeholder: string;
  cta: string;
  successMessage: string;
}) {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.match(/.+@.+\..+/)) return;
    toast.success(successMessage);
    setEmail("");
  };

  return (
    <div className="dxnight-frame mt-8 p-5">
      <p className="dxnight-kicker text-[var(--accent)]">{title}</p>
      <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">{sub}</p>
      <form onSubmit={onSubmit} className="mt-4 flex items-end gap-3">
        <input
          type="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="dxnight-input-line h-9 min-w-0 flex-1 px-0 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
        />
        <button
          type="submit"
          className="dxnight-btn-paper dxnight-kicker inline-flex h-9 shrink-0 items-center gap-1.5 px-4"
        >
          {cta}
          <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
        </button>
      </form>
    </div>
  );
}
