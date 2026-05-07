"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { type MouseEvent, type ReactNode, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export function TiltCard({ children, className, intensity = 8 }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(50);
  const py = useMotionValue(50);

  const srx = useSpring(rx, { stiffness: 220, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 220, damping: 18, mass: 0.4 });

  const transform = useMotionTemplate`perspective(900px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const glare = useMotionTemplate`radial-gradient(closest-side at ${px}% ${py}%, color-mix(in oklch, white 22%, transparent), transparent 60%)`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    ry.set(xPct * intensity);
    rx.set(-yPct * intensity);
    px.set(((e.clientX - rect.left) / rect.width) * 100);
    py.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleEnter = () => setHovered(true);
  const handleLeave = () => {
    setHovered(false);
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={`relative will-change-transform ${className ?? ""}`}
    >
      {/* Animated gradient border halo */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-px rounded-[calc(var(--radius)+2px)] blur-[8px] transition-opacity duration-300 ${
          hovered ? "opacity-60" : "opacity-0"
        }`}
        style={{
          background:
            "conic-gradient(from 0deg, color-mix(in oklch, var(--primary) 55%, transparent), color-mix(in oklch, var(--accent) 45%, transparent), color-mix(in oklch, var(--primary) 55%, transparent))",
        }}
      />
      <div className="relative" style={{ transform: "translateZ(40px)" }}>
        {children}
      </div>
      {/* Glare sweep — follows cursor */}
      <motion.div
        aria-hidden
        style={{ background: glare, opacity: hovered ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 rounded-xl mix-blend-overlay transition-opacity duration-300"
      />
    </motion.div>
  );
}
