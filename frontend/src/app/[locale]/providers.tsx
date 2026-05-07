"use client";

import { CursorSpotlight, LenisProvider, PageTransition } from "@/components/motion";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <LenisProvider>
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            classNames: {
              toast: "!rounded-xl !border !backdrop-blur-md !shadow-lg !shadow-black/10 !font-sans",
              title: "!font-medium !tracking-tight",
              description: "!text-[var(--muted-foreground)]",
              success:
                "!bg-[color-mix(in_oklch,var(--card)_85%,transparent)] !border-[color-mix(in_oklch,var(--primary)_30%,transparent)] !text-[var(--foreground)]",
              error:
                "!bg-[color-mix(in_oklch,var(--card)_85%,transparent)] !border-[color-mix(in_oklch,var(--destructive)_35%,transparent)] !text-[var(--foreground)]",
              info: "!bg-[color-mix(in_oklch,var(--card)_85%,transparent)] !border-[var(--border)] !text-[var(--foreground)]",
            },
          }}
        />
        <CursorSpotlight />
        <PageTransition>{children}</PageTransition>
      </LenisProvider>
    </ReduxProvider>
  );
}
