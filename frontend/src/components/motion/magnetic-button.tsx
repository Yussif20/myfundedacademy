"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { type ComponentPropsWithoutRef, type MouseEvent, useRef } from "react";

type Props = ComponentPropsWithoutRef<typeof motion.button> & {
  strength?: number;
};

export function MagneticButton({
  children,
  strength = 0.3,
  onMouseMove,
  onMouseLeave,
  className,
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!reduced && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    }
    onMouseMove?.(e);
  };

  const handleLeave = (e: MouseEvent<HTMLButtonElement>) => {
    x.set(0);
    y.set(0);
    onMouseLeave?.(e);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
