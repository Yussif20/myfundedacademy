"use client";

/**
 * Controlled Burn section heading — a tape index tag over a condensed
 * uppercase ticker-board title, with an optional end-side action.
 * `index` is a language-neutral mono numeral ("01", "02", …).
 */
export function BurnHeading({
  index,
  title,
  sub,
  action,
}: {
  index: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <span className="dxburn-tag">
          <span aria-hidden className="dxburn-tag-mark" />
          {index}
        </span>
        <h2 className="font-display mt-5 text-balance text-3xl font-bold md:text-4xl">{title}</h2>
        {sub && <p className="mt-2 text-[var(--muted-foreground)]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
