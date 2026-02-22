// asics.ts
// ASICS Footwear Size Guide
// Canonical sizing: foot length (cm)
// Half sizes (H) converted to .5
// Kids uses US "K" sizing + .5 (e.g. K4H => K4.5), and numeric sizes after 1 (e.g. 1H => 1.5)

export type AsicsSizeRow = {
  length_cm: number;

  // Adult
  us_m: number | null;
  us_w: number | null;

  // Kids
  us_k: string | null; // e.g. "K4", "K4.5", "1", "1.5", "2", ...

  uk: number;
  eu: number;
};

export type AsicsDataset = {
  brand: "asics";
  category: "footwear";
  gender: "men" | "women" | "kids";
  rows: AsicsSizeRow[];
};

/* ---------------------------------- */
/* MEN / UNISEX                       */
/* ---------------------------------- */

export const ASICS_MEN: AsicsDataset = {
  brand: "asics",
  category: "footwear",
  gender: "men",
  rows: [
    { length_cm: 22.5, us_m: 4,   us_w: null, us_k: null, uk: 3,   eu: 36 },
    { length_cm: 23,   us_m: 4.5, us_w: null, us_k: null, uk: 3.5, eu: 37 },
    { length_cm: 23.5, us_m: 5,   us_w: null, us_k: null, uk: 4,   eu: 37.5 },
    { length_cm: 24,   us_m: 5.5, us_w: null, us_k: null, uk: 4.5, eu: 38 },
    { length_cm: 24.5, us_m: 6,   us_w: null, us_k: null, uk: 5,   eu: 39 },
    { length_cm: 25,   us_m: 6.5, us_w: null, us_k: null, uk: 5.5, eu: 39.5 },
    { length_cm: 25.25,us_m: 7,   us_w: null, us_k: null, uk: 6,   eu: 40 },
    { length_cm: 25.5, us_m: 7.5, us_w: null, us_k: null, uk: 6.5, eu: 40.5 },
    { length_cm: 26,   us_m: 8,   us_w: null, us_k: null, uk: 7,   eu: 41.5 },
    { length_cm: 26.5, us_m: 8.5, us_w: null, us_k: null, uk: 7.5, eu: 42 },
    { length_cm: 27,   us_m: 9,   us_w: null, us_k: null, uk: 8,   eu: 42.5 },
    { length_cm: 27.5, us_m: 9.5, us_w: null, us_k: null, uk: 8.5, eu: 43.5 },
    { length_cm: 28,   us_m: 10,  us_w: null, us_k: null, uk: 9,   eu: 44 },
    { length_cm: 28.25,us_m: 10.5,us_w: null, us_k: null, uk: 9.5, eu: 44.5 },
    { length_cm: 28.5, us_m: 11,  us_w: null, us_k: null, uk: 10,  eu: 45 },
    { length_cm: 29,   us_m: 11.5,us_w: null, us_k: null, uk: 10.5,eu: 46 },
    { length_cm: 29.5, us_m: 12,  us_w: null, us_k: null, uk: 11,  eu: 46.5 },
    { length_cm: 30,   us_m: 12.5,us_w: null, us_k: null, uk: 11.5,eu: 47 },
    { length_cm: 30.5, us_m: 13,  us_w: null, us_k: null, uk: 12,  eu: 48 },
  ],
};

/* ---------------------------------- */
/* WOMEN                              */
/* ---------------------------------- */

export const ASICS_WOMEN: AsicsDataset = {
  brand: "asics",
  category: "footwear",
  gender: "women",
  rows: [
    { length_cm: 22.5, us_m: null, us_w: 5,   us_k: null, uk: 3,   eu: 35.5 },
    { length_cm: 22.75,us_m: null, us_w: 5.5, us_k: null, uk: 3.5, eu: 36 },
    { length_cm: 23,   us_m: null, us_w: 6,   us_k: null, uk: 4,   eu: 37 },
    { length_cm: 23.5, us_m: null, us_w: 6.5, us_k: null, uk: 4.5, eu: 37.5 },
    { length_cm: 24,   us_m: null, us_w: 7,   us_k: null, uk: 5,   eu: 38 },
    { length_cm: 24.5, us_m: null, us_w: 7.5, us_k: null, uk: 5.5, eu: 39 },
    { length_cm: 25,   us_m: null, us_w: 8,   us_k: null, uk: 6,   eu: 39.5 },
    { length_cm: 25.5, us_m: null, us_w: 8.5, us_k: null, uk: 6.5, eu: 40 },
    { length_cm: 25.75,us_m: null, us_w: 9,   us_k: null, uk: 7,   eu: 40.5 },
    { length_cm: 26,   us_m: null, us_w: 9.5, us_k: null, uk: 7.5, eu: 41.5 },
    { length_cm: 26.5, us_m: null, us_w: 10,  us_k: null, uk: 8,   eu: 42 },
    { length_cm: 27,   us_m: null, us_w: 10.5,us_k: null, uk: 8.5, eu: 42.5 },
    { length_cm: 27.5, us_m: null, us_w: 11,  us_k: null, uk: 9,   eu: 43.5 },
    { length_cm: 28,   us_m: null, us_w: 11.5,us_k: null, uk: 9.5, eu: 44 },
    { length_cm: 28.5, us_m: null, us_w: 12,  us_k: null, uk: 10,  eu: 44.5 },
  ],
};

/* ---------------------------------- */
/* KIDS                               */
/* ---------------------------------- */

export const ASICS_KIDS: AsicsDataset = {
  brand: "asics",
  category: "footwear",
  gender: "kids",
  rows: [
    // cm: 12 -> 17.0
    { length_cm: 12.0,  us_m: null, us_w: null, us_k: "K4",   uk: 3,    eu: 19.5 },
    { length_cm: 12.5,  us_m: null, us_w: null, us_k: "K4.5", uk: 3.5,  eu: 20.5 },
    { length_cm: 13.0,  us_m: null, us_w: null, us_k: "K5",   uk: 4,    eu: 21 },
    { length_cm: 13.25, us_m: null, us_w: null, us_k: "K5.5", uk: 4.5,  eu: 21.5 },
    { length_cm: 13.5,  us_m: null, us_w: null, us_k: "K6",   uk: 5,    eu: 22.5 },
    { length_cm: 14.0,  us_m: null, us_w: null, us_k: "K6.5", uk: 5.5,  eu: 23 },
    { length_cm: 14.5,  us_m: null, us_w: null, us_k: "K7",   uk: 6,    eu: 23.5 },
    { length_cm: 14.75, us_m: null, us_w: null, us_k: "K7.5", uk: 6.5,  eu: 24 },
    { length_cm: 15.0,  us_m: null, us_w: null, us_k: "K8",   uk: 7,    eu: 25 },
    { length_cm: 15.5,  us_m: null, us_w: null, us_k: "K8.5", uk: 7.5,  eu: 25.5 },
    { length_cm: 16.0,  us_m: null, us_w: null, us_k: "K9",   uk: 8,    eu: 26 },
    { length_cm: 16.5,  us_m: null, us_w: null, us_k: "K9.5", uk: 8.5,  eu: 26.5 },
    { length_cm: 17.0,  us_m: null, us_w: null, us_k: "K10",  uk: 9,    eu: 27 },

    // cm: 17.25 -> 22.5
    { length_cm: 17.25, us_m: null, us_w: null, us_k: "K10.5", uk: 9.5,  eu: 28 },
    { length_cm: 17.5,  us_m: null, us_w: null, us_k: "K11",   uk: 10,   eu: 28.5 },
    { length_cm: 18.0,  us_m: null, us_w: null, us_k: "K11.5", uk: 10.5, eu: 29.5 },
    { length_cm: 18.5,  us_m: null, us_w: null, us_k: "K12",   uk: 11,   eu: 30 },
    { length_cm: 19.0,  us_m: null, us_w: null, us_k: "K12.5", uk: 11.5, eu: 30.5 },
    { length_cm: 19.5,  us_m: null, us_w: null, us_k: "K13",   uk: 12,   eu: 31.5 },
    { length_cm: 19.75, us_m: null, us_w: null, us_k: "K13.5", uk: 12.5, eu: 32 },
    { length_cm: 20.0,  us_m: null, us_w: null, us_k: "1",     uk: 13,   eu: 32.5 },
    { length_cm: 20.5,  us_m: null, us_w: null, us_k: "1.5",   uk: 13.5, eu: 33 },
    { length_cm: 21.0,  us_m: null, us_w: null, us_k: "2",     uk: 1,    eu: 33.5 },
    { length_cm: 21.5,  us_m: null, us_w: null, us_k: "2.5",   uk: 1.5,  eu: 34.5 },
    { length_cm: 22.0,  us_m: null, us_w: null, us_k: "3",     uk: 2,    eu: 35 },
    { length_cm: 22.25, us_m: null, us_w: null, us_k: "3.5",   uk: 2.5,  eu: 35.5 },
    { length_cm: 22.5,  us_m: null, us_w: null, us_k: "4",     uk: 3,    eu: 36 },

    // cm: 23.0 -> 25.5
    { length_cm: 23.0,  us_m: null, us_w: null, us_k: "4.5",   uk: 3.5,  eu: 37 },
    { length_cm: 23.5,  us_m: null, us_w: null, us_k: "5",     uk: 4,    eu: 37.5 },
    { length_cm: 24.0,  us_m: null, us_w: null, us_k: "5.5",   uk: 4.5,  eu: 38 },
    { length_cm: 24.5,  us_m: null, us_w: null, us_k: "6",     uk: 5,    eu: 39 },
    { length_cm: 25.0,  us_m: null, us_w: null, us_k: "6.5",   uk: 5.5,  eu: 39.5 },
    { length_cm: 25.5,  us_m: null, us_w: null, us_k: "7",     uk: 6,    eu: 40 },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const ASICS_FOOTWEAR_SIZE_GUIDE = {
  brand: "asics",
  category: "footwear",
  datasets: {
    men: ASICS_MEN,
    women: ASICS_WOMEN,
    kids: ASICS_KIDS,
  },
};

export default ASICS_FOOTWEAR_SIZE_GUIDE;