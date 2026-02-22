// lib/sizing/resolveSize.ts
import type { SizeRow, SizeCategory } from "./brandcharts/types";
import { getBrandSizing } from "./brandcharts";
import { STANDARD_UNISEX_CHART } from "./brandcharts/common";

export type BrandSizeResult = {
  brandId: string;
  displayName: string;
  categoryUsed: string;
  mm: number;

  us: string;
  uk: string;
  eu: string;

  jp?: string;
  is?: string;

  deltaMm: number;
};

function nearestRow(rows: SizeRow[], mm: number): { row: SizeRow; delta: number } {
  let best = rows[0]!;
  let bestD = Math.abs(best.mm - mm);

  for (const r of rows) {
    const d = Math.abs(r.mm - mm);
    if (d < bestD) {
      best = r;
      bestD = d;
    }
  }
  return { row: best, delta: bestD };
}

export function resolveSize(args: {
  footMm: number;
  brandId: string;
  category?: SizeCategory;
}): BrandSizeResult {
  const footMm = Math.round(args.footMm);
  const brandId = (args.brandId || "").toLowerCase();
  const requested = args.category ?? "unisex";

  const brand = getBrandSizing(brandId);

  // fallback: brand not found
  if (!brand) {
    const { row, delta } = nearestRow(STANDARD_UNISEX_CHART.rows, footMm);
    return {
      brandId,
      displayName: brandId,
      categoryUsed: "standard",
      mm: footMm,
      us: row.us,
      uk: row.uk,
      eu: row.eu,
      jp: row.jp,
      is: row.is,
      deltaMm: delta,
    };
  }

  const chart =
    brand.charts[requested] ??
    brand.charts.unisex ??
    Object.values(brand.charts)[0];

  if (!chart || !chart.rows?.length) {
    const { row, delta } = nearestRow(STANDARD_UNISEX_CHART.rows, footMm);
    return {
      brandId: brand.brandId,
      displayName: brand.displayName,
      categoryUsed: "standard",
      mm: footMm,
      us: row.us,
      uk: row.uk,
      eu: row.eu,
      jp: row.jp,
      is: row.is,
      deltaMm: delta,
    };
  }

  const { row, delta } = nearestRow(chart.rows, footMm);
  return {
    brandId: brand.brandId,
    displayName: brand.displayName,
    categoryUsed: requested in brand.charts ? requested : chart.label,
    mm: footMm,
    us: row.us,
    uk: row.uk,
    eu: row.eu,
    jp: row.jp,
    is: row.is,
    deltaMm: delta,
  };
}

export default resolveSize;
