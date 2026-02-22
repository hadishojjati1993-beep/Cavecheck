// lib/marketplaces/providers/adidas.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import { safeLocale, safeQuery, safeSize, isSafeHttpsUrl } from "../../vision/utils/sanitize";

/**
 * adidas: stable search entry point.
 * Regional adidas sites vary; keep URL generic and resilient.
 */
function buildAdidasQuery(input: MarketplaceBuildInput): string {
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

  // adidas often lists sizing by US/UK/EU; add a hint for relevance
  if (eu) parts.push(`EU ${eu}`);
  else if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);

  return safeQuery(parts.join(" "), 120);
}

function buildAdidasUrl(input: MarketplaceBuildInput): string | null {
  // Global adidas search endpoint
  const url = new URL("https://www.adidas.com/us/search");
  url.searchParams.set("q", buildAdidasQuery(input));

  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("locale", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const adidasProvider: MarketplaceProvider = {
  id: "adidas",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildAdidasUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "adidas",
      url,
      meta: { provider: "adidas" },
    };
  },
};

export default adidasProvider;
