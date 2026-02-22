// lib/marketplaces/providers/asos.ts
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
 * ASOS: stable global search endpoint.
 * We keep it global to avoid fragile countryId/currency param coupling.
 * Size is included as a hint in the query to improve relevance.
 */
function buildAsosQuery(input: MarketplaceBuildInput): string {
  const query = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (query) parts.push(query);
  if (!query && brand) parts.push(brand);
  if (!query && !brand && product) parts.push(product);

  if (parts.length === 0) parts.push("shoes");

  const eu = safeSize(input.size?.eu);
  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);

  // ASOS is UK-based; UK/EU hints tend to work well
  if (uk) parts.push(`UK ${uk}`);
  else if (eu) parts.push(`EU ${eu}`);
  else if (us) parts.push(`US ${us}`);

  return safeQuery(parts.join(" "), 120);
}

function buildAsosUrl(input: MarketplaceBuildInput): string | null {
  // Use the most stable canonical domain.
  const url = new URL("https://www.asos.com/search/");

  url.searchParams.set("q", buildAsosQuery(input));

  // Optional: keep locale for analytics / future routing (non-breaking)
  const locale = safeLocale(input.locale);
  if (locale) {
    url.searchParams.set("locale", locale);
  }

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const asosProvider: MarketplaceProvider = {
  id: "asos",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildAsosUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "asos",
      url,
      meta: {
        provider: "asos",
      },
    };
  },
};

export default asosProvider;
