"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { BurnBrand } from "./brand";

/* Language-neutral closing-bell tape — tickers and numerals only. */
const CLOSING_TAPE =
  "MFA +127.4% ▲ · RISK-101 ★ 4.9 · EURUSD +0.42% · PRICE-ACTION ▲ 2.1K · XAUUSD +0.85% ▲ · BTC +2.10% ▲ · SPX +0.64% · US30 +0.18% · ";

/**
 * Controlled Burn footer — the desk after the closing bell.
 * A slow ticker tape seals the page content, then a ledger of links,
 * a desk-order newsletter form, and a mono status bar with a live LED.
 * Bottom-lit by the ember horizon: the light source is always below.
 */
export function BurnFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");

  return (
    <footer className="dxburn-sectionglow relative isolate overflow-hidden">
      {/* Closing tape */}
      <div aria-hidden className="dxburn-tape border-y border-[var(--border)]">
        <div className="dxburn-tape-track py-2.5">
          {[0, 1].map((half) => (
            <span
              key={half}
              className="dxburn-micro flex items-center text-[var(--muted-foreground)]"
            >
              {CLOSING_TAPE.repeat(2)}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="space-y-6 lg:col-span-5">
            <BurnBrand />
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              {tF("tagline")}
            </p>

            <DeskNewsletter
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

          {/* Ledger link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn index="01" title={tF("explore")}>
              <FooterLink href="/courses">{t("courses")}</FooterLink>
              <FooterLink href="/instructors">{t("instructors")}</FooterLink>
              <FooterLink href="/pricing">{t("pricing")}</FooterLink>
            </FooterColumn>
            <FooterColumn index="02" title={t("account")}>
              <FooterLink href="/login">{t("signIn")}</FooterLink>
              <FooterLink href="/signup">{t("signUp")}</FooterLink>
            </FooterColumn>
            <FooterColumn index="03" title={tF("legal")}>
              <FooterLink href="/courses">{tF("terms")}</FooterLink>
              <FooterLink href="/courses">{tF("privacy")}</FooterLink>
              <FooterLink href="/courses">{tF("refund")}</FooterLink>
            </FooterColumn>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 font-mono text-[11px] text-[var(--muted-foreground)] md:flex-row">
          <p className="flex items-center gap-2.5">
            <span aria-hidden className="dxburn-led dxburn-led--live" />
            <span>
              © {new Date().getFullYear()} My Funded Academy · {tF("rights")}
            </span>
          </p>
          <a
            href="mailto:hello@myfundedacademy.com"
            className="dxburn-navlink flex items-center gap-2 transition-colors hover:text-[var(--foreground)]"
          >
            <Mail className="size-3.5" aria-hidden />
            hello@myfundedacademy.com
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-4 flex items-baseline gap-2 border-b border-[var(--border)] pb-2">
        <span className="dxburn-micro text-[var(--primary)]" aria-hidden>
          {index}
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-[0.08em] rtl:tracking-normal">
          {title}
        </span>
      </p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href as Parameters<typeof Link>[0]["href"]}
        className="dxburn-navlink inline-block text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
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
      className="grid size-9 place-items-center rounded-[2px] border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition-colors hover:border-[color-mix(in_oklch,var(--primary)_45%,var(--border))] hover:text-[var(--primary)]"
    >
      <Icon className="size-4" />
    </a>
  );
}

function DeskNewsletter({
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
  const [focused, setFocused] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.match(/.+@.+\..+/)) return;
    toast.success(successMessage);
    setEmail("");
  };

  return (
    <div>
      <p className="font-display text-sm font-bold uppercase tracking-[0.08em] rtl:tracking-normal">
        {title}
      </p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{sub}</p>
      <form onSubmit={onSubmit} className="mt-3 max-w-sm">
        <div
          className={`flex w-full items-stretch rounded-[2px] border bg-[var(--card)] transition-colors ${
            focused ? "border-[var(--primary)]" : "border-[var(--border)]"
          }`}
        >
          <input
            type="email"
            required
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="h-11 min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            type="submit"
            className="group m-1 inline-flex items-center gap-1.5 rounded-[2px] bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-all hover:brightness-110"
          >
            {cta}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
