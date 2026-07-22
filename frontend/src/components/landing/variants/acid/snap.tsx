"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

/**
 * Acid Ledger motion language: zero opacity fades. Elements appear via short
 * translate/clip snaps with a hard cubic-bezier — like documents slapped onto
 * a desk. Both primitives render statically under prefers-reduced-motion.
 *
 * The clip insets are generously negative so 2px borders and hard offset
 * shadows are never cropped once the snap completes.
 */
export const ACID_EASE: [number, number, number, number] = [0.2, 0, 0, 1];

const CLIPPED = "inset(-24% -24% 112% -24%)";
const OPEN = "inset(-24% -24% -24% -24%)";

/** Entry snap for the orchestrated hero sequence (plays on mount). */
export function Snap({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ clipPath: CLIPPED, y: 18 }}
      animate={{ clipPath: OPEN, y: 0 }}
      transition={{ duration: 0.3, ease: ACID_EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-triggered snap for sections further down the ledger. */
export function SnapIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ clipPath: CLIPPED, y: 16 }}
      whileInView={{ clipPath: OPEN, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: ACID_EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
