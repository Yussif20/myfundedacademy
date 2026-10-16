import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/8 text-primary",
        secondary: "border-border bg-paper-2 text-muted-foreground",
        outline: "border-border text-foreground",
        gold: "border-gold/40 text-accent",
        success: "border-success/25 bg-success/8 text-success",
        warning: "border-warning/25 bg-warning/8 text-warning",
        destructive: "border-destructive/25 bg-destructive/8 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
