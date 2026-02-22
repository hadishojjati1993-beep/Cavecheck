// lib/marketplaces/providers/stockx.ts
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
 * StockX URL strategy
 *
 * - If productId exists: go direct to product page (best UX).
 * - Else: go to search and inject size hint into query.
 *
 * StockX does not provide stable public URL params for exact size filtering
 * across all locales. This approach is robust and avoids broken links.
 */

function buildStockXQuery(input: MarketplaceBuildInput): string {
  const query = safeQuery(input.query);
  const brand = safeQuery(input.brandId);
  const product = safeQuery(input.productId);

  const parts: string[] = [];

  if (query) parts.push(query);
  if (!query && brand) parts.push(brand);
  if (!query && !brand && product) parts.push(product);

  if (parts.length === 0) parts.push("sneakers");

  // Prefer US size hint (StockX is US-centric for sneakers),
  // fall back to EU/UK if US not available.
  const us = safeSize(input.size?.us);
  const eu = safeSize(input.size?.eu);
  const uk = safeSize(input.size?.uk);

  if (us) parts.push(`US ${us}`);
  else if (eu) parts.push(`EU ${eu}`);
  else if (uk) parts.push(`UK ${uk}`);

  return safeQuery(parts.join(" "), 140);
}

function buildStockXUrl(input: MarketplaceBuildInput): string | null {
  // If you have a real StockX product slug, you can route directly.
  // Example: https://stockx.com/nike-dunk-low-retro-white-black-2021
  const productId = safeQuery(input.productId, 120);

  if (productId) {
    // Allow only safe path chars for slug-like productId.
    const slug = productId.replace(/[^0-9a-zA-Z\-]/g, "").trim();
    if (slug) {
      const direct = `https://stockx.com/${slug}`;
      return isSafeHttpsUrl(direct) ? direct : null;
    }
  }

  // Otherwise search
  const url = new URL("https://stockx.com/search");
  url.searchParams.set("query", buildStockXQuery(input));

  const finalUrl = url.toString();
  return isSafeHttpsUrl(finalUrl) ? finalUrl : null;
}

const stockxProvider: MarketplaceProvider = {
  id: "stockx",

  build(input: MarketplaceBuildInput): MarketplaceBuildOutput | null {
    const url = buildStockXUrl(input);
    if (!url) return null;

    return {
      marketplaceId: "stockx",
      url,
      meta: {
        provider: "stockx",
      },
    };
  },
};

export default stockxProvider;
