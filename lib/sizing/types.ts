// lib/sizing/types.ts

/**
 * Shoe size category selected in UI.
 * - men / women / unisex are your primary needs
 * - kids is kept for future (optional)
 */
export type SizeCategory = "men" | "women" | "unisex" | "kids";

/**
 * A single sizing row (one "step" in a brand chart).
 * mm is the "reference" measurement (typically foot length in mm).
 *
 * NOTE:
 * - Some brands provide JP in cm; we store JP as string (e.g. "26.5")
 * - US/UK/EU are strings because brands sometimes use half sizes ("9.5")
 */
export type SizeRow = {
  mm: number;
  eu: string;
  us: string;
  uk: string;
  jp: string;
};

/**
 * A chart is a list of rows for a specific category (men/women/unisex).
 * You can optionally attach metadata for auditing/debugging.
 */
export type BrandChart = {
  /**
   * Human label for the chart (optional).
   * Example: "Nike Men", "Adidas Women", ...
   */
  label?: string;

  /**
   * Row data sorted or unsorted (engine will sort internally).
   */
  rows: SizeRow[];

  /**
   * Optional:
   * If a brand chart is known to use a different base measurement,
   * you can annotate it here for future (e.g. "cm" or "mm").
   */
  unit?: "mm" | "cm";

  /**
   * Optional:
   * Source info for traceability (URL, doc name, etc.)
   * You can keep it empty until you populate charts.
   */
  source?: {
    name?: string; // e.g. "Nike size guide"
    url?: string;
    updatedAt?: string; // ISO string if you want
  };
};

/**
 * A brand can have charts per category.
 * Some brands might only have unisex or only men/women.
 * The engine resolves a best available chart via resolveCategory().
 */
export type BrandSizing = {
  /**
   * Internal id for the brand (used in code + mappings).
   * Examples: "nike", "adidas", "puma", "asics", "converse", "generic"
   */
  brandId: string;

  /**
   * Display name (optional but useful for UI/admin).
   */
  displayName?: string;

  /**
   * Charts by category.
   * Missing categories are allowed (fallback logic will handle it).
   */
  charts: Partial<Record<SizeCategory, BrandChart>>;

  /**
   * Optional notes for you / admin use.
   */
  notes?: string;
};

/**
 * Output shape you already use in the UI.
 * IMPORTANT:
 * - mm is required (internal only), even if you hide it in UI.
 * - you asked: do NOT show mm to user; that's a UI concern (SizeChips).
 */
export type FootSizes = {
  mm: number;
  eu: string;
  us: string;
  uk: string;
  jp: string;
};

/**
 * (Optional, but helpful) Measurement returned by the vision pipeline.
 * You said: length + width, with +2mm buffer always considered.
 *
 * - lengthMM: raw measured foot length (mm)
 * - widthMM: raw measured foot width (mm)
 * - lengthMMBuffered/widthMMBuffered: after applying safety buffer
 */
export type FootMeasurement = {
  lengthMM: number;
  widthMM: number;
  bufferMM: number; // e.g. 2
  lengthMMBuffered: number;
  widthMMBuffered: number;
};

/**
 * (Optional, but helpful) Full scan result returned by your pipeline.
 * This is future-proof and keeps the door open for storing the scan data.
 */
export type ScanResult = {
  brandId: string;
  categoryRequested: SizeCategory;
  categoryUsed: SizeCategory;

  measurement: FootMeasurement;

  sizes: FootSizes;

  /**
   * Debug + analytics (optional)
   */
  debug?: {
    confidence?: number; // 0..1 if you compute
    warnings?: string[];
  };
};
