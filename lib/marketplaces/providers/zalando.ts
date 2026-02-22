// lib/marketplaces/providers/zalando.ts
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
 * Zalando is region-specific. We map by country to a supported Zalando domain.
 * If a country is not supported, we return null (no broken links).
 */
const ZALANDO_HOST_BY_COUNTRY: Record<string, string> = {
  DE: "www.zalando.de",
  AT: "www.zalando.at",
  CH: "www.zalando.ch",
  NL: "www.zalando.nl",
  BE: "www.zalando.be",
  FR: "www.zalando.fr",
  IT: "www.zalando.it",
  ES: "www.zalando.es",
  SE: "www.zalando.se",
  NO: "www.zalando.no",
  DK: "www.zalando.dk",
  FI: "www.zalando.fi",
  PL: "www.zalando.pl",
  CZ: "www.zalando.cz",
  SK: "www.zalando.sk",
  RO: "www.zalando.ro",
  HU: "www.zalando.hu",
  IE: "www.zalando.ie",
  GB: "www.zalando.co.uk",
  UK: "www.zalando.co.uk",
};

function pickHost(countryRaw: unknown): string | null {
  const c = safeCountry(countryRaw);
  if (!c) return null;
  return ZALANDO_HOST_BY_COUNTRY[c] ?? null;
}

/**
 * Zalando generally works best with EU sizing for footwear.
 * We embed size as a query hint (safe), and keep URL construction strict.
 */
function buildZalandoQuery(input: MarketplaceBuildInput): string {
  const q = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (q) parts.push(q);
  if (!q && brand) parts.push(brand);
  if (!q && !brand && product) parts.push(product);

  if (parts.length === 0) parts.push("shoes");

  // Prefer EU size for Zalando relevance
  const eu = safeSize(input.size?.eu);
  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);

  if (eu) parts.push(`EU ${eu}`);
  else if (uk) parts.push(`UK ${uk}`);
  else if (us) parts.push(`US ${us}`);

  return safeQuery(parts.join(" "), 120);
}

function buildZalandoUrl(input: MarketplaceBuildInput): string | null {
  const host = pickHost(input.country);
  if (!host) return null;

  // Zalando search path is stable:
  // https://www.zalando.de/katalog/?q=...
  const url = new URL(`https://${host}/katalog/`);

  const query = buildZalandoQuery(input);
  url.searchParams.set("q", query);

  // Locale hint (not always used by Zalando, but safe for future)
  const locale = safeLocale(input.locale);
  if (locale) url.searchParams.set("lang", locale);

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const zalandoProvider: MarketplaceProvider = {
  id: "zalando",
  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildZalandoUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "zalando",
      url,
      meta: {
        provider: "zalando",
      },
    };
  },
};

export default zalandoProvider;