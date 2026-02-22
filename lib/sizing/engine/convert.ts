// lib/sizing/engine/convert.ts
import type { BrandSizing, SizeCategory, SizeRow } from "../brandcharts/types";
import { resolveCategory } from "./resolveCategory";

export type ConversionResult = {
  brandId: string;
  categoryRequested: SizeCategory;
  categoryUsed: SizeCategory;
  bufferedMM: number;
  matchedRow: SizeRow;
};

function pickRowCeil(rows: SizeRow[], mm: number): SizeRow {
  const sorted = [...rows].sort((a, b) => a.mm - b.mm);

  // First row with row.mm >= mm
  for (const r of sorted) {
    if (r.mm >= mm) return r;
  }
  // If larger than max, return max
  return sorted[sorted.length - 1]!;
}

/**
 * Convert a measured foot length in mm into EU/US/UK/JP using brand charts.
 * Applies +2mm safety buffer by default.
 */
export function convertByBrand(
  brand: BrandSizing,
  category: SizeCategory,
  measuredMM: number,
  bufferMM = 2
): ConversionResult {
  const bufferedMM = Math.round(measuredMM + bufferMM);
  const categoryUsed = resolveCategory(brand, category);

  const chart = brand.charts?.[categoryUsed];
  if (!chart || !chart.rows?.length) {
    throw new Error(`No sizing chart for brand "${brand.brandId}" (${categoryUsed}).`);
  }

  const matchedRow = pickRowCeil(chart.rows, bufferedMM);

  return {
    brandId: brand.brandId,
    categoryRequested: category,
    categoryUsed,
    bufferedMM,
    matchedRow,
  };
}