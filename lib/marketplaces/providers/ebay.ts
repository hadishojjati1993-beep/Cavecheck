// lib/marketplaces/providers/ebay.ts
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
 * eBay host is region-dependent.
 * We prefer country mapping; fallback to ebay.com.
 */
const EBAY_HOST_BY_COUNTRY: Record<string, string> = {
  US: "www.ebay.com",
  CA: "www.ebay.ca",
  GB: "www.ebay.co.uk",
  UK: "www.ebay.co.uk",
  DE: "www.ebay.de",
  FR: "www.ebay.fr",
  IT: "www.ebay.it",
  ES: "www.ebay.es",
  AU: "www.ebay.com.au",
  AT: "www.ebay.at",
  CH: "www.ebay.ch",
  NL: "www.ebay.nl",
  BE: "www.ebay.be",
  IE: "www.ebay.ie",
};

function pickHost(countryRaw: unknown): string {
  const c = safeCountry(countryRaw);
  return (c && EBAY_HOST_BY_COUNTRY[c]) ? EBAY_HOST_BY_COUNTRY[c] : "www.ebay.com";
}

function buildEbayQuery(input: MarketplaceBuildInput): string {
  const q = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (q) parts.push(q);
  if (!q && brand) parts.push(brand);
  if (!q && !brand && product) parts.push(product);

  if (parts.length === 0) parts.push("shoes");

  // Add size hint (best-effort; safe, not a filter guarantee on eBay)
  const eu = safeSize(input.size?.eu);
  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);
  const jp = safeSize(input.size?.jp);

  if (us) parts.push(`US ${us}`);
  else if (eu) parts.push(`EU ${eu}`);
  else if (uk) parts.push(`UK ${uk}`);
  else if (jp) parts.push(`JP ${jp}`);

  return safeQuery(parts.join(" "), 120);
}

function buildEbayUrl(input: MarketplaceBuildInput): string | null {
  const host = pickHost(input.country);

  // eBay search: /sch/i.html?_nkw=...
  const url = new URL(`https://${host}/sch/i.html`);

  url.searchParams.set("_nkw", buildEbayQuery(input));

  // Locale hint (optional, safe)
  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("_lang", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const ebayProvider: MarketplaceProvider = {
  id: "ebay",
  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildEbayUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "ebay",
      url,
      meta: {
        provider: "ebay",
      },
    };
  },
};

export default ebayProvider;
