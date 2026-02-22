// lib/sizing/brandcharts/salomon.ts
// Salomon Footwear Size Guide
// Canonical measurement: foot length (cm)
// Notes:
// - EU fractional sizes are represented as decimals (e.g., 40 2/3 => 40.6667).
// - US values are stored as numbers; the segment (men/women/kids) carries the context.
// - Kids chart in the provided tables does not include JP, so jp is optional.

export type SalomonSizeRow = {
  foot_length_cm: number;
  uk: number;
  us: number;
  eu: number;
  jp?: number;
};

export type SalomonDataset = {
  brand: "salomon";
  category: "footwear";
  segment: "men" | "women" | "kids";
  rows: SalomonSizeRow[];
};

/* ----------------------------- */
/* MEN'S FOOTWEAR (Salomon)      */
/* ----------------------------- */

export const SALOMON_MEN: SalomonDataset = {
  brand: "salomon",
  category: "footwear",
  segment: "men",
  rows: [
    { foot_length_cm: 24.5, uk: 6.5, us: 7, eu: 40, jp: 25 },
    { foot_length_cm: 25.0, uk: 7, us: 7.5, eu: 40.6667, jp: 25.5 },
    { foot_length_cm: 25.5, uk: 7.5, us: 8, eu: 41.3333, jp: 26 },
    { foot_length_cm: 26.0, uk: 8, us: 8.5, eu: 42, jp: 26.5 },
    { foot_length_cm: 26.5, uk: 8.5, us: 9, eu: 42.6667, jp: 27 },
    { foot_length_cm: 27.0, uk: 9, us: 9.5, eu: 43.3333, jp: 27.5 },
    { foot_length_cm: 27.5, uk: 9.5, us: 10, eu: 44, jp: 28 },
    { foot_length_cm: 28.0, uk: 10, us: 10.5, eu: 44.6667, jp: 28.5 },
    { foot_length_cm: 28.5, uk: 10.5, us: 11, eu: 45.3333, jp: 29 },
    { foot_length_cm: 29.0, uk: 11, us: 11.5, eu: 46, jp: 29.5 },
    { foot_length_cm: 29.5, uk: 11.5, us: 12, eu: 46.6667, jp: 30 },

    { foot_length_cm: 30.0, uk: 12, us: 12.5, eu: 47.3333, jp: 30.5 },
    { foot_length_cm: 30.5, uk: 12.5, us: 13, eu: 48, jp: 31 },
    { foot_length_cm: 31.0, uk: 13, us: 13.5, eu: 48.6667, jp: 31.5 },
    { foot_length_cm: 31.5, uk: 13.5, us: 14, eu: 49.3333, jp: 32 },
  ],
};

/* ----------------------------- */
/* WOMEN'S FOOTWEAR (Salomon)    */
/* ----------------------------- */

export const SALOMON_WOMEN: SalomonDataset = {
  brand: "salomon",
  category: "footwear",
  segment: "women",
  rows: [
    { foot_length_cm: 21.5, uk: 3.5, us: 5, eu: 36, jp: 22 },
    { foot_length_cm: 22.0, uk: 4, us: 5.5, eu: 36.6667, jp: 22.5 },
    { foot_length_cm: 22.5, uk: 4.5, us: 6, eu: 37.3333, jp: 23 },
    { foot_length_cm: 23.0, uk: 5, us: 6.5, eu: 38, jp: 23.5 },
    { foot_length_cm: 23.5, uk: 5.5, us: 7, eu: 38.6667, jp: 24 },
    { foot_length_cm: 24.0, uk: 6, us: 7.5, eu: 39.3333, jp: 24.5 },
    { foot_length_cm: 24.5, uk: 6.5, us: 8, eu: 40, jp: 25 },
    { foot_length_cm: 25.0, uk: 7, us: 8.5, eu: 40.6667, jp: 25.5 },
    { foot_length_cm: 25.5, uk: 7.5, us: 9, eu: 41.3333, jp: 26 },
    { foot_length_cm: 26.0, uk: 8, us: 9.5, eu: 42, jp: 26.5 },
    { foot_length_cm: 26.5, uk: 8.5, us: 10, eu: 42.6667, jp: 27 },

    { foot_length_cm: 27.0, uk: 9, us: 10.5, eu: 43.3333, jp: 27.5 },
    { foot_length_cm: 27.5, uk: 9.5, us: 11, eu: 44, jp: 28 },
    { foot_length_cm: 28.0, uk: 10, us: 11.5, eu: 44.6667, jp: 28.5 },
    { foot_length_cm: 28.5, uk: 10.5, us: 12, eu: 45.3333, jp: 29 },
    { foot_length_cm: 29.0, uk: 11, us: 12.5, eu: 46, jp: 29.5 },
    { foot_length_cm: 29.5, uk: 11.5, us: 13, eu: 46.6667, jp: 30 },
    { foot_length_cm: 30.0, uk: 12, us: 13.5, eu: 47.3333, jp: 30.5 },
    { foot_length_cm: 30.5, uk: 12.5, us: 14, eu: 48, jp: 31 },
    { foot_length_cm: 31.0, uk: 13, us: 14.5, eu: 48.6667, jp: 31.5 },
    { foot_length_cm: 31.5, uk: 13.5, us: 15, eu: 49.3333, jp: 32 },
    { foot_length_cm: 32.0, uk: 14, us: 15.5, eu: 50, jp: 32.5 },
    { foot_length_cm: 32.5, uk: 14.5, us: 16, eu: 50.6667, jp: 33 },
  ],
};

/* ----------------------------- */
/* KIDS' FOOTWEAR (Salomon)      */
/* ----------------------------- */

export const SALOMON_KIDS: SalomonDataset = {
  brand: "salomon",
  category: "footwear",
  segment: "kids",
  rows: [
    { foot_length_cm: 16.0, uk: 8.5, us: 9, eu: 26 },
    { foot_length_cm: 16.5, uk: 9.5, us: 10, eu: 27 },
    { foot_length_cm: 17.0, uk: 10, us: 10.5, eu: 28 },
    { foot_length_cm: 17.5, uk: 10.5, us: 11, eu: 29 },
    { foot_length_cm: 18.5, uk: 11.5, us: 12, eu: 30 },
    { foot_length_cm: 19.0, uk: 12.5, us: 13, eu: 31 },
    { foot_length_cm: 20.0, uk: 13.5, us: 1, eu: 32 },
    { foot_length_cm: 20.5, uk: 1, us: 1.5, eu: 33 },
    { foot_length_cm: 21.0, uk: 2, us: 2, eu: 34 },
    { foot_length_cm: 21.5, uk: 2.5, us: 3, eu: 35 },
    { foot_length_cm: 22.0, uk: 3.5, us: 4, eu: 36 },

    { foot_length_cm: 22.5, uk: 4, us: 5, eu: 37 },
    { foot_length_cm: 23.5, uk: 5, us: 6, eu: 38 },
    { foot_length_cm: 24.0, uk: 6, us: 7, eu: 39 },
    { foot_length_cm: 24.5, uk: 7, us: 8, eu: 40 },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export type SalomonFootwearSizeGuide = {
  brand: "salomon";
  category: "footwear";
  // index.ts expects this:
  rows: SalomonSizeRow[];
  // keep segmented datasets too:
  datasets: {
    men: SalomonDataset;
    women: SalomonDataset;
    kids: SalomonDataset;
  };
};

export const SALOMON_FOOTWEAR_SIZE_GUIDE: SalomonFootwearSizeGuide = {
  brand: "salomon",
  category: "footwear",

  // ✅ IMPORTANT: index.ts reads .rows
  // We expose a safe default "canonical" row set here (men).
  // You still keep full coverage in datasets.
  rows: [...SALOMON_MEN.rows],

  datasets: {
    men: SALOMON_MEN,
    women: SALOMON_WOMEN,
    kids: SALOMON_KIDS,
  },
};

export default SALOMON_FOOTWEAR_SIZE_GUIDE;