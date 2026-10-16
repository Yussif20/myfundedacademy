import { type ComponentPropsWithoutRef } from "react";
import { Reveal } from "@/components/ui/reveal";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  stagger?: number;
  delayChildren?: number;
};

/** Legacy API: a plain wrapper now; each <StaggerItem> reveals on its own. */
export function StaggerChildren({ stagger: _s, delayChildren: _d, ...rest }: ContainerProps) {
  return <div {...rest} />;
}

type ItemProps = ComponentPropsWithoutRef<"div"> & { distance?: number };

export function StaggerItem({ distance: _d, ...rest }: ItemProps) {
  return <Reveal {...rest} />;
}
