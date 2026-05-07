"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  className?: string;
  showLabel?: boolean;
};

export function ProgressRing({
  value,
  size = 32,
  stroke = 3,
  className,
  showLabel = false,
}: Props) {
  const reduced = useReducedMotion();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = circumference * (1 - clamped);
  const isComplete = clamped >= 0.999;

  return (
    <span
      className={`relative inline-grid place-items-center ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in oklch, var(--secondary) 70%, transparent)"
          strokeWidth={stroke}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? "var(--primary)" : "var(--primary)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: reduced ? offset : offset }}
          transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute font-display text-[10px] font-semibold leading-none text-[var(--primary)]"
          style={{ fontSize: Math.max(9, size * 0.32) }}
        >
          {Math.round(clamped * 100)}%
        </span>
      )}
    </span>
  );
}
