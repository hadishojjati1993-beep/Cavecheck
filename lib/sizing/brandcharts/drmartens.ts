// lib/sizing/brandcharts/drmartens.ts
// Dr. Martens Footwear Size Guide
// Canonical sizing: foot length (cm)

export type DrMartensSizeRow = {
  length_cm: number;

  us_m: number | null;
  us_w: number | null;
  us_k: number | null;

  uk: number;
  eu: number;
  jp: number | null;
};

export type DrMartensDataset = {
  brand: "drmartens";
  category: "footwear";
  gender: "men" | "women" | "kids";
  rows: DrMartensSizeRow[];
};

/* -------------------------------------------------- */
/* helpers                                            */
/* -------------------------------------------------- */

const inToCm = (inch: number): number =>
  Math.round(inch * 2.54 * 100) / 100;

/* -------------------------------------------------- */
/* ADULT DATA (shared rows)                           */
/* -------------------------------------------------- */

const ADULT_ROWS: DrMartensSizeRow[] = [
  { length_cm: inToCm(9.35),  us_w: 5,  us_m: 4,  us_k: null, uk: 3,   eu: 36, jp: 22 },
  { length_cm: inToCm(9.69),  us_w: 6,  us_m: 5,  us_k: null, uk: 4,   eu: 37, jp: 23 },
  { length_cm: inToCm(10.02), us_w: 7,  us_m: 6,  us_k: null, uk: 5,   eu: 38, jp: 24 },
  { length_cm: inToCm(10.35), us_w: 8,  us_m: 7,  us_k: null, uk: 6,   eu: 39, jp: 25 },
  { length_cm: inToCm(10.35), us_w: 8.5,us_m: 7.5,us_k: null, uk: 6.5, eu: 40, jp: 25.5 },

  { length_cm: inToCm(10.69), us_w: 9,  us_m: 8,  us_k: null, uk: 7,   eu: 41, jp: 26 },
  { length_cm: inToCm(11.02), us_w: 10, us_m: 9,  us_k: null, uk: 8,   eu: 42, jp: 27 },
  { length_cm: inToCm(11.35), us_w: 11, us_m: 10, us_k: null, uk: 9,   eu: 43, jp: 28 },
  { length_cm: inToCm(11.35), us_w: 11.5,us_m:10.5,us_k:null, uk: 9.5, eu: 44, jp: 28.5 },

  { length_cm: inToCm(11.69), us_w: 12, us_m: 11, us_k: null, uk: 10,  eu: 45, jp: 29 },
  { length_cm: inToCm(12.02), us_w: 13, us_m: 12, us_k: null, uk: 11,  eu: 46, jp: 30 },
  { length_cm: inToCm(12.35), us_w: 14, us_m: 13, us_k: null, uk: 12,  eu: 47, jp: 31 },
  { length_cm: inToCm(12.68), us_w: 15, us_m: 14, us_k: null, uk: 13,  eu: 48, jp: 32 },

  { length_cm: inToCm(13.02), us_w: 16, us_m: 15, us_k: null, uk: 14,  eu: 49, jp: 33 },
  { length_cm: inToCm(13.35), us_w: 17, us_m: 16, us_k: null, uk: 15,  eu: 50, jp: 34 },
];

/* -------------------------------------------------- */
/* MEN / WOMEN DATASETS                               */
/* -------------------------------------------------- */

export const DRMARTENS_MEN: DrMartensDataset = {
  brand: "drmartens",
  category: "footwear",
  gender: "men",
  rows: ADULT_ROWS,
};

export const DRMARTENS_WOMEN: DrMartensDataset = {
  brand: "drmartens",
  category: "footwear",
  gender: "women",
  rows: ADULT_ROWS,
};

/* -------------------------------------------------- */
/* KIDS DATA                                          */
/* -------------------------------------------------- */

export const DRMARTENS_KIDS: DrMartensDataset = {
  brand: "drmartens",
  category: "footwear",
  gender: "kids",
  rows: [
    { length_cm: inToCm(3.82), us_m:null, us_w:null, us_k:1, uk:0, eu:16, jp:8 },
    { length_cm: inToCm(4.15), us_m:null, us_w:null, us_k:2, uk:1, eu:17, jp:9 },
    { length_cm: inToCm(4.49), us_m:null, us_w:null, us_k:3, uk:2, eu:18, jp:10 },
    { length_cm: inToCm(4.82), us_m:null, us_w:null, us_k:4, uk:3, eu:19, jp:11 },

    { length_cm: inToCm(5.19), us_m:null, us_w:null, us_k:5, uk:4, eu:20, jp:12 },
    { length_cm: inToCm(5.53), us_m:null, us_w:null, us_k:6, uk:5, eu:21.5, jp:12.5 },

    { length_cm: inToCm(5.86), us_m:null, us_w:null, us_k:7, uk:6, eu:23, jp:13.5 },
    { length_cm: inToCm(6.20), us_m:null, us_w:null, us_k:8, uk:7, eu:23.5, jp:14 },
    { length_cm: inToCm(6.53), us_m:null, us_w:null, us_k:9, uk:8, eu:26, jp:15 },
    { length_cm: inToCm(6.87), us_m:null, us_w:null, us_k:10, uk:9, eu:27, jp:16 },

    { length_cm: inToCm(7.20), us_m:null, us_w:null, us_k:11, uk:10, eu:28, jp:17 },
    { length_cm: inToCm(7.53), us_m:null, us_w:null, us_k:12, uk:11, eu:29, jp:18 },
    { length_cm: inToCm(7.87), us_m:null, us_w:null, us_k:13, uk:12, eu:31, jp:18.5 },

    { length_cm: inToCm(8.20), us_m:null, us_w:null, us_k:1, uk:13, eu:32, jp:19.5 },
    { length_cm: inToCm(8.54), us_m:null, us_w:null, us_k:2, uk:1, eu:33, jp:20.5 },
    { length_cm: inToCm(8.86), us_m:null, us_w:null, us_k:3, uk:2, eu:34, jp:21.5 },
    { length_cm: inToCm(9.21), us_m:null, us_w:null, us_k:4, uk:3, eu:36, jp:22 },

    { length_cm: inToCm(9.54), us_m:null, us_w:null, us_k:5, uk:4, eu:37, jp:23 },
    { length_cm: inToCm(9.88), us_m:null, us_w:null, us_k:6, uk:5, eu:38, jp:23.5 },
  ],
};

/* -------------------------------------------------- */
/* UNIFIED EXPORT                                     */
/* -------------------------------------------------- */

export const DRMARTENS_FOOTWEAR_SIZE_GUIDE = {
  brand: "drmartens" as const,
  category: "footwear" as const,
  datasets: {
    men: DRMARTENS_MEN,
    women: DRMARTENS_WOMEN,
    kids: DRMARTENS_KIDS,
  },
};

export default DRMARTENS_FOOTWEAR_SIZE_GUIDE;
