"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Hero3dScene = dynamic(() => import("./hero-3d-scene"), {
  ssr: false,
  loading: () => <Hero3dFallback />,
});

function Hero3dFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 30%, transparent) 0%, transparent 60%)",
      }}
    />
  );
}

export function Hero3d() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.matchMedia("(max-width: 768px)").matches;
    if (!reduced && !isSmall) setEnabled(true);
  }, []);

  return <div className="absolute inset-0">{enabled ? <Hero3dScene /> : <Hero3dFallback />}</div>;
}
