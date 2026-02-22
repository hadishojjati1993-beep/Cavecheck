// lib/marketplaces/providers/decathlon.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import {
  safeCountry,
  safeLocale,
  safeQuery,
  safeSize,
  isSafeHttpsUrl,
} from "../../vision/utils/sanitize";

/**
 * Decathlon uses country-specific domains.
 */
const DECATHLON_HOST_BY_COUNTRY: Record<string, string> = {
  US: "www.decathlon.com",
  CA: "www.decathlon.ca",
  GB: "www.decathlon.co.uk",
  UK: "www.decathlon.co.uk",
  FR: "www.decathlon.fr",
  DE: "www.decathlon.de",
  IT: "www.decathlon.it",
  ES: "www.decathlon.es",
  NL: "www.decathlon.nl",
  BE: "www.decathlon.be",
  PL: "www.decathlon.pl",
  SE: "www.decathlon.se",
};

function pickHost(countryRaw: unknown): string {
  const c = safeCountry(countryRaw);
  return (c && DECATHLON_HOST_BY_COUNTRY[c])
    ? DECATHLON_HOST_BY_COUNTRY[c]
    : "www.decathlon.com";
}

function buildDecathlonQuery(input: MarketplaceBuildInput): string {
  const query = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (query) parts.push(query);
  if (!query && brand) parts.push(brand);
  if (!query && !brand && product) parts.push(product);

  if (parts.length === 0) parts.push("shoes");

  // size hint (helps ranking relevance)
  const eu = safeSize(input.size?.eu);
  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);

  if (eu) parts.push(`EU ${eu}`);
  else if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);

  return safeQuery(parts.join(" "), 120);
}

function buildDecathlonUrl(input: MarketplaceBuildInput): string | null {
  const host = pickHost(input.country);

  // Decathlon search endpoint
  const url = new URL(`https://${host}/search`);

  url.searchParams.set("Ntt", buildDecathlonQuery(input));

  const locale = safeLocale(input.locale);
  if (locale) {
    url.searchParams.set("locale", locale);
  }

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const decathlonProvider: MarketplaceProvider = {
  id: "decathlon",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildDecathlonUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "decathlon",
      url,
      meta: {
        provider: "decathlon",
      },
    };
  },
};

export default decathlonProvider;
