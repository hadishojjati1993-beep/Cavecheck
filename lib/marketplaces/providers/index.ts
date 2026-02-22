// lib/marketplaces/providers/index.ts

import type { MarketplaceProvider } from "../types";

import amazonProvider from "./amazon";
import zalandoProvider from "./zalando";
import ebayProvider from "./ebay";
import decathlonProvider from "./decathlon";
import asosProvider from "./asos";
import zapposProvider from "./zappos";
import footlockerProvider from "./footlocker";
import jdSportsProvider from "./jdsports";
import nikeProvider from "./nike";
import adidasProvider from "./adidas";
import pumaProvider from "./puma";
import farfetchProvider from "./farfetch";
import ssenseProvider from "./ssense";
import stockxProvider from "./stockx";
import goatProvider from "./goat";
import moreplacesProvider from "./moreplaces";

/**
 * Central provider registry.
 * Single source of truth for all marketplaces.
 *
 * IMPORTANT:
 * - keys MUST match provider.id
 * - buildUrl.ts depends on this map
 */
export const PROVIDERS: Record<string, MarketplaceProvider> = {
  amazon: amazonProvider,
  zalando: zalandoProvider,
  ebay: ebayProvider,
  decathlon: decathlonProvider,
  asos: asosProvider,
  zappos: zapposProvider,
  footlocker: footlockerProvider,
  jdsports: jdSportsProvider,
  nike: nikeProvider,
  adidas: adidasProvider,
  puma: pumaProvider,
  farfetch: farfetchProvider,
  ssense: ssenseProvider,
  stockx: stockxProvider,
  goat: goatProvider,
  moreplaces: moreplacesProvider,
};

export type MarketplaceId = keyof typeof PROVIDERS;

export const MARKETPLACES = Object.keys(PROVIDERS) as MarketplaceId[];
