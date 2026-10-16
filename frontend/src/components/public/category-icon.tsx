import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Camera,
  Code,
  Feather,
  Languages,
  type LucideIcon,
  Megaphone,
  Mic,
  Music,
  Palette,
  PenTool,
  Sparkles,
} from "lucide-react";

/** Categories store a lucide icon name ("palette", "pen-tool"); older rows may hold an emoji. */
const ICONS: Record<string, LucideIcon> = {
  palette: Palette,
  code: Code,
  "pen-tool": PenTool,
  feather: Feather,
  briefcase: Briefcase,
  languages: Languages,
  camera: Camera,
  "bar-chart": BarChart3,
  "bar-chart-3": BarChart3,
  megaphone: Megaphone,
  mic: Mic,
  music: Music,
  sparkles: Sparkles,
  book: BookOpen,
  "book-open": BookOpen,
};

export function CategoryIcon({ icon, className }: { icon?: string | null; className?: string }) {
  const key = icon?.trim().toLowerCase() ?? "";
  const Icon = ICONS[key];
  if (Icon) return <Icon className={cn("size-5", className)} aria-hidden />;
  // An emoji or other short glyph stored by older data.
  if (key && !/^[a-z0-9-]+$/.test(key)) {
    return (
      <span aria-hidden className={cn("text-xl leading-none", className)}>
        {icon}
      </span>
    );
  }
  return <BookOpen className={cn("size-5", className)} aria-hidden />;
}
