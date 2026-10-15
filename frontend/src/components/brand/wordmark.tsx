import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
  /** Pixel height of the rendered logo. Width is computed from the SVG aspect ratio. */
  height?: number;
};

const NATURAL_WIDTH = 527;
const NATURAL_HEIGHT = 120;

/** Nibras · نبراس lockup: teal text in light mode, white text in dark mode. */
export function Wordmark({ className, height = 48 }: Props) {
  const imageProps = {
    alt: "Nibras · نبراس",
    width: NATURAL_WIDTH,
    height: NATURAL_HEIGHT,
    priority: true,
    style: { height, width: "auto" },
  } as const;

  return (
    <div className={cn("flex items-center", className)}>
      <Image src="/logo.svg" className="dark:hidden" {...imageProps} />
      <Image src="/logo-dark.svg" className="hidden dark:block" {...imageProps} />
    </div>
  );
}
