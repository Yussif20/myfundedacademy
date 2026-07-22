"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export function PublicFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");

  return (
    <footer
      data-site-chrome="footer"
      className="relative isolate overflow-hidden border-t border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_50%,transparent)]"
    >
      {/* Soft background blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[800px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 50%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="space-y-6 lg:col-span-5">
            <Wordmark />
            <p className="max-w-sm text-sm text-[var(--muted-foreground)]">{tF("tagline")}</p>

            <NewsletterForm
              title={tF("newsletterTitle")}
              sub={tF("newsletterSub")}
              placeholder={tF("newsletterPlaceholder")}
              cta={tF("newsletterCta")}
              successMessage={tF("newsletterSuccess")}
            />

            <div className="flex items-center gap-3 pt-2">
              <SocialIcon href="https://twitter.com" Icon={Twitter} label="Twitter" />
              <SocialIcon href="https://youtube.com" Icon={Youtube} label="YouTube" />
              <SocialIcon href="https://linkedin.com" Icon={Linkedin} label="LinkedIn" />
              <SocialIcon href="https://github.com" Icon={Github} label="GitHub" />
            </div>
          </div>

          {/* Link columns */}
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

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[color-mix(in_oklch,var(--border)_60%,transparent)] pt-6 text-xs text-[var(--muted-foreground)] md:flex-row">
          <p>
            © {new Date().getFullYear()} My Funded Academy. {tF("rights")}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-3.5" />
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

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 font-display text-sm font-semibold tracking-tight">{title}</p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href as Parameters<typeof Link>[0]["href"]}
        className="group relative inline-block text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <span>{children}</span>
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-[var(--primary)] transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
        />
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
      className="group grid size-9 place-items-center rounded-full border border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_60%,transparent)] text-[var(--muted-foreground)] transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]"
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
  const [focused, setFocused] = useState(false);

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
        <div
          className={`relative flex w-full items-center rounded-lg border bg-[color-mix(in_oklch,var(--card)_70%,transparent)] backdrop-blur transition-all ${
            focused
              ? "border-[var(--primary)] shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_20%,transparent)]"
              : "border-[var(--border)]"
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
            className="h-11 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            type="submit"
            className="group inline-flex h-11 items-center gap-1 rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-all hover:brightness-110"
          >
            {cta}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
