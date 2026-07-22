"use client";

import { FadeUp, StaggerChildren, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { animate, motion, useMotionTemplate, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, Award, Clock3, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/* Language-neutral decorative data — numerals + ticker symbols only. */
const TICKERS = [
  { symbol: "EURUSD", delta: "+0.42%", up: true },
  { symbol: "XAUUSD", delta: "-0.18%", up: false },
  { symbol: "NAS100", delta: "+1.06%", up: true },
];

/* Deterministic mock candles (SVG y grows downward — upward drift). */
const CANDLES = [
  { x: 8, y: 52, h: 12, w1: 48, w2: 68, up: true },
  { x: 26, y: 50, h: 10, w1: 46, w2: 64, up: true },
  { x: 44, y: 54, h: 9, w1: 50, w2: 66, up: false },
  { x: 62, y: 44, h: 14, w1: 40, w2: 60, up: true },
  { x: 80, y: 40, h: 10, w1: 36, w2: 54, up: true },
  { x: 98, y: 46, h: 8, w1: 42, w2: 56, up: false },
  { x: 116, y: 34, h: 14, w1: 30, w2: 50, up: true },
  { x: 134, y: 30, h: 9, w1: 26, w2: 42, up: true },
  { x: 152, y: 36, h: 8, w1: 32, w2: 46, up: false },
  { x: 170, y: 24, h: 13, w1: 20, w2: 40, up: true },
  { x: 188, y: 20, h: 9, w1: 16, w2: 32, up: true },
  { x: 206, y: 14, h: 11, w1: 10, w2: 28, up: true },
];

const STATS = [
  { icon: Users, value: "12,431" },
  { icon: Clock3, value: "480+" },
  { icon: Award, value: "3,970" },
];

const SPRING = { stiffness: 160, damping: 20 };

export function HoloHero() {
  const t = useTranslations("home");
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      {/* Prismatic horizon line — draws itself across on load */}
      <motion.div
        aria-hidden
        className="dxholo-horizon top-[68%]"
        initial={reduced ? false : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.4 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:py-32 lg:min-h-[88vh] lg:grid-cols-[1.05fr_0.95fr]">
        <StaggerChildren stagger={0.07} delayChildren={0.05} className="text-start">
          <StaggerItem>
            <span className="dxholo-eyebrow">
              <span aria-hidden className="dxholo-live" />
              {t("heroEyebrow")}
            </span>
          </StaggerItem>

          <StaggerItem>
            <h1 className="dxholo-aberration font-display mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--foreground)] sm:text-5xl md:text-6xl lg:text-7xl">
              {t.rich("heroTitle", {
                accent: (chunks) => (
                  <span className="dxholo-prism-text">
                    <span className="text-gradient-brand">{chunks}</span>
                  </span>
                ),
              })}
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-7 max-w-[60ch] text-balance text-lg text-[var(--muted-foreground)]">
              {t("heroSubtitle")}
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="dxholo-cta group h-12 gap-2 px-7 text-base">
                <Link href="/courses">
                  {t("heroCta")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="dxholo-ghost dxholo-prism-border h-12 px-6 text-base"
              >
                <Link href="/pricing">{t("heroSecondary")}</Link>
              </Button>
            </div>
          </StaggerItem>

          <StaggerItem>
            {/* Hero stat card: obsidian glass inside the prismatic hairline */}
            <div className="dxholo-glass dxholo-prism-border mt-12 inline-flex max-w-full items-stretch rounded-[10px]">
              {STATS.map(({ icon: Icon, value }, i) => (
                <div
                  key={value}
                  className={`flex items-center gap-3 px-6 py-4 ${
                    i > 0 ? "border-s border-[var(--border)]" : ""
                  }`}
                >
                  <Icon aria-hidden className="size-4 text-[var(--muted-foreground)]" />
                  <span className="dxholo-num text-lg font-semibold text-[var(--foreground)]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </StaggerItem>
        </StaggerChildren>

        <FadeUp delay={0.55} className="relative">
          <TerminalCard />
        </FadeUp>
      </div>

      {/* Bottom edge fade into the page ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />
    </section>
  );
}

/* The "wow": a floating obsidian terminal card that tilts in 3D under the
 * pointer while a holographic foil glare tracks the cursor — like turning a
 * metal card in the light. Sparkline draws itself on load; the iridescent
 * progress ring counts up. All of it stands down under reduced motion. */
function TerminalCard() {
  const reduced = useReducedMotion();

  const rx = useSpring(0, SPRING);
  const ry = useSpring(0, SPRING);
  const gx = useSpring(50, { stiffness: 220, damping: 26 });
  const gy = useSpring(35, { stiffness: 220, damping: 26 });
  const glareOpacity = useSpring(0, { stiffness: 220, damping: 30 });
  const glare = useMotionTemplate`radial-gradient(340px circle at ${gx}% ${gy}%, rgba(125, 243, 255, 0.2), rgba(199, 156, 255, 0.1) 45%, rgba(255, 155, 224, 0.06) 65%, transparent 80%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(py * -10);
    ry.set(px * 14);
    gx.set((px + 0.5) * 100);
    gy.set((py + 0.5) * 100);
    glareOpacity.set(1);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(35);
    glareOpacity.set(0);
  };

  /* Iridescent ring count-up */
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (reduced) {
      setProgress(68);
      return;
    }
    const controls = animate(0, 68, {
      duration: 1.6,
      delay: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
    });
    return () => controls.stop();
  }, [reduced]);

  return (
    <div aria-hidden className="dxholo-float mx-auto w-full max-w-md">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      >
        <div className="dxholo-glass relative overflow-hidden rounded-[10px] p-5">
          {/* Header — language-neutral micro-label */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="dxholo-live" />
              <span className="dxholo-num text-[11px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                MFA · 24/7
              </span>
            </span>
            <span className="dxholo-num text-[11px] tracking-[0.14em] text-[var(--muted-foreground)]">
              01
            </span>
          </div>

          {/* Candlestick sparkline + prismatic trend line drawing on load */}
          <svg
            viewBox="0 0 220 80"
            className="mt-4 h-auto w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="dxholo-spark"
                x1="0"
                y1="0"
                x2="220"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="var(--dxholo-ring-1)" />
                <stop offset="0.55" stopColor="var(--dxholo-ring-2)" />
                <stop offset="1" stopColor="var(--dxholo-ring-3)" />
              </linearGradient>
            </defs>
            <line x1="0" y1="26" x2="220" y2="26" stroke="var(--border)" strokeWidth="1" />
            <line x1="0" y1="52" x2="220" y2="52" stroke="var(--border)" strokeWidth="1" />
            {CANDLES.map((c) => (
              <g key={c.x}>
                <line
                  x1={c.x + 3}
                  y1={c.w1}
                  x2={c.x + 3}
                  y2={c.w2}
                  stroke={c.up ? "var(--dxholo-up)" : "var(--dxholo-down)"}
                  strokeWidth="1"
                />
                <rect
                  x={c.x}
                  y={c.y}
                  width="6"
                  height={c.h}
                  rx="1"
                  fill={c.up ? "var(--dxholo-up)" : "var(--dxholo-down)"}
                />
              </g>
            ))}
            <motion.path
              d="M4 60 L 29 56 L 47 58 L 65 50 L 83 45 L 101 50 L 119 40 L 137 34 L 155 40 L 173 30 L 191 24 L 212 18"
              stroke="url(#dxholo-spark)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 1.4, delay: 0.9, ease: "easeInOut" }}
            />
          </svg>

          {/* Progress ring + tickers */}
          <div className="mt-5 flex items-center gap-5 border-t border-[var(--border)] pt-5">
            <div
              className="dxholo-ring size-20 shrink-0"
              style={{ "--dxholo-p": `${progress}%` } as React.CSSProperties}
            >
              <span className="dxholo-num text-sm font-semibold text-[var(--foreground)]">
                {progress}%
              </span>
            </div>
            <ul className="min-w-0 flex-1 space-y-2.5">
              {TICKERS.map((row) => (
                <li key={row.symbol} className="flex items-center justify-between gap-4">
                  <span className="dxholo-num text-xs tracking-[0.08em] text-[var(--muted-foreground)]">
                    {row.symbol}
                  </span>
                  <span
                    className={`dxholo-num text-xs font-semibold ${
                      row.up ? "dxholo-up" : "dxholo-down"
                    }`}
                  >
                    {row.delta}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pointer-tracked holographic glare */}
          <motion.div
            className="dxholo-glare"
            style={{ backgroundImage: glare, opacity: glareOpacity }}
          />
        </div>
      </motion.div>
    </div>
  );
}
