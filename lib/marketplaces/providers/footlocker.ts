// lib/marketplaces/providers/footlocker.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import {
  safeLocale,
  safeQuery,
  safeSize,
  isSafeHttpsUrl,
} from "../../vision/utils/sanitize";

/**
 * Foot Locker: use a stable search endpoint.
 * We append size hints to improve relevance without relying on fragile filters.
 */
function buildFootLockerQuery(input: MarketplaceBuildInput): string {
  const query = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (query) parts.push(query);
  if (!query && brand) parts.push(brand);
  if (!query && !brand && product) parts.push(product);

  if (parts.length === 0) parts.push("shoes");

  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);
  const eu = safeSize(input.size?.eu);

  // Foot Locker is US-forward; US hint usually yields best results
  if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);
  else if (eu) parts.push(`EU ${eu}`);

  return safeQuery(parts.join(" "), 120);
}

function buildFootLockerUrl(input: MarketplaceBuildInput): string | null {
  // Keep it robust: main domain + search path
  const url = new URL("https://www.footlocker.com/search");
  url.searchParams.set("query", buildFootLockerQuery(input));

  // Optional metadata (safe, non-breaking)
  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("locale", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const footlockerProvider: MarketplaceProvider = {
  id: "footlocker",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildFootLockerUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "footlocker",
      url,
      meta: { provider: "footlocker" },
    };
  },
};

export default footlockerProvider;
