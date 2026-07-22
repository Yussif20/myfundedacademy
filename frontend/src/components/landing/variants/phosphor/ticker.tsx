"use client";

/**
 * Phosphor Terminal Noir — ticker tape.
 * A slow, hairline-bounded marquee streaming course stats as market tickers.
 * Language-neutral by design (symbols + numerals only); forced LTR internally
 * while the scroll direction reverses on RTL pages via CSS.
 * Pauses on hover, freezes under prefers-reduced-motion (CSS-handled).
 */

type TickerItem = {
  symbol: string;
  delta: string;
  up: boolean;
};

const ITEMS: TickerItem[] = [
  { symbol: "RISK-MGMT-101", delta: "▲ 4.9 ★", up: true },
  { symbol: "PRICE-ACTION", delta: "▲ 2.1K", up: true },
  { symbol: "EURUSD", delta: "+0.42%", up: true },
  { symbol: "SMC-ADV", delta: "▲ 4.8 ★", up: true },
  { symbol: "BTCUSD", delta: "−1.10%", up: false },
  { symbol: "FUNDED-EVAL", delta: "▲ 980", up: true },
  { symbol: "XAUUSD", delta: "+0.08%", up: true },
  { symbol: "ICT-FOUND", delta: "▲ 1.4K", up: true },
  { symbol: "NAS100", delta: "+0.67%", up: true },
  { symbol: "PSY-EDGE", delta: "▲ 4.7 ★", up: true },
];

export function PhosphorTicker() {
  return (
    <div className="dxphosphor-ticker" aria-hidden dir="ltr">
      <div className="dxphosphor-ticker-track">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-stretch">
            {ITEMS.map((item) => (
              <span
                key={`${half}-${item.symbol}`}
                className="flex shrink-0 items-center gap-2 border-e border-[var(--border)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em]"
              >
                <span className="text-[var(--muted-foreground)]">{item.symbol}</span>
                <span className={item.up ? "text-[var(--primary)]" : "text-[var(--destructive)]"}>
                  {item.delta}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
