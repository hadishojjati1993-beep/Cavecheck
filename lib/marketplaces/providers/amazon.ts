// lib/marketplaces/providers/amazon.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import {
  safeCountry,
  safeQuery,
  safeSize,
  safeLocale,
  isSafeHttpsUrl,
} from "../../vision/utils/sanitize";

/**
 * Amazon host mapping by country.
 * Keep this small and expand safely as you add regions.
 * If country is unknown, we fallback to US.
 */
const AMAZON_HOST_BY_COUNTRY: Record<string, string> = {
  US: "www.amazon.com",
  CA: "www.amazon.ca",
  GB: "www.amazon.co.uk",
  UK: "www.amazon.co.uk",
  DE: "www.amazon.de",
  FR: "www.amazon.fr",
  IT: "www.amazon.it",
  ES: "www.amazon.es",
  NL: "www.amazon.nl",
  SE: "www.amazon.se",
  PL: "www.amazon.pl",
  TR: "www.amazon.com.tr",
  AE: "www.amazon.ae",
  SA: "www.amazon.sa",
  IN: "www.amazon.in",
  JP: "www.amazon.co.jp",
  AU: "www.amazon.com.au",
  BR: "www.amazon.com.br",
  MX: "www.amazon.com.mx",
};

function pickHost(countryRaw: unknown): string {
  const c = safeCountry(countryRaw);
  if (c && AMAZON_HOST_BY_COUNTRY[c]) return AMAZON_HOST_BY_COUNTRY[c]!;
  return AMAZON_HOST_BY_COUNTRY.US!;
}

function buildAmazonQuery(input: MarketplaceBuildInput): string {
  // Sanitize defensively (even if buildUrl.ts already did)
  const q = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  // Prefer explicit query; otherwise form a minimal query from brand/product
  const parts: string[] = [];

  if (q) parts.push(q);
  if (!q && brand) parts.push(brand);
  if (!q && !brand && product) parts.push(product);

  // If nothing provided, use a safe generic keyword
  if (parts.length === 0) parts.push("shoes");

  // Add size hints (not guaranteed filter on Amazon, but improves relevance)
  const eu = safeSize(input.size?.eu);
  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);

  // Prefer region-appropriate hint, but keep it simple
  // Example: "running shoes EU 42" or "running shoes US 9"
  if (eu) parts.push(`EU ${eu}`);
  else if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);

  // Join and clamp length (safeQuery already clamps each field; this is extra safety)
  return safeQuery(parts.join(" "), 120);
}

function buildAmazonUrl(input: MarketplaceBuildInput): string | null {
  const host = pickHost(input.country);

  // Build base URL
  const url = new URL(`https://${host}/s`);

  // Query
  const query = buildAmazonQuery(input);
  url.searchParams.set("k", query);

  // Locale is not a strict requirement for Amazon search URLs,
  // but we keep it for future extensions or analytics.
  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("language", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const amazonProvider: MarketplaceProvider = {
  id: "amazon",
  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildAmazonUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "amazon",
      url,
      meta: {
        provider: "amazon",
      },
    };
  },
};

export default amazonProvider;

