// lib/marketplaces/providers/index.ts

import type { MarketplaceProvider } from "../types";
import { amazonProvider } from "./amazon";
import { zalandoProvider } from "./zalando";

export const PROVIDERS: MarketplaceProvider[] = [amazonProvider, zalandoProvider];

export function getProvider(id: string): MarketplaceProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}