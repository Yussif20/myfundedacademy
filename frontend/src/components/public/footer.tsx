"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { CONTACT_EMAIL } from "@/config";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export function PublicFooter() {
  const t = useTranslations("nav");
  const tF = useTranslations("footer");

  return (
    /* `dark` scopes the dark palette to the footer, so it reads as an ink block in both themes. */
    <footer className="dark relative bg-background text-foreground">
      <div
        aria-hidden
        className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="space-y-6 lg:col-span-5">
            <Wordmark height={44} />
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">{tF("tagline")}</p>

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

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} Nibras. {tF("rights")}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-3.5" />
            <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-foreground">
              {CONTACT_EMAIL}
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
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href as Parameters<typeof Link>[0]["href"]}
        className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>{children}</span>
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right"
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
      className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
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
      <p className="font-display text-lg tracking-tight">{title}</p>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">{sub}</p>
      <form onSubmit={onSubmit} className="mt-3 flex max-w-sm">
        <div
          className={`relative flex w-full items-center rounded-full border bg-card transition-colors ${
            focused ? "border-primary" : "border-input/60"
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
            className="h-11 min-w-0 flex-1 bg-transparent ps-5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="group m-1 inline-flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {cta}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
