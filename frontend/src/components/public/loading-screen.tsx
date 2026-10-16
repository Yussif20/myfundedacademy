import { Wordmark } from "@/components/brand/wordmark";

/** Full-screen wait state: the wordmark over paper with one quiet hairline sweep. */
export function LoadingScreen({ caption }: { caption?: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background" role="status">
      <div className="flex flex-col items-center gap-6">
        <Wordmark height={44} />
        <div className="relative h-px w-32 overflow-hidden bg-border">
          <span className="loading-sweep absolute inset-y-0 start-0 w-1/3 bg-gold" />
        </div>
        {caption && <p className="text-sm text-muted-foreground">{caption}</p>}
      </div>
    </div>
  );
}
