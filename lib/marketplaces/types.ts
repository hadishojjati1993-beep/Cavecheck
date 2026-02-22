export type MarketplaceBuildInput = {
  query?: string;
  brandId?: string;
  productId?: string;

  // optional sizing info
  size?: {
    us?: string;
    uk?: string;
    eu?: string;
    jp?: string;
  };

  // optional context
  locale?: string;
  country?: string;
  currency?: string;

  // allow providers to accept extra data without breaking types
  [key: string]: unknown;
};

export type MarketplaceBuildOutput = {
  marketplaceId: string;
  url: string;
  // optional metadata
  [key: string]: unknown;
};

export type MarketplaceProvider = {
  id: string;
  build: (input: MarketplaceBuildInput) => MarketplaceBuildOutput;
};