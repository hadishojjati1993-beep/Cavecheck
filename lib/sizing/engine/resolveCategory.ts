// lib/sizing/engine/resolveCategory.ts
import type { BrandSizing, SizeCategory } from "../types";

const DEFAULT_FALLBACKS: Record<SizeCategory, SizeCategory[]> = {
  unisex: ["unisex", "men", "women"],
  men: ["men", "unisex", "women"],
  women: ["women", "unisex", "men"],
  kids: ["kids", "unisex", "men", "women"],
};

export function resolveCategory(
  brand: BrandSizing,
  preferred: SizeCategory,
  fallbacks: Partial<Record<SizeCategory, SizeCategory[]>> = {}
): SizeCategory {
  const order = fallbacks[preferred] ?? DEFAULT_FALLBACKS[preferred];

  for (const cat of order) {
    const chart = brand.charts?.[cat];
    if (chart && chart.rows && chart.rows.length > 0) return cat;
  }

  // If nothing exists, return preferred (caller can fall back to generic brand)
  return preferred;
}