"use client";

/**
 * Ticker-tape divider — a 2px-bordered marquee band of monospaced pairs.
 * Chartreuse for up-moves, magenta for down-moves. Pauses on hover; renders
 * static under prefers-reduced-motion (handled in acid.css). The band is
 * forced LTR because ticker symbols are language-neutral market data.
 */

const TICKS: ReadonlyArray<{ s: string; v: string; up: boolean }> = [
  { s: "EURUSD", v: "+0.42%", up: true },
  { s: "BTCUSD", v: "-1.10%", up: false },
  { s: "XAUUSD", v: "+0.08%", up: true },
  { s: "NAS100", v: "+1.24%", up: true },
  { s: "GBPJPY", v: "-0.35%", up: false },
  { s: "US30", v: "+0.67%", up: true },
  { s: "SPX500", v: "+0.31%", up: true },
  { s: "USDJPY", v: "-0.12%", up: false },
  { s: "ETHUSD", v: "+2.05%", up: true },
  { s: "USOIL", v: "-0.48%", up: false },
];

function TickRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex" aria-hidden={hidden || undefined}>
      {TICKS.map((tick) => (
        <span key={tick.s} className="dxacid-tick">
          <span className="text-[var(--foreground)]">{tick.s}</span>
          <span className={tick.up ? "dxacid-up" : "dxacid-down"}>
            {tick.v} {tick.up ? "▲" : "▼"}
          </span>
        </span>
      ))}
    </div>
  );
}

export function AcidTicker() {
  return (
    <div className="dxacid-ticker" role="presentation">
      <div className="dxacid-ticker-track">
        <TickRow />
        <TickRow hidden />
      </div>
    </div>
  );
}
