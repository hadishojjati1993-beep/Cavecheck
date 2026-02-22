// lib/marketplaces/providers/ssense.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "../types";

import {
  safeQuery,
  safeSize,
  isSafeHttpsUrl,
} from "../../vision/utils/sanitize";

/**
 * SSENSE search strategy
 *
 * SSENSE does not reliably support size filtering via URL params.
 * Best practice:
 *  - build strong semantic search query
 *  - inject size hint into query text
 *  - rely on SSENSE ranking engine
 */

function buildSsenseQuery(input: MarketplaceBuildInput): string {
  const query = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (query) parts.push(query);
  if (!query && brand) parts.push(brand);
  if (!query && !brand && product) parts.push(product);

  if (parts.length === 0) {
    parts.push("sneakers");
  }

  // Size hint improves ranking relevance
  const eu = safeSize(input.size?.eu);
  const us = safeSize(input.size?.us);
  const uk = safeSize(input.size?.uk);

  if (eu) parts.push(`EU ${eu}`);
  else if (us) parts.push(`US ${us}`);
  else if (uk) parts.push(`UK ${uk}`);

  return safeQuery(parts.join(" "), 140);
}

function buildSsenseUrl(input: MarketplaceBuildInput): string | null {
  const url = new URL("https://www.ssense.com/en-us/search");

  url.searchParams.set("q", buildSsenseQuery(input));

  const finalUrl = url.toString();

  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const ssenseProvider: MarketplaceProvider = {
  id: "ssense",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildSsenseUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "ssense",
      url,
      meta: {
        provider: "ssense",
      },
    };
  },
};

export default ssenseProvider;
