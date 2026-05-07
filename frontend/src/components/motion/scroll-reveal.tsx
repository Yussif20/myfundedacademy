"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { type ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<typeof motion.div> & {
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
};

export function ScrollReveal({
  children,
  distance = 24,
  duration = 0.7,
  delay = 0,
  once = true,
  amount = 0.25,
  ...rest
}: Props) {
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
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
