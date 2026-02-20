// lib/marketplaces/providers/zalando.ts

import type { MarketplaceProvider } from "../types";

function buildSearchQuery(input: {
  query?: string;
  brandId?: string;
  gender?: string;
  eu?: string;
}): string {
  const parts: string[] = [];

  if (input.query?.trim()) parts.push(input.query.trim());
  if (input.brandId && input.brandId !== "generic") parts.push(input.brandId);
  if (input.gender && input.gender !== "unisex") parts.push(input.gender);

  // Zalando is EU-heavy; EU hint is best
  if (input.eu) parts.push(`EU ${input.eu}`);

  return parts.join(" ").trim() || "shoes";
}

export const zalandoProvider: MarketplaceProvider = {
  id: "zalando",
  build: (input) => {
    const base = "https://www.zalando.com/catalog/";
    const params = new URLSearchParams();

    params.set(
      "q",
      buildSearchQuery({
        query: input.query,
        brandId: input.brandId,
        gender: input.gender,
        eu: input.eu,
      })
    );

    return { url: `${base}?${params.toString()}` };
  },
};