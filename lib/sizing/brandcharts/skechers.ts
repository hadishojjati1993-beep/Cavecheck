// skechers.ts
// Skechers Footwear Size Guide — extracted from your provided tables
// Canonical sizing: foot length (cm)
// Only units kept: length_cm, US, UK, EU
// Note: No kids chart was provided for Skechers, so only MEN + WOMEN datasets are included.

export type SkechersSizeRow = {
  length_cm: number;       // canonical key
  us_m: number | null;     // US - Men's / Unisex
  us_w: number | null;     // US - Women's
  uk: number;
  eu: number;
};

export type SkechersDataset = {
  brand: "skechers";
  category: "footwear";
  gender: "men" | "women";
  rows: SkechersSizeRow[];
};

/* ---------------------------------- */
/* MEN (from your Skechers table)     */
/* ---------------------------------- */

export const SKECHERS_MEN: SkechersDataset = {
  brand: "skechers",
  category: "footwear",
  gender: "men",
  rows: [
    { length_cm: 23.5, us_m: 6,  us_w: null, uk: 5.5, eu: 39 },
    { length_cm: 24.1, us_m: 7,  us_w: null, uk: 6.5, eu: 40 },
    { length_cm: 24.8, us_m: 8,  us_w: null, uk: 7.5, eu: 41 },
    { length_cm: 25.4, us_m: 9,  us_w: null, uk: 8.5, eu: 42 },
    { length_cm: 26.0, us_m: 10, us_w: null, uk: 9.5, eu: 43 },
  ],
};

/* ---------------------------------- */
/* WOMEN (from your Skechers table)   */
/* ---------------------------------- */

export const SKECHERS_WOMEN: SkechersDataset = {
  brand: "skechers",
  category: "footwear",
  gender: "women",
  rows: [
    { length_cm: 21.6, us_m: null, us_w: 5, uk: 3.5, eu: 36 },
    { length_cm: 22.2, us_m: null, us_w: 6, uk: 4.5, eu: 37 },
    { length_cm: 22.9, us_m: null, us_w: 7, uk: 5.5, eu: 38 },
    { length_cm: 23.5, us_m: null, us_w: 8, uk: 6.5, eu: 39 },
    { length_cm: 24.1, us_m: null, us_w: 9, uk: 7.5, eu: 40 },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const SKECHERS_FOOTWEAR_SIZE_GUIDE = {
  brand: "skechers",
  category: "footwear",
  datasets: {
    men: SKECHERS_MEN,
    women: SKECHERS_WOMEN,
  },
};

export default SKECHERS_FOOTWEAR_SIZE_GUIDE;
