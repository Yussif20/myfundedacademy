"use client";

import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <Toaster
        position="top-center"
        closeButton
        duration={4000}
        toastOptions={{
          classNames: {
            toast:
              "!rounded-lg !border !border-border !bg-card !text-foreground !shadow-none !font-sans",
            title: "!font-medium",
            description: "!text-muted-foreground",
            success: "!border-s-2 !border-s-primary",
            error: "!border-s-2 !border-s-destructive",
            info: "!border-s-2 !border-s-gold",
          },
        }}
      />
      {children}
    </ReduxProvider>
  );
}
