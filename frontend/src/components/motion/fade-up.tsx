import { type ComponentPropsWithoutRef } from "react";
import { Reveal } from "@/components/ui/reveal";

type Props = ComponentPropsWithoutRef<"div"> & {
  /** Seconds, kept from the old framer-motion API. */
  delay?: number;
  distance?: number;
  duration?: number;
};

/** Legacy API, now a calm <Reveal>. Prefer <Reveal> in new code. */
export function FadeUp({ delay = 0, distance: _d, duration: _t, ...rest }: Props) {
  return <Reveal delay={delay * 1000} {...rest} />;
}
