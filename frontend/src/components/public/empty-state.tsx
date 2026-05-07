"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

type Props = {
  illustration?: "compass" | "package" | "search" | "trophy";
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  illustration = "compass",
  title,
  description,
  action,
  className,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklch,var(--card)_60%,transparent)] px-6 py-16 text-center backdrop-blur ${className ?? ""}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5"
      >
        <Illustration kind={illustration} />
      </motion.div>
      <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function Illustration({ kind }: { kind: "compass" | "package" | "search" | "trophy" }) {
  const reduced = useReducedMotion();
  const float = reduced
    ? {}
    : {
        y: [0, -4, 0],
      };

  return (
    <motion.div
      animate={float}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto grid size-28 place-items-center"
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 50%, transparent), transparent 65%)",
        }}
      />
      <svg
        viewBox="0 0 120 120"
        className="relative size-24 text-[var(--primary)]"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "compass" && <CompassPath />}
        {kind === "package" && <PackagePath />}
        {kind === "search" && <SearchPath />}
        {kind === "trophy" && <TrophyPath />}
      </svg>
    </motion.div>
  );
}

function CompassPath() {
  return (
    <>
      <circle cx="60" cy="60" r="44" strokeOpacity={0.45} />
      <circle cx="60" cy="60" r="34" />
      <path d="M60 36 L66 60 L60 84 L54 60 Z" fill="currentColor" fillOpacity={0.12} />
      <circle cx="60" cy="60" r="3" fill="currentColor" />
      <path d="M60 26 L60 30" strokeOpacity={0.6} />
      <path d="M60 90 L60 94" strokeOpacity={0.6} />
      <path d="M26 60 L30 60" strokeOpacity={0.6} />
      <path d="M90 60 L94 60" strokeOpacity={0.6} />
    </>
  );
}

function PackagePath() {
  return (
    <>
      <path
        d="M60 18 L102 38 L102 82 L60 102 L18 82 L18 38 Z"
        fill="currentColor"
        fillOpacity={0.08}
      />
      <path d="M18 38 L60 60 L102 38" />
      <path d="M60 60 L60 102" />
      <path d="M39 28 L81 50" strokeOpacity={0.45} strokeDasharray="3 4" />
    </>
  );
}

function SearchPath() {
  return (
    <>
      <circle cx="50" cy="50" r="28" fill="currentColor" fillOpacity={0.08} />
      <circle cx="50" cy="50" r="28" />
      <path d="M72 72 L98 98" strokeWidth={5} strokeLinecap="round" />
      <path d="M40 50 L60 50" strokeOpacity={0.5} />
      <path d="M40 42 L60 42" strokeOpacity={0.3} />
      <path d="M40 58 L52 58" strokeOpacity={0.3} />
    </>
  );
}

function TrophyPath() {
  return (
    <>
      <path
        d="M40 30 L80 30 L80 56 C80 70 70 80 60 80 C50 80 40 70 40 56 Z"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <path d="M40 30 L80 30 L80 56 C80 70 70 80 60 80 C50 80 40 70 40 56 Z" />
      <path d="M40 36 L26 36 L26 50 L40 56" strokeOpacity={0.5} />
      <path d="M80 36 L94 36 L94 50 L80 56" strokeOpacity={0.5} />
      <path d="M52 80 L52 92 L68 92 L68 80" />
      <path d="M44 100 L76 100" />
      <circle cx="60" cy="56" r="4" fill="currentColor" />
    </>
  );
}
