// lib/sizing/brandcharts/index.ts

import type { BrandSizing } from "../types";

import { NIKE } from "./nike";
import { ADIDAS } from "./adidas";

/**
 * Central registry of all brand sizing charts.
 * Every supported brand must be registered here.
 */
export const BRAND_REGISTRY: Record<string, BrandSizing> = {
  nike: NIKE,
  adidas: ADIDAS
};

/**
 * Returns brand sizing configuration or null.
 */
export function getBrandSizing(brandId: string): BrandSizing | null {
  return BRAND_REGISTRY[brandId] ?? null;
}

/**
 * List of supported brands.
 */
export const BRANDS: BrandSizing[] = Object.values(BRAND_REGISTRY);