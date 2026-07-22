"use client";

/**
 * Ledger section header — a full-width 2px rule with a small bordered mono
 * tab sitting on the line ("§ 02 ↗"), numbering sections like ledger entries.
 * Labels are numerals only, so they stay language-neutral in EN and AR.
 */
export function LedgerRule({ num }: { num: string }) {
  return (
    <div aria-hidden className="mx-auto max-w-7xl px-6 pt-6">
      <div className="dxacid-rule">
        <span className="dxacid-rule-tab">
          § {num} <span className="dxacid-up">↗</span>
        </span>
      </div>
    </div>
  );
}
