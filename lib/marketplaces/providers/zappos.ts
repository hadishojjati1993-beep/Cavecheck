// lib/marketplaces/providers/zappos.ts
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
 * Zappos: stable search endpoint.
 * We include size hints in the query to improve relevance.
 */
function buildZapposQuery(input: MarketplaceBuildInput): string {
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

  // Zappos is US-focused; US hint is usually best
  if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);
  else if (eu) parts.push(`EU ${eu}`);

  return safeQuery(parts.join(" "), 120);
}

function buildZapposUrl(input: MarketplaceBuildInput): string | null {
  const url = new URL("https://www.zappos.com/search");
  url.searchParams.set("q", buildZapposQuery(input));

  // Optional - not required by Zappos, but harmless metadata for future routing/analytics
  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("locale", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const zapposProvider: MarketplaceProvider = {
  id: "zappos",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildZapposUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "zappos",
      url,
      meta: {
        provider: "zappos",
      },
    };
  },
};

export default zapposProvider;
