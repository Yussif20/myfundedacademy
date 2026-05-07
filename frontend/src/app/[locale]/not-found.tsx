"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Error3d = dynamic(() => import("@/components/public/error-3d"), {
  ssr: false,
  loading: () => null,
});

export default function NotFound() {
  const reduced = useReducedMotion();
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    if (!reduced && !isSmall) setEnable3d(true);
  }, [reduced]);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Aurora glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 22%, transparent), transparent 60%)",
        }}
      />

      {/* 3D shape — desktop only */}
      {enable3d && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Error3d />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[8rem] font-extrabold leading-none tracking-tighter md:text-[11rem]"
        >
          <span className="text-gradient-brand">4</span>
          <span className="text-[var(--foreground)]">0</span>
          <span className="text-gradient-brand">4</span>
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-display text-balance text-2xl font-semibold tracking-tight md:text-3xl"
        >
          You drifted off the chart.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md text-balance text-[var(--muted-foreground)]"
        >
          The page you're looking for either moved or never existed. Let's get you back to a known
          ticker.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="brand-glow gap-2">
            <Link href="/">
              <Home className="size-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/courses">
              Browse courses
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
