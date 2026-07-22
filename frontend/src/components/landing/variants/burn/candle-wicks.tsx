"use client";

/**
 * Candle-wick divider — rows of thin vertical strokes of varying heights
 * (abstracted candlesticks) with a few gradient-tinted "hot" ones.
 * The only illustration language the Controlled Burn brand needs.
 * Purely decorative and direction-neutral (symmetric enough for RTL).
 */

const WICK_HEIGHTS = [8, 14, 10, 22, 12, 28, 16, 34, 18, 26, 12, 20, 30, 15, 9, 24, 11, 17];
const HOT_WICKS = new Set([5, 7, 12]);

export function CandleWicks() {
  return (
    <div aria-hidden className="dxburn-wicks">
      {WICK_HEIGHTS.map((height, i) => (
        <span
          key={i}
          className={HOT_WICKS.has(i) ? "dxburn-wick dxburn-wick--hot" : "dxburn-wick"}
          style={{ height }}
        />
      ))}
    </div>
  );
}
