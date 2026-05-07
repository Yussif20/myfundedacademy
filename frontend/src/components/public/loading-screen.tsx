"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { motion, useReducedMotion } from "framer-motion";

export function LoadingScreen({ caption }: { caption?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--background)]">
      {/* Soft brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 h-[400px] opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 35%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          animate={
            reduced
              ? {}
              : {
                  scale: [1, 1.03, 1],
                  opacity: [0.85, 1, 0.85],
                }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wordmark height={48} />
        </motion.div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={
                reduced
                  ? {}
                  : {
                      y: [0, -6, 0],
                      opacity: [0.4, 1, 0.4],
                    }
              }
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
              className="size-1.5 rounded-full bg-[var(--primary)]"
            />
          ))}
        </div>
        {caption && (
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
