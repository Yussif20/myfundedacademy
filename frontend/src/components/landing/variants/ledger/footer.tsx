"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { BrandLockup, WaxSeal } from "./ornaments";

/**
 * "The Ledger Club" colophon — the footer as the closing page of a
 * certificate: brand block with a subscription ledger, small-caps link
 * registers with dotted leaders, and a centered seal colophon row.
 */
export function LedgerFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");

  return (
    <footer className="dxledger-foot">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="space-y-6 lg:col-span-5">
            <BrandLockup />
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              {tF("tagline")}
            </p>
            <NewsletterForm
              title={tF("newsletterTitle")}
              sub={tF("newsletterSub")}
              placeholder={tF("newsletterPlaceholder")}
              cta={tF("newsletterCta")}
              successMessage={tF("newsletterSuccess")}
            />
            <div className="flex items-center gap-2.5 pt-2">
              <SocialIcon href="https://twitter.com" Icon={Twitter} label="Twitter" />
              <SocialIcon href="https://youtube.com" Icon={Youtube} label="YouTube" />
              <SocialIcon href="https://linkedin.com" Icon={Linkedin} label="LinkedIn" />
              <SocialIcon href="https://github.com" Icon={Github} label="GitHub" />
            </div>
          </div>

          {/* Link registers */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn title={tF("explore")}>
              <FooterLink href="/courses">{t("courses")}</FooterLink>
              <FooterLink href="/instructors">{t("instructors")}</FooterLink>
              <FooterLink href="/pricing">{t("pricing")}</FooterLink>
            </FooterColumn>
            <FooterColumn title={t("account")}>
              <FooterLink href="/login">{t("signIn")}</FooterLink>
              <FooterLink href="/signup">{t("signUp")}</FooterLink>
            </FooterColumn>
            <FooterColumn title={tF("legal")}>
              <FooterLink href="/courses">{tF("terms")}</FooterLink>
              <FooterLink href="/courses">{tF("privacy")}</FooterLink>
              <FooterLink href="/courses">{tF("refund")}</FooterLink>
            </FooterColumn>
          </div>
        </div>

        {/* Colophon: seal between engraved rules, then the imprint line */}
        <div aria-hidden className="mt-14 flex items-center gap-6">
          <span className="dxledger-rule flex-1" />
          <WaxSeal className="size-12" />
          <span className="dxledger-rule flex-1" />
        </div>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
          MFA · EST. MMXXVI
        </p>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-[var(--muted-foreground)] md:flex-row">
          <p>
            © {new Date().getFullYear()} My Funded Academy. {tF("rights")}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-3.5" aria-hidden />
            <a
              href="mailto:hello@myfundedacademy.com"
              className="transition-colors hover:text-[var(--dxledger-gold)]"
            >
              hello@myfundedacademy.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="dxledger-smallcaps mb-4 text-[11px] text-[var(--dxledger-gold)]">{title}</p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href as Parameters<typeof Link>[0]["href"]}
        className="dxledger-navlink inline-block text-[var(--muted-foreground)]"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({
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
      className="grid size-9 place-items-center rounded-[2px] border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--dxledger-gold-strong)] hover:text-[var(--dxledger-gold)]"
    >
      <Icon className="size-4" />
    </a>
  );
}

function NewsletterForm({
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
    <div>
      <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{sub}</p>
      <form onSubmit={onSubmit} className="mt-3 flex max-w-sm">
        <div className="dxledger-input flex w-full items-stretch">
          <input
            type="email"
            required
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            type="submit"
            className="dxledger-btn-foil group m-1 inline-flex items-center gap-1.5 px-4"
          >
            {cta}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
