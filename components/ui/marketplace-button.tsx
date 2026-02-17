"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";

type Props = {
  name: string;
  enabled: boolean;
  onClick?: () => void;
};

function toBrandKey(name: string) {
  const n = name.toLowerCase().trim();
  if (n.includes("amazon")) return "amazon";
  if (n.includes("zalando")) return "zalando";
  if (n === "ebay" || n.includes("ebay")) return "ebay";
  if (n.includes("decathlon")) return "decathlon";
  if (n.includes("asos")) return "asos";
  if (n.includes("zappos")) return "zappos";
  if (n.includes("foot locker")) return "footlocker";
  if (n.includes("jd sports") || n.includes("jd")) return "jdsports";
  if (n.includes("nike")) return "nike";
  if (n.includes("adidas")) return "adidas";
  if (n.includes("puma")) return "puma";
  if (n.includes("farfetch")) return "farfetch";
  if (n.includes("ssense")) return "ssense";
  if (n.includes("stockx")) return "stockx";
  if (n.includes("goat")) return "goat";
  return "amazon"; // fallback
}

export function MarketplaceButton({ name, enabled, onClick }: Props) {
  const brand = toBrandKey(name);

  return (
    <button
      type="button"
      data-brand={brand}
      className={[
        "brand-btn ui-tap ui-surface-2",
        "relative flex w-full items-center justify-between gap-3 px-4 py-3",
        "text-left text-sm font-medium",
        enabled ? "cursor-pointer" : "cursor-not-allowed opacity-55",
      ].join(" ")}
      aria-disabled={!enabled}
      disabled={!enabled}
      onClick={() => {
        if (!enabled) return;
        onClick?.();
      }}
    >
      <span className="truncate">{name}</span>
      <span className="flex items-center gap-2 text-muted">
        <ExternalLink className="h-4 w-4 opacity-80" aria-hidden="true" />
      </span>
    </button>
  );
}