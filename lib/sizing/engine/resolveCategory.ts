// lib/sizing/engine/resolveCategory.ts
import type { BrandSizing, SizeCategory } from "../brandcharts/types";

/**
 * Fallback preference order per category.
 * NOTE: Use Partial<Record<...>> so TS won't force us to define ALL SizeCategory keys.
 */
const DEFAULT_FALLBACKS: Partial<Record<SizeCategory, SizeCategory[]>> = {
  // Most common categories
  unisex: ["unisex", "men", "women", "kids"],
  men: ["men", "unisex", "women", "kids"],
  women: ["women", "unisex", "men", "kids"],
  kids: ["kids", "unisex", "men", "women"],

  // If your union includes these (safe to keep):
  adult: ["adult", "unisex", "men", "women"],
  infant: ["infant", "toddler", "kids", "unisex"],
  toddler: ["toddler", "infant", "kids", "unisex"],
  children: ["children", "kids", "youth_teens", "unisex"],
  youth_teens: ["youth_teens", "kids", "children", "unisex"],
  babies_toddlers: ["babies_toddlers", "infant", "toddler", "kids"],
};

/**
 * Resolves the best available category in a brand sizing object.
 * - preferred: what caller wants (e.g. "men")
 * - fallbacks: optional override list (per call)
 * Returns:
 * - the first category that exists AND has rows
 * - otherwise returns preferred (caller can handle "not found")
 */
export function resolveCategory(
  brand: BrandSizing,
  preferred: SizeCategory,
  fallbacks?: Partial<Record<SizeCategory, SizeCategory[]>>
): SizeCategory {
  // 1) Determine candidate order
  const order =
    fallbacks?.[preferred] ??
    DEFAULT_FALLBACKS[preferred] ??
    // final safe default if a new category gets added later:
    [preferred, "unisex", "men", "women", "kids"].filter(Boolean) as SizeCategory[];

  // 2) Pick first existing chart with data
  for (const cat of order) {
    const chart = brand.charts?.[cat];
    if (chart?.rows?.length) return cat;
  }

  // 3) Nothing found -> return preferred
  return preferred;
}