import { type ComponentPropsWithoutRef, type ReactNode } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & { strength?: number };

/** Legacy API: the magnetic pull is gone (Paper & Ink is calm); renders a plain button. */
export function MagneticButton({ strength: _s, ...rest }: ButtonProps) {
  return <button {...rest} />;
}

type WrapProps = { children: ReactNode; className?: string; strength?: number };

/** Legacy API: plain inline wrapper. */
export function Magnetic({ children, className }: WrapProps) {
  return <div className={`inline-block ${className ?? ""}`}>{children}</div>;
}
