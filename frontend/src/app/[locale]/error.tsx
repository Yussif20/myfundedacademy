"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Home, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklch, var(--destructive) 18%, transparent), transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[8rem] font-extrabold leading-none tracking-tighter md:text-[11rem]"
        >
          <span className="text-gradient-brand">5</span>
          <span className="text-[var(--foreground)]">0</span>
          <span className="text-gradient-brand">0</span>
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-display text-balance text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Margin called.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md text-balance text-[var(--muted-foreground)]"
        >
          Something on our side blew up. The team has been notified — try again, or head back home.
        </motion.p>
        {error.digest && (
          <p className="font-mono text-xs text-[var(--muted-foreground)]">ref: {error.digest}</p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button onClick={reset} size="lg" className="brand-glow gap-2">
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/">
              <Home className="size-4" />
              Back to home
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
