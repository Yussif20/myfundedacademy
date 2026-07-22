"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

type StaticRoute = "/courses" | "/instructors" | "/pricing" | "/login" | "/signup";

/** Holographic Obsidian footer — a polished slab under the prism horizon, with
 *  a full-width newsletter signal bar, eyebrowed link columns, and a ghost
 *  monogram engraved into the glass. */
export function HoloFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");

  return (
    <footer className="relative isolate overflow-hidden">
      {/* The horizon returns as the footer's top edge */}
      <div aria-hidden className="dxholo-divider" />

      {/* Ghost monogram engraved into the slab */}
      <div
        aria-hidden
        className="dxholo-watermark absolute -bottom-16 end-0 text-[14rem] sm:text-[20rem]"
      >
        MFA
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-14">
        {/* Signal bar: newsletter */}
        <div className="flex flex-col gap-6 border-b border-[var(--border)] pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="dxholo-eyebrow">MFA · 24/7</span>
            <p className="font-display mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {tF("newsletterTitle")}
            </p>
            <p className="mt-1 max-w-md text-sm text-[var(--muted-foreground)]">
              {tF("newsletterSub")}
            </p>
          </div>
          <NewsletterForm
            placeholder={tF("newsletterPlaceholder")}
            cta={tF("newsletterCta")}
            successMessage={tF("newsletterSuccess")}
          />
        </div>

        {/* Brand + link columns */}
        <div className="grid gap-10 py-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <span className="flex flex-col leading-none">
              <span className="dxholo-aberration font-display text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)]">
                MFA
              </span>
              <span className="dxholo-num mt-1.5 text-[9px] uppercase tracking-[0.34em] text-[var(--muted-foreground)]">
                My&nbsp;Funded&nbsp;Academy
              </span>
            </span>
            <p className="max-w-sm text-sm text-[var(--muted-foreground)]">{tF("tagline")}</p>
            <div className="flex items-center gap-3 pt-1">
              <SocialTile href="https://twitter.com" Icon={Twitter} label="Twitter" />
              <SocialTile href="https://youtube.com" Icon={Youtube} label="YouTube" />
              <SocialTile href="https://linkedin.com" Icon={Linkedin} label="LinkedIn" />
              <SocialTile href="https://github.com" Icon={Github} label="GitHub" />
            </div>
          </div>

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

        {/* Micro bar — the card's bottom edge */}
        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted-foreground)] md:flex-row md:items-center md:justify-between">
          <p className="dxholo-num tracking-[0.04em]">
            © {new Date().getFullYear()} My Funded Academy — {tF("rights")}
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="dxholo-live" />
            <Mail className="size-3.5" aria-hidden />
            <a
              href="mailto:hello@myfundedacademy.com"
              className="dxholo-num transition-colors hover:text-[var(--foreground)]"
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
      <p className="dxholo-eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: StaticRoute; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group relative inline-block text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <span>{children}</span>
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right"
          style={{ background: "var(--dxholo-spectrum)" }}
        />
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
      className="grid size-9 place-items-center rounded-[8px] border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]"
    >
      <Icon className="size-4" />
    </a>
  );
}

function NewsletterForm({
  placeholder,
  cta,
  successMessage,
}: {
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
    <form onSubmit={onSubmit} className="w-full lg:max-w-md">
      <div className="dxholo-field flex items-center">
        <input
          type="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
        />
        <button
          type="submit"
          className="group m-1.5 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[6px] bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          {cta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
