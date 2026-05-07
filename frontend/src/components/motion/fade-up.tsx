"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { type ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<typeof motion.div> & {
  delay?: number;
  distance?: number;
  duration?: number;
};

export function FadeUp({ children, delay = 0, distance = 16, duration = 0.6, ...rest }: Props) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
