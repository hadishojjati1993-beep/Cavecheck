// lib/marketplaces/providers/puma.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import { safeLocale, safeQuery, safeSize, isSafeHttpsUrl } from "../../vision/utils/sanitize";

/**
 * PUMA: use a stable global search URL.
 * Sizing filters differ by region; we add size hint to query for relevance.
 */
function buildPumaQuery(input: MarketplaceBuildInput): string {
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

  if (eu) parts.push(`EU ${eu}`);
  else if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);

  return safeQuery(parts.join(" "), 120);
}

function buildPumaUrl(input: MarketplaceBuildInput): string | null {
  // PUMA US search endpoint is stable and supports q param
  const url = new URL("https://us.puma.com/us/en/search");
  url.searchParams.set("q", buildPumaQuery(input));

  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("locale", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const pumaProvider: MarketplaceProvider = {
  id: "puma",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildPumaUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "puma",
      url,
      meta: { provider: "puma" },
    };
  },
};

export default pumaProvider;
