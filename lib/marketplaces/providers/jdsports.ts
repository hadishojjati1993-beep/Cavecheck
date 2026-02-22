// lib/marketplaces/providers/jdsports.ts
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
 * JD Sports: stable search endpoint.
 * Adds size hints for relevance without relying on fragile filters.
 */
function buildJdQuery(input: MarketplaceBuildInput): string {
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

  // JD has strong UK presence; but many users search in US too.
  // Prefer US if present, else UK, else EU.
  if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);
  else if (eu) parts.push(`EU ${eu}`);

  return safeQuery(parts.join(" "), 120);
}

function buildJdUrl(input: MarketplaceBuildInput): string | null {
  const url = new URL("https://www.jdsports.com/search/");
  url.searchParams.set("q", buildJdQuery(input));

  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("locale", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const jdsportsProvider: MarketplaceProvider = {
  id: "jdsports",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildJdUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "jdsports",
      url,
      meta: { provider: "jdsports" },
    };
  },
};

export default jdsportsProvider;
