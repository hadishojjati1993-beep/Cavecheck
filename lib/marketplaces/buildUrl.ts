// lib/marketplaces/buildUrl.ts

import type { MarketplaceBuildInput, MarketplaceBuildOutput } from "./types";
import { getProvider } from "./providers";

export function buildMarketplaceUrl(input: MarketplaceBuildInput): MarketplaceBuildOutput {
  const provider = getProvider(input.marketplaceId);

  // Provider exists -> build URL
  if (provider) return provider.build(input);

  // Fallback: Google query (never breaks the app)
  const q = (input.query?.trim() || "shoes").trim();
  return { url: `https://www.google.com/search?q=${encodeURIComponent(q)}` };
}
