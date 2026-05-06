"use client";

import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <Toaster richColors position="top-center" />
      {children}
    </ReduxProvider>
  );
}
