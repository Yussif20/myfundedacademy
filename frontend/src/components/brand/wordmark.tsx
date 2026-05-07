import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
  /** Pixel height of the rendered logo. Width is computed from the SVG aspect ratio. */
  height?: number;
};

const NATURAL_WIDTH = 690;
const NATURAL_HEIGHT = 370;

export function Wordmark({ className, height = 40 }: Props) {
  const width = Math.round((NATURAL_WIDTH / NATURAL_HEIGHT) * height);
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.svg"
        alt="My Funded Academy"
        width={width}
        height={height}
        priority
        style={{ height, width: "auto" }}
      />
    </div>
  );
}
