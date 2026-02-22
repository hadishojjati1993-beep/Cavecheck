// puma.ts
// Puma Footwear Size Guide — extracted from provided screenshots
// Note: Chart does NOT include foot length (cm). Canonical key is EU ("FROM").
// Keeping structure consistent with New Balance: separate MEN/WOMEN/KIDS datasets + unified export.

export type PumaSizeRow = {
  eu: number;            // canonical key for Puma (since no length_cm is provided)
  uk: number;

  // adult
  us_m: number | null;
  us_w: number | null;

  // kids
  us_k: number | null;   // kids US size (numeric in the screenshot)
};

export type PumaSizeDataset = {
  brand: "puma";
  category: "footwear";
  gender: "men" | "women" | "kids";
  units: Array<"eu" | "uk" | "us_m" | "us_w" | "us_k">;
  rows: PumaSizeRow[];
};

/* ----------------------------- */
/* WOMEN SIZE CHART (EU based)   */
/* ----------------------------- */

export const PUMA_WOMEN: PumaSizeDataset = {
  brand: "puma",
  category: "footwear",
  gender: "women",
  units: ["eu", "uk", "us_m", "us_w", "us_k"],
  rows: [
    { eu: 35.5, uk: 3,   us_m: null, us_w: 5.5, us_k: null },
    { eu: 36,   uk: 3.5, us_m: null, us_w: 6,   us_k: null },
    { eu: 37,   uk: 4,   us_m: null, us_w: 6.5, us_k: null },
    { eu: 37.5, uk: 4.5, us_m: null, us_w: 7,   us_k: null },
    { eu: 38,   uk: 5,   us_m: null, us_w: 7.5, us_k: null },
    { eu: 38.5, uk: 5.5, us_m: null, us_w: 8,   us_k: null },
    { eu: 39,   uk: 6,   us_m: null, us_w: 8.5, us_k: null },
    { eu: 40,   uk: 6.5, us_m: null, us_w: 9,   us_k: null },
    { eu: 40.5, uk: 7,   us_m: null, us_w: 9.5, us_k: null },
    { eu: 41,   uk: 7.5, us_m: null, us_w: 10,  us_k: null },
    { eu: 42,   uk: 8,   us_m: null, us_w: 10.5,us_k: null },
    { eu: 42.5, uk: 8.5, us_m: null, us_w: 11,  us_k: null },
  ],
};

/* ----------------------------- */
/* MEN SIZE CHART (EU based)     */
/* ----------------------------- */

export const PUMA_MEN: PumaSizeDataset = {
  brand: "puma",
  category: "footwear",
  gender: "men",
  units: ["eu", "uk", "us_m", "us_w", "us_k"],
  rows: [
    { eu: 38,   uk: 5,   us_m: 6,   us_w: null, us_k: null },
    { eu: 38.5, uk: 5.5, us_m: 6.5, us_w: null, us_k: null },
    { eu: 39,   uk: 6,   us_m: 7,   us_w: null, us_k: null },
    { eu: 40,   uk: 6.5, us_m: 7.5, us_w: null, us_k: null },
    { eu: 40.5, uk: 7,   us_m: 8,   us_w: null, us_k: null },
    { eu: 41,   uk: 7.5, us_m: 8.5, us_w: null, us_k: null },
    { eu: 42,   uk: 8,   us_m: 9,   us_w: null, us_k: null },
    { eu: 42.5, uk: 8.5, us_m: 9.5, us_w: null, us_k: null },
    { eu: 43,   uk: 9,   us_m: 10,  us_w: null, us_k: null },
    { eu: 44,   uk: 9.5, us_m: 10.5,us_w: null, us_k: null },
    { eu: 44.5, uk: 10,  us_m: 11,  us_w: null, us_k: null },
    { eu: 45,   uk: 10.5,us_m: 11.5,us_w: null, us_k: null },
    { eu: 46,   uk: 11,  us_m: 12,  us_w: null, us_k: null },
    { eu: 46.5, uk: 11.5,us_m: 12.5,us_w: null, us_k: null },
    { eu: 47,   uk: 12,  us_m: 13,  us_w: null, us_k: null },
    { eu: 48.5, uk: 13,  us_m: 14,  us_w: null, us_k: null },
    { eu: 49.5, uk: 14,  us_m: 15,  us_w: null, us_k: null },
    { eu: 51,   uk: 15,  us_m: 16,  us_w: null, us_k: null },
  ],
};

/* ----------------------------- */
/* KIDS SIZE CHART (EU based)    */
/* from your screenshots:        */
/* - Children's shoes            */
/* - Newborns & Toddlers         */
/* keeping only EU/UK/US         */
/* ----------------------------- */

export const PUMA_KIDS: PumaSizeDataset = {
  brand: "puma",
  category: "footwear",
  gender: "kids",
  units: ["eu", "uk", "us_m", "us_w", "us_k"],
  rows: [
    // newborns & toddlers
    { eu: 18,   uk: 2,   us_m: null, us_w: null, us_k: 3 },
    { eu: 19,   uk: 3,   us_m: null, us_w: null, us_k: 4 },
    { eu: 20,   uk: 4,   us_m: null, us_w: null, us_k: 5 },
    { eu: 21,   uk: 4.5, us_m: null, us_w: null, us_k: 5.5 },
    { eu: 22,   uk: 5,   us_m: null, us_w: null, us_k: 6 },
    { eu: 23,   uk: 6,   us_m: null, us_w: null, us_k: 7 },
    { eu: 24,   uk: 7,   us_m: null, us_w: null, us_k: 8 },
    { eu: 25,   uk: 8,   us_m: null, us_w: null, us_k: 9 },
    { eu: 26,   uk: 8.5, us_m: null, us_w: null, us_k: 9.5 },

    // children's shoes
    { eu: 27,   uk: 9,   us_m: null, us_w: null, us_k: 10 },
    { eu: 27.5, uk: 9.5, us_m: null, us_w: null, us_k: 10.5 },
    { eu: 28,   uk: 10,  us_m: null, us_w: null, us_k: 11 },
    { eu: 28.5, uk: 10.5,us_m: null, us_w: null, us_k: 11.5 },
    { eu: 29,   uk: 11,  us_m: null, us_w: null, us_k: 12 },
    { eu: 30,   uk: 11.5,us_m: null, us_w: null, us_k: 12.5 },
    { eu: 31,   uk: 12,  us_m: null, us_w: null, us_k: 13 },
    { eu: 31.5, uk: 12.5,us_m: null, us_w: null, us_k: 13.5 },
    { eu: 32,   uk: 13,  us_m: null, us_w: null, us_k: 1 },
    { eu: 32.5, uk: 13.5,us_m: null, us_w: null, us_k: 1.5 },
    { eu: 33,   uk: 1,   us_m: null, us_w: null, us_k: 2 },
    { eu: 34,   uk: 1.5, us_m: null, us_w: null, us_k: 2.5 },
    { eu: 34.5, uk: 2,   us_m: null, us_w: null, us_k: 3 },
    { eu: 35,   uk: 2.5, us_m: null, us_w: null, us_k: 3.5 },
    { eu: 35.5, uk: 3,   us_m: null, us_w: null, us_k: 4 },
    { eu: 36,   uk: 3.5, us_m: null, us_w: null, us_k: 4.5 },
    { eu: 37,   uk: 4,   us_m: null, us_w: null, us_k: 5 },
    { eu: 37.5, uk: 4.5, us_m: null, us_w: null, us_k: 5.5 },
    { eu: 38,   uk: 5,   us_m: null, us_w: null, us_k: 6 },
    { eu: 38.5, uk: 5.5, us_m: null, us_w: null, us_k: 6.5 },
    { eu: 39,   uk: 6,   us_m: null, us_w: null, us_k: 7 },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const PUMA_FOOTWEAR_SIZE_GUIDE = {
  brand: "puma",
  category: "footwear",
  datasets: {
    men: PUMA_MEN,
    women: PUMA_WOMEN,
    kids: PUMA_KIDS,
  },
};

export default PUMA_FOOTWEAR_SIZE_GUIDE;