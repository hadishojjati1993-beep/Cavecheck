// lib/marketplaces/types.ts

export type Gender = "men" | "women" | "unisex";

/**
 * Keep this as string to support adding/removing marketplaces without breaking the app.
 * We still provide strong typing for the build input/output.
 */
export type MarketplaceId = string;

export type MarketplaceBuildInput = {
  marketplaceId: MarketplaceId;
  query?: string;

  // Optional metadata (future-proofing)
  brandId?: string;
  gender?: Gender;

  // Internal measurement in mm (keep it even if you don't show it in UI)
  footLengthMM: number;

  // Conversion outputs (optional, but improves search accuracy)
  eu?: string;
  us?: string;
  uk?: string;
  jp?: string;

  // e.g. 2mm buffer
  bufferMM?: number;
};

export type MarketplaceBuildOutput = {
  url: string;
};

export type MarketplaceProvider = {
  id: MarketplaceId;
  build(input: MarketplaceBuildInput): MarketplaceBuildOutput;
};