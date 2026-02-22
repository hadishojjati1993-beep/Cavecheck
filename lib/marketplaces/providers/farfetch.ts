// lib/marketplaces/providers/farfetch.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import { safeLocale, safeQuery, safeSize, isSafeHttpsUrl } from "../../vision/utils/sanitize";

/**
 * Farfetch: use stable /shopping/search endpoint with `q`.
 * Size filtering is not consistently supported via URL across regions,
 * so we add size hint into query for relevance.
 */
function buildFarfetchQuery(input: MarketplaceBuildInput): string {
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

  if (eu) parts.push(`EU ${eu}`);
  else if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);

  return safeQuery(parts.join(" "), 140);
}

function buildFarfetchUrl(input: MarketplaceBuildInput): string | null {
  const url = new URL("https://www.farfetch.com/shopping/search/items.aspx");
  url.searchParams.set("q", buildFarfetchQuery(input));

  // Locale is optional; Farfetch behavior varies, but this is safe.
  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("locale", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const farfetchProvider: MarketplaceProvider = {
  id: "farfetch",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildFarfetchUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "farfetch",
      url,
      meta: { provider: "farfetch" },
    };
  },
};

export default farfetchProvider;
