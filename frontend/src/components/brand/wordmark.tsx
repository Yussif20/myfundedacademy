import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
  /** Pixel height of the rendered logo. Width is computed from the SVG aspect ratio. */
  height?: number;
};

const NATURAL_WIDTH = 690;
const NATURAL_HEIGHT = 370;

export function Wordmark({ className, height = 48 }: Props) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.svg"
        alt="My Funded Academy"
        width={NATURAL_WIDTH}
        height={NATURAL_HEIGHT}
        priority
        style={{ height, width: "auto" }}
      />
    </div>
  );
}
