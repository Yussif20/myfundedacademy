"use client";

import { Link } from "@/i18n/navigation";
import { Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { PhosphorBrand } from "./header";
import { PhosphorTicker } from "./ticker";

type FooterHref = "/courses" | "/instructors" | "/pricing" | "/login" | "/signup";

/**
 * Phosphor Terminal Noir — footer as a terminal colophon.
 * Closing ticker tape up top, a command-line newsletter prompt, link columns
 * rendered as indexed directory listings, square hairline social cells, and a
 * mono status bar closing the session.
 */
export function PhosphorFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");

  return (
    <footer className="relative border-t border-[var(--border)]">
      {/* The tape never sleeps — closing marquee bounded by hairlines */}
      <PhosphorTicker />

      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter prompt */}
          <div className="space-y-6 lg:col-span-5">
            <Link href="/" aria-label="Home" className="inline-block">
              <PhosphorBrand />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              {tF("tagline")}
            </p>

            <NewsletterPrompt
              title={tF("newsletterTitle")}
              sub={tF("newsletterSub")}
              placeholder={tF("newsletterPlaceholder")}
              cta={tF("newsletterCta")}
              successMessage={tF("newsletterSuccess")}
            />

            <div className="flex items-center pt-2">
              <SocialCell href="https://twitter.com" Icon={Twitter} label="Twitter" />
              <SocialCell href="https://youtube.com" Icon={Youtube} label="YouTube" />
              <SocialCell href="https://linkedin.com" Icon={Linkedin} label="LinkedIn" />
              <SocialCell href="https://github.com" Icon={Github} label="GitHub" />
            </div>
          </div>

          {/* Directory listings */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <DirColumn index="01" title={tF("explore")}>
              <DirLink href="/courses">{t("courses")}</DirLink>
              <DirLink href="/instructors">{t("instructors")}</DirLink>
              <DirLink href="/pricing">{t("pricing")}</DirLink>
            </DirColumn>
            <DirColumn index="02" title={t("account")}>
              <DirLink href="/login">{t("signIn")}</DirLink>
              <DirLink href="/signup">{t("signUp")}</DirLink>
            </DirColumn>
            <DirColumn index="03" title={tF("legal")}>
              <DirLink href="/courses">{tF("terms")}</DirLink>
              <DirLink href="/courses">{tF("privacy")}</DirLink>
              <DirLink href="/courses">{tF("refund")}</DirLink>
            </DirColumn>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-5 md:flex-row">
          <p className="font-mono text-[11px] tracking-[0.04em] text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} My Funded Academy. {tF("rights")}
          </p>
          <p
            aria-hidden
            className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)] opacity-50 md:block"
          >
            +++ EOF +++
          </p>
          <p className="flex items-center gap-2 font-mono text-[11px] text-[var(--muted-foreground)]">
            <Mail className="size-3.5" aria-hidden />
            <a
              href="mailto:hello@myfundedacademy.com"
              className="transition-colors hover:text-[var(--foreground)]"
            >
              hello@myfundedacademy.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function DirColumn({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
        <span aria-hidden className="font-mono text-[10px] text-[var(--primary)]">
          {index}
        </span>
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)]">
          {title}
        </span>
      </p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function DirLink({ href, children }: { href: FooterHref; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <span
          aria-hidden
          className="h-px w-2 bg-[var(--border)] transition-colors group-hover:bg-[var(--primary)]"
        />
        <span>{children}</span>
      </Link>
    </li>
  );
}

function SocialCell({
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
      className="-ms-px grid size-9 place-items-center border border-[var(--border)] text-[var(--muted-foreground)] transition-colors first:ms-0 hover:z-10 hover:border-[var(--primary)] hover:text-[var(--primary)]"
    >
      <Icon className="size-4" />
    </a>
  );
}

function NewsletterPrompt({
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
      <form onSubmit={onSubmit} className="mt-3 max-w-sm">
        <div className="dxphosphor-input">
          <span aria-hidden className="ps-3 font-mono text-sm text-[var(--primary)]">
            {">"}
          </span>
          <input
            type="email"
            required
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            type="submit"
            className="h-11 shrink-0 border-s border-[var(--border)] bg-[var(--primary)] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
          >
            {cta}
          </button>
        </div>
      </form>
    </div>
  );
}
