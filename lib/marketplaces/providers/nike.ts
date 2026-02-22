// lib/marketplaces/providers/nike.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import { safeLocale, safeQuery, safeSize, isSafeHttpsUrl } from "../../vision/utils/sanitize";

/**
 * Nike: use a stable public search endpoint.
 * Nike URLs and filters vary by region; this keeps the link resilient.
 */
function buildNikeQuery(input: MarketplaceBuildInput): string {
  const query = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (query) parts.push(query);
  if (!query && brand) parts.push(brand);
  if (!query && !brand && product) parts.push(product);

  // Ensure we bias toward shoes if user didn't specify anything
  if (parts.length === 0) parts.push("shoes");

  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);
  const eu = safeSize(input.size?.eu);

  // Nike search relevance improves when size is mentioned in free text
  if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);
  else if (eu) parts.push(`EU ${eu}`);

  return safeQuery(parts.join(" "), 120);
}

function buildNikeUrl(input: MarketplaceBuildInput): string | null {
  // Global Nike search endpoint (region may redirect based on geo/cookies)
  const url = new URL("https://www.nike.com/w");
  // Nike uses "search" as a segment; the query param is "search"
  url.searchParams.set("search", buildNikeQuery(input));

  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("locale", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const nikeProvider: MarketplaceProvider = {
  id: "nike",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildNikeUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "nike",
      url,
      meta: { provider: "nike" },
    };
  },
};

export default nikeProvider;

