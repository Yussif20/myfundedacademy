import { type ComponentPropsWithoutRef } from "react";
import { Reveal } from "@/components/ui/reveal";

type Props = ComponentPropsWithoutRef<"div"> & {
  distance?: number;
  duration?: number;
  /** Seconds, kept from the old framer-motion API. */
  delay?: number;
  once?: boolean;
  amount?: number;
};

/** Legacy API, now a calm <Reveal>. Prefer <Reveal> in new code. */
export function ScrollReveal({
  delay = 0,
  distance: _d,
  duration: _t,
  once: _o,
  amount: _a,
  ...rest
}: Props) {
  return <Reveal delay={delay * 1000} {...rest} />;
}
