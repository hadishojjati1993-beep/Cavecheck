// lib/sizing/brandcharts/timberland.ts

// Force this file to be treated as an ES module.
export {};

export type FootwearSizeRow = {
  length_cm: number;
  us: number;
  uk: number;
  eu: number;
  jp?: number;
};

export type TimberlandSegment = "men" | "women" | "infant" | "toddler";

export type TimberlandDataset = {
  brand: "timberland";
  category: "footwear";
  segment: TimberlandSegment;
  rows: FootwearSizeRow[];
};

/**
 * NOTE:
 * These datasets are intentionally plain data (no functions) to keep them safe,
 * tree-shakeable, and deterministic for production usage.
 */

/* ----------------------------- */
/* MEN */
/* ----------------------------- */

export const TIMBERLAND_MEN: TimberlandDataset = {
  brand: "timberland",
  category: "footwear",
  segment: "men",
  rows: [
    { length_cm: 24.5, us: 7, uk: 6.5, eu: 40 },
    { length_cm: 25.0, us: 7.5, uk: 7, eu: 40.5 },
    { length_cm: 25.5, us: 8, uk: 7.5, eu: 41 },
    { length_cm: 26.0, us: 8.5, uk: 8, eu: 42 },
    { length_cm: 26.5, us: 9, uk: 8.5, eu: 42.5 },
    { length_cm: 27.0, us: 9.5, uk: 9, eu: 43 },
    { length_cm: 27.5, us: 10, uk: 9.5, eu: 44 },
    { length_cm: 28.0, us: 10.5, uk: 10, eu: 44.5 },
    { length_cm: 28.5, us: 11, uk: 10.5, eu: 45 },
    { length_cm: 29.0, us: 11.5, uk: 11, eu: 46 },
    { length_cm: 29.5, us: 12, uk: 11.5, eu: 46.5 },
    { length_cm: 30.0, us: 12.5, uk: 12, eu: 47 },
  ],
};

/* ----------------------------- */
/* WOMEN */
/* ----------------------------- */

export const TIMBERLAND_WOMEN: TimberlandDataset = {
  brand: "timberland",
  category: "footwear",
  segment: "women",
  rows: [
    { length_cm: 22.0, us: 5, uk: 2.5, eu: 35 },
    { length_cm: 22.5, us: 5.5, uk: 3, eu: 35.5 },
    { length_cm: 23.0, us: 6, uk: 3.5, eu: 36 },
    { length_cm: 23.5, us: 6.5, uk: 4, eu: 37 },
    { length_cm: 24.0, us: 7, uk: 4.5, eu: 37.5 },
    { length_cm: 24.5, us: 7.5, uk: 5, eu: 38 },
    { length_cm: 25.0, us: 8, uk: 5.5, eu: 39 },
    { length_cm: 25.5, us: 8.5, uk: 6, eu: 39.5 },
    { length_cm: 26.0, us: 9, uk: 6.5, eu: 40 },
    { length_cm: 26.5, us: 9.5, uk: 7, eu: 41 },
    { length_cm: 27.0, us: 10, uk: 7.5, eu: 41.5 },
  ],
};

/* ----------------------------- */
/* INFANT */
/* ----------------------------- */

export const TIMBERLAND_INFANT: TimberlandDataset = {
  brand: "timberland",
  category: "footwear",
  segment: "infant",
  rows: [
    { length_cm: 9.5, us: 1, uk: 0.5, eu: 16 },
    { length_cm: 10.0, us: 1.5, uk: 1, eu: 16.5 },
    { length_cm: 10.5, us: 2, uk: 1.5, eu: 17 },
    { length_cm: 11.0, us: 2.5, uk: 2, eu: 18 },
    { length_cm: 11.5, us: 3, uk: 2.5, eu: 18.5 },
    { length_cm: 12.0, us: 3.5, uk: 3, eu: 19 },
    { length_cm: 12.5, us: 4, uk: 3.5, eu: 20 },
  ],
};

/* ----------------------------- */
/* TODDLER (Your provided dataset) */
/* ----------------------------- */

export const TIMBERLAND_TODDLER: TimberlandDataset = {
  brand: "timberland",
  category: "footwear",
  segment: "toddler",
  rows: [
    { length_cm: 12.0, us: 4, uk: 3.5, eu: 20 },
    { length_cm: 12.0, us: 4.5, uk: 4, eu: 20.5 },
    { length_cm: 12.5, us: 5, uk: 4.5, eu: 21 },
    { length_cm: 13.0, us: 5.5, uk: 5, eu: 22 },
    { length_cm: 13.5, us: 6, uk: 5.5, eu: 22.5 },
    { length_cm: 14.0, us: 6.5, uk: 6, eu: 23 },
    { length_cm: 14.0, us: 7, uk: 6.5, eu: 23.5 },
    { length_cm: 14.5, us: 7.5, uk: 7, eu: 24 },
    { length_cm: 15.0, us: 8, uk: 7.5, eu: 25 },
    { length_cm: 15.5, us: 8.5, uk: 8, eu: 25.5 },
    { length_cm: 16.0, us: 9, uk: 8.5, eu: 26 },
    { length_cm: 16.5, us: 9.5, uk: 9, eu: 26.5 },
    { length_cm: 16.5, us: 10, uk: 9.5, eu: 27 },
    { length_cm: 17.0, us: 10.5, uk: 10, eu: 28 },
    { length_cm: 17.5, us: 11, uk: 10.5, eu: 28.5 },
    { length_cm: 18.0, us: 11.5, uk: 11, eu: 29 },
    { length_cm: 18.5, us: 12, uk: 11.5, eu: 30 },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const TIMBERLAND_FOOTWEAR_SIZE_GUIDE = {
  brand: "timberland",
  category: "footwear",
  datasets: {
    men: TIMBERLAND_MEN,
    women: TIMBERLAND_WOMEN,
    infant: TIMBERLAND_INFANT,
    toddler: TIMBERLAND_TODDLER,
  },
} as const;

export default TIMBERLAND_FOOTWEAR_SIZE_GUIDE;
