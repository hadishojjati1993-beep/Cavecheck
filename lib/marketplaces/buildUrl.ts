// lib/marketplaces/buildUrl.ts
import type {
  MarketplaceBuildInput,
  MarketplaceBuildOutput,
  MarketplaceProvider,
} from "./types";

import {
  safeCountry,
  safeLocale,
  safeQuery,
  safeSize,
  isSafeHttpsUrl,
} from "../vision/utils/sanitize";

import amazonProvider from "./providers/amazon";
import zalandoProvider from "./providers/zalando";
import ebayProvider from "./providers/ebay";
import asosProvider from "./providers/asos";
import zapposProvider from "./providers/zappos";
import footlockerProvider from "./providers/footlocker";
import jdsportsProvider from "./providers/jdsports";
import nikeProvider from "./providers/nike";
import adidasProvider from "./providers/adidas";
import pumaProvider from "./providers/puma";
import farfetchProvider from "./providers/farfetch";
import ssenseProvider from "./providers/ssense";
import stockxProvider from "./providers/stockx";
import goatProvider from "./providers/goat";
import moreplacesProvider from "./providers/moreplaces";

const PROVIDERS = {
  amazon: amazonProvider,
  zalando: zalandoProvider,
  ebay: ebayProvider,
  asos: asosProvider,
  zappos: zapposProvider,
  footlocker: footlockerProvider,
  jdsports: jdsportsProvider,
  nike: nikeProvider,
  adidas: adidasProvider,
  puma: pumaProvider,
  farfetch: farfetchProvider,
  ssense: ssenseProvider,
  stockx: stockxProvider,
  goat: goatProvider,
  moreplaces: moreplacesProvider,
} satisfies Record<string, MarketplaceProvider>;

export type MarketplaceId = keyof typeof PROVIDERS;
export const MARKETPLACES = Object.keys(PROVIDERS) as MarketplaceId[];

/**
 * Normalize + sanitize any MarketplaceBuildInput into a safe, predictable shape.
 * This function is intentionally defensive: it never throws.
 */
function normalizeInput(input?: MarketplaceBuildInput): MarketplaceBuildInput {
  const query = safeQuery(input?.query);
  const brandId = safeQuery(input?.brandId);
  const productId = safeQuery(input?.productId);

  const us = safeSize(input?.size?.us);
  const uk = safeSize(input?.size?.uk);
  const eu = safeSize(input?.size?.eu);
  const jp = safeSize(input?.size?.jp);

  const locale = safeLocale(input?.locale);
  const country = safeCountry(input?.country);
  const currency = safeQuery(input?.currency, 8);

  return {
    ...(input ?? {}),
    query,
    brandId,
    productId,
    size: { us, uk, eu, jp },
    locale,
    country,
    currency,
  };
}

/**
 * Provider execution wrapper:
 * - never throws
 * - enforces https-only, valid URL
 * - always returns MarketplaceBuildOutput | null
 */
function safeBuild(
  provider: MarketplaceProvider,
  input: MarketplaceBuildInput
): MarketplaceBuildOutput | null {
  try {
    const out = provider.build(input);

    const url = out?.url ? String(out.url) : "";
    if (!url || !isSafeHttpsUrl(url)) return null;

    return {
      marketplaceId: provider.id,
      url,
    };
  } catch {
    return null;
  }
}

/**
 * Supported call styles:
 * 1) buildMarketplaceUrl("amazon", input)
 * 2) buildMarketplaceUrl({ marketplaceId: "amazon", input })
 * 3) buildMarketplaceUrl({ marketplaceId: "amazon", ...inputFields })
 */
export function buildMarketplaceUrl(
  marketplaceId: string,
  input?: MarketplaceBuildInput
): MarketplaceBuildOutput | null;

export function buildMarketplaceUrl(args: {
  marketplaceId: string;
  input?: MarketplaceBuildInput;
}): MarketplaceBuildOutput | null;

export function buildMarketplaceUrl(
  args: { marketplaceId: string } & MarketplaceBuildInput
): MarketplaceBuildOutput | null;

export function buildMarketplaceUrl(
  a:
    | string
    | { marketplaceId: string; input?: MarketplaceBuildInput }
    | ({ marketplaceId: string } & MarketplaceBuildInput),
  b?: MarketplaceBuildInput
): MarketplaceBuildOutput | null {
  let marketplaceId: string;
  let rawInput: MarketplaceBuildInput | undefined;

  if (typeof a === "string") {
    marketplaceId = a;
    rawInput = b;
  } else {
    marketplaceId = a.marketplaceId;

    // If caller provided { marketplaceId, input }, prefer that.
    // Otherwise treat remaining fields as the input payload (page.tsx style).
    if (
      "input" in a &&
      (a as { input?: MarketplaceBuildInput }).input !== undefined
    ) {
      rawInput = (a as { input?: MarketplaceBuildInput }).input;
    } else {
      const { marketplaceId: _omit, ...rest } = a as {
        marketplaceId: string;
      } & MarketplaceBuildInput;
      rawInput = rest;
    }
  }

  const provider = (PROVIDERS as Record<string, MarketplaceProvider>)[
    marketplaceId
  ];
  if (!provider) return null;

  const normalized = normalizeInput(rawInput);
  return safeBuild(provider, normalized);
}

