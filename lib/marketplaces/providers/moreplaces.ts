// lib/marketplaces/providers/moreplaces.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import { safeQuery, safeSize } from "../../vision/utils/sanitize";

/**
 * More Places (internal route)
 * Safer than external links and allows centralized filtering + affiliate routing.
 *
 * It returns a relative URL (same-origin), which buildUrl.ts can allow
 * if you update it to accept relative URLs (recommended for internal routes).
 */

function buildInternalUrl(input: MarketplaceBuildInput): string {
  const url = new URL("/marketplaces", "https://example.invalid");

  const q = safeQuery(input.query, 140);
  if (q) url.searchParams.set("query", q);

  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);
  const eu = safeSize(input.size?.eu);
  const jp = safeSize(input.size?.jp);

  if (us) url.searchParams.set("size_us", us);
  if (uk) url.searchParams.set("size_uk", uk);
  if (eu) url.searchParams.set("size_eu", eu);
  if (jp) url.searchParams.set("size_jp", jp);

  const brandId = safeQuery(input.brandId, 60);
  if (brandId) url.searchParams.set("brand", brandId);

  const productId = safeQuery(input.productId, 80);
  if (productId) url.searchParams.set("product", productId);

  const locale = safeQuery(input.locale, 16);
  if (locale) url.searchParams.set("locale", locale);

  const country = safeQuery(input.country, 8);
  if (country) url.searchParams.set("country", country);

  const currency = safeQuery(input.currency, 8);
  if (currency) url.searchParams.set("currency", currency);

  // Add a knob you can later use in UI
  // url.searchParams.set("deals", "0");

  // Return relative path + query
  return url.pathname + (url.search ? url.search : "");
}

const morePlacesProvider: MarketplaceProvider = {
  id: "moreplaces",
  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildInternalUrl(input);
    return {
      marketplaceId: "moreplaces",
      url,
      meta: {
        provider: "internal",
      },
    };
  },
};

export default morePlacesProvider;
