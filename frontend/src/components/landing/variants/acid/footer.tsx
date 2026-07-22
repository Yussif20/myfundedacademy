"use client";

import { Link } from "@/i18n/navigation";
import { Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

/**
 * Acid Ledger footer — the site closes like the back page of a trading zine:
 * a 2px double-rule frame, ledger-table link columns with indexed rows and
 * ink-reveal underlines, a stamped newsletter slip, square social tiles, and
 * a terminal status bar with a live LED for the copyright row.
 */
export function AcidFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");

  return (
    <footer className="border-t-2 border-[var(--dxacid-line)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + tagline + newsletter slip */}
          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="dxacid-brand-block" aria-hidden>
                M<span className="text-[0.6em]">↗</span>
              </span>
              <span
                className="flex flex-col font-mono text-[10px] font-semibold uppercase leading-[1.5] tracking-[0.18em]"
                aria-hidden
              >
                <span>My Funded</span>
                <span className="text-[var(--muted-foreground)]">Academy ©</span>
              </span>
            </div>

            <p className="max-w-sm font-mono text-sm leading-relaxed text-[var(--muted-foreground)]">
              {tF("tagline")}
            </p>

            <NewsletterSlip
              title={tF("newsletterTitle")}
              sub={tF("newsletterSub")}
              placeholder={tF("newsletterPlaceholder")}
              cta={tF("newsletterCta")}
              successMessage={tF("newsletterSuccess")}
            />

            <div className="flex items-center gap-3 pt-1">
              <SocialTile href="https://twitter.com" Icon={Twitter} label="Twitter" />
              <SocialTile href="https://youtube.com" Icon={Youtube} label="YouTube" />
              <SocialTile href="https://linkedin.com" Icon={Linkedin} label="LinkedIn" />
              <SocialTile href="https://github.com" Icon={Github} label="GitHub" />
            </div>
          </div>

          {/* Ledger-table link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <LedgerColumn title={tF("explore")}>
              <LedgerLink href="/courses" index="01">
                {t("courses")}
              </LedgerLink>
              <LedgerLink href="/instructors" index="02">
                {t("instructors")}
              </LedgerLink>
              <LedgerLink href="/pricing" index="03">
                {t("pricing")}
              </LedgerLink>
            </LedgerColumn>
            <LedgerColumn title={t("account")}>
              <LedgerLink href="/login" index="01">
                {t("signIn")}
              </LedgerLink>
              <LedgerLink href="/signup" index="02">
                {t("signUp")}
              </LedgerLink>
            </LedgerColumn>
            <LedgerColumn title={tF("legal")}>
              <LedgerLink href="/courses" index="01">
                {tF("terms")}
              </LedgerLink>
              <LedgerLink href="/courses" index="02">
                {tF("privacy")}
              </LedgerLink>
              <LedgerLink href="/courses" index="03">
                {tF("refund")}
              </LedgerLink>
            </LedgerColumn>
          </div>
        </div>

        {/* Terminal status bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t-2 border-[var(--dxacid-line)] pt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)] md:flex-row">
          <p>
            © {new Date().getFullYear()} My Funded Academy — {tF("rights")}
          </p>
          <p className="flex items-center gap-2" aria-hidden>
            <span className="dxacid-led animate-pulse" />
            MFA · 24/7 ▲
          </p>
          <p className="flex items-center gap-2 normal-case tracking-normal">
            <Mail className="size-3.5" aria-hidden />
            <a href="mailto:hello@myfundedacademy.com" className="hover:text-[var(--foreground)]">
              hello@myfundedacademy.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function LedgerColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-4 border-b-2 border-[var(--dxacid-line)] pb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
        {title}
      </p>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function LedgerLink({
  href,
  index,
  children,
}: {
  href: string;
  index: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        href={href as Parameters<typeof Link>[0]["href"]}
        className="group flex items-baseline gap-2 py-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <span className="font-mono text-[10px] font-semibold text-[var(--dxacid-up)]" aria-hidden>
          {index}
        </span>
        <span className="dxacid-underline">{children}</span>
      </Link>
    </li>
  );
}

function SocialTile({
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
      className="dxacid-social"
    >
      <Icon className="size-4" />
    </a>
  );
}

function NewsletterSlip({
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
    <div className="dxacid-hard max-w-sm p-4">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.1em]">{title}</p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{sub}</p>
      <form onSubmit={onSubmit} className="mt-3 flex gap-3">
        <input
          type="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="dxacid-input flex-1"
        />
        <button type="submit" className="dxacid-btn h-11 shrink-0 px-4 text-xs">
          {cta}
        </button>
      </form>
    </div>
  );
}
