import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...rest }: Props) {
  return <div className={cn("animate-pulse rounded-md bg-paper-2", className)} {...rest} />;
}

export function ShimmerText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-4/5" : "w-full")} />
      ))}
    </div>
  );
}

export function ShimmerCircle({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton className={cn("rounded-full", className)} style={{ width: size, height: size }} />
  );
}

export function ShimmerCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 rounded-xl border border-border bg-card p-4", className)}>
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <ShimmerCircle size={28} />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
