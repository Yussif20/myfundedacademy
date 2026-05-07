"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { type ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<typeof motion.div> & {
  stagger?: number;
  delayChildren?: number;
};

export function StaggerChildren({
  children,
  stagger = 0.08,
  delayChildren = 0.1,
  ...rest
}: ContainerProps) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delayChildren,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}

type ItemProps = ComponentPropsWithoutRef<typeof motion.div> & {
  distance?: number;
};

export function StaggerItem({ children, distance = 14, ...rest }: ItemProps) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
