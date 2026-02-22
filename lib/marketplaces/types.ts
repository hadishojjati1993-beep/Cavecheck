// lib/marketplaces/types.ts

export type MarketplaceSize = {
  us?: string;
  uk?: string;
  eu?: string;
  jp?: string;
};

export type MarketplaceBuildInput = {
  query?: string;
  brandId?: string;
  productId?: string;

  size?: MarketplaceSize;

  locale?: string;   // e.g. "en-US"
  country?: string;  // e.g. "US"
  currency?: string; // e.g. "USD"

  [key: string]: unknown;
};

export type MarketplaceBuildOutput = {
  marketplaceId: string;
  url: string;
  meta?: Record<string, unknown>;
};

export type MarketplaceProvider = {
  id: string;
  build: (input: MarketplaceBuildInput) => MarketplaceBuildOutput | null;
};