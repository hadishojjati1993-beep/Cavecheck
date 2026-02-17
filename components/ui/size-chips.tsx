"use client";

import * as React from "react";

export type FootSizes = {
  mm: number;      // kept for pipeline, not shown
  eu: string;
  us: string;
  uk: string;
  jp: string;
};

type Props = {
  sizes: FootSizes | null;
  className?: string;
};

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="ui-surface-2 px-3 py-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] tracking-wide text-muted">{label}</span>
        <span className="text-base font-semibold">{value}</span>
      </div>
    </div>
  );
}

export function SizeChips({ sizes, className }: Props) {
  if (!sizes) return null;

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3">
        <Chip label="EU" value={sizes.eu} />
        <Chip label="US" value={sizes.us} />
        <Chip label="UK" value={sizes.uk} />
        <Chip label="JP" value={sizes.jp} />
      </div>
    </div>
  );
}