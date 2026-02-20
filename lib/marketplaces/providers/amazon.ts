// lib/marketplaces/providers/amazon.ts

import type { MarketplaceProvider } from "../types";

function buildSearchQuery(input: {
  query?: string;
  brandId?: string;
  gender?: string;
  eu?: string;
  us?: string;
  uk?: string;
  jp?: string;
}): string {
  const parts: string[] = [];

  if (input.query?.trim()) parts.push(input.query.trim());
  if (input.brandId && input.brandId !== "generic") parts.push(input.brandId);
  if (input.gender && input.gender !== "unisex") parts.push(input.gender);

  // Prefer EU (common in many listings), then US/UK/JP
  if (input.eu) parts.push(`EU ${input.eu}`);
  else if (input.us) parts.push(`US ${input.us}`);
  else if (input.uk) parts.push(`UK ${input.uk}`);
  else if (input.jp) parts.push(`JP ${input.jp}`);

  return parts.join(" ").trim() || "shoes";
}

export const amazonProvider: MarketplaceProvider = {
  id: "amazon",
  build: (input) => {
    // Amazon has many locales; use .com as default
    const base = "https://www.amazon.com/s";
    const params = new URLSearchParams();

    const q = buildSearchQuery({
      query: input.query,
      brandId: input.brandId,
      gender: input.gender,
      eu: input.eu,
      us: input.us,
      uk: input.uk,
      jp: input.jp,
    });

    params.set("k", q);

    return { url: `${base}?${params.toString()}` };
  },
};