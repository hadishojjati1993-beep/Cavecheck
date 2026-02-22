// lib/marketplaces/providers/goat.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import { safeQuery, safeSize, isSafeHttpsUrl } from "../../vision/utils/sanitize";

/**
 * GOAT URL strategy
 *
 * - If productId exists: go direct to product page (best UX).
 * - Else: go to search and inject size hint into query.
 *
 * GOAT does not provide stable, documented URL params for exact size filtering
 * across all locales. This approach is robust and avoids broken links.
 */

function buildGoatQuery(input: MarketplaceBuildInput): string {
  const query = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (query) parts.push(query);
  if (!query && brand) parts.push(brand);
  if (!query && !brand && product) parts.push(product);

  if (parts.length === 0) parts.push("sneakers");

  // GOAT users typically think in US sizing. Use US if available.
  const us = safeSize(input.size?.us);
  const eu = safeSize(input.size?.eu);
  const uk = safeSize(input.size?.uk);

  if (us) parts.push(`US ${us}`);
  else if (eu) parts.push(`EU ${eu}`);
  else if (uk) parts.push(`UK ${uk}`);

  return safeQuery(parts.join(" "), 140);
}

function buildGoatUrl(input: MarketplaceBuildInput): string | null {
  const productId = safeQuery(input.productId, 140);

  // If you store a GOAT product slug, route directly:
  // Example: https://www.goat.com/sneakers/air-jordan-1-retro-high-og-dark-mocha-555088-105
  if (productId) {
    // Allow safe slug characters only
    const slug = productId.replace(/[^0-9a-zA-Z\-]/g, "").trim();
    if (slug) {
      const direct = `https://www.goat.com/sneakers/${slug}`;
      return isSafeHttpsUrl(direct) ? direct : null;
    }
  }

  // Search fallback
  const url = new URL("https://www.goat.com/search");
  url.searchParams.set("query", buildGoatQuery(input));

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const goatProvider: MarketplaceProvider = {
  id: "goat",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildGoatUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "goat",
      url,
      meta: {
        provider: "goat",
      },
    };
  },
};

export default goatProvider;
