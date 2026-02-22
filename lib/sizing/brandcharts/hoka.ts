// hoka.ts
// HOKA Footwear Size Guide
// Canonical sizing: foot length (cm)
// Source: Official HOKA sizing charts (Women / Men / Kids)
// NOTE:
// - Canonical key = foot length (cm)
// - resolveSize.ts later converts mm scan → cm → brand sizing
// - EU fractional sizes converted to decimals

export type HokaSizeRow = {
  length_cm: number;      // canonical measurement
  us_m: number | null;
  us_w: number | null;
  us_y: number | null;    // youth / kids
  uk: number | null;
  eu: number | null;
};

export type HokaDataset = {
  brand: "hoka";
  category: "footwear";
  gender: "men" | "women" | "kids";
  rows: HokaSizeRow[];
};

/* ---------------------------------- */
/* WOMEN                              */
/* ---------------------------------- */

export const HOKA_WOMEN: HokaDataset = {
  brand: "hoka",
  category: "footwear",
  gender: "women",
  rows: [
    { length_cm: 22.0, us_m: null, us_w: 5,   us_y: null, uk: 3.5, eu: 36 },
    { length_cm: 22.4, us_m: null, us_w: 5.5, us_y: null, uk: 4,   eu: 36.6667 },
    { length_cm: 22.9, us_m: null, us_w: 6,   us_y: null, uk: 4.5, eu: 37.3333 },
    { length_cm: 23.3, us_m: null, us_w: 6.5, us_y: null, uk: 5,   eu: 38 },
    { length_cm: 23.7, us_m: null, us_w: 7,   us_y: null, uk: 5.5, eu: 38.6667 },
    { length_cm: 24.1, us_m: null, us_w: 7.5, us_y: null, uk: 6,   eu: 39.3333 },
    { length_cm: 24.5, us_m: null, us_w: 8,   us_y: null, uk: 6.5, eu: 40 },
    { length_cm: 25.0, us_m: null, us_w: 8.5, us_y: null, uk: 7,   eu: 40.6667 },
    { length_cm: 25.4, us_m: null, us_w: 9,   us_y: null, uk: 7.5, eu: 41.3333 },
    { length_cm: 25.8, us_m: null, us_w: 9.5, us_y: null, uk: 8,   eu: 42 },
    { length_cm: 26.2, us_m: null, us_w: 10,  us_y: null, uk: 8.5, eu: 42.6667 },
    { length_cm: 26.7, us_m: null, us_w: 10.5,us_y: null, uk: 9,   eu: 43.3333 },
    { length_cm: 27.1, us_m: null, us_w: 11,  us_y: null, uk: 9.5, eu: 44 },
    { length_cm: 27.5, us_m: null, us_w: 11.5,us_y: null, uk: 10,  eu: 44.6667 },
    { length_cm: 27.9, us_m: null, us_w: 12,  us_y: null, uk: 10.5,eu: 45.3333 },
  ],
};

/* ---------------------------------- */
/* MEN                                */
/* ---------------------------------- */

export const HOKA_MEN: HokaDataset = {
  brand: "hoka",
  category: "footwear",
  gender: "men",
  rows: [
    { length_cm: 23.0, us_m: 5,   us_w: null, us_y: null, uk: 4.5, eu: 37.3333 },
    { length_cm: 23.4, us_m: 5.5, us_w: null, us_y: null, uk: 5,   eu: 38 },
    { length_cm: 23.9, us_m: 6,   us_w: null, us_y: null, uk: 5.5, eu: 38.6667 },
    { length_cm: 24.3, us_m: 6.5, us_w: null, us_y: null, uk: 6,   eu: 39.3333 },
    { length_cm: 24.7, us_m: 7,   us_w: null, us_y: null, uk: 6.5, eu: 40 },
    { length_cm: 25.1, us_m: 7.5, us_w: null, us_y: null, uk: 7,   eu: 40.6667 },
    { length_cm: 25.6, us_m: 8,   us_w: null, us_y: null, uk: 7.5, eu: 41.3333 },
    { length_cm: 26.0, us_m: 8.5, us_w: null, us_y: null, uk: 8,   eu: 42 },
    { length_cm: 26.4, us_m: 9,   us_w: null, us_y: null, uk: 8.5, eu: 42.6667 },
    { length_cm: 26.8, us_m: 9.5, us_w: null, us_y: null, uk: 9,   eu: 43.3333 },
    { length_cm: 27.2, us_m: 10,  us_w: null, us_y: null, uk: 9.5, eu: 44 },
    { length_cm: 27.7, us_m: 10.5,us_w: null, us_y: null, uk: 10,  eu: 44.6667 },
    { length_cm: 28.1, us_m: 11,  us_w: null, us_y: null, uk: 10.5,eu: 45.3333 },
    { length_cm: 28.5, us_m: 11.5,us_w: null, us_y: null, uk: 11,  eu: 46 },
    { length_cm: 28.9, us_m: 12,  us_w: null, us_y: null, uk: 11.5,eu: 46.6667 },
  ],
};

/* ---------------------------------- */
/* KIDS / YOUTH                       */
/* ---------------------------------- */

export const HOKA_KIDS: HokaDataset = {
  brand: "hoka",
  category: "footwear",
  gender: "kids",
  rows: [
    { length_cm: 22.0, us_m: null, us_w: null, us_y: 3.5, uk: null, eu: null },
    { length_cm: 22.5, us_m: null, us_w: null, us_y: 4,   uk: null, eu: null },
    { length_cm: 23.0, us_m: null, us_w: null, us_y: 4.5, uk: null, eu: null },
    { length_cm: 23.5, us_m: null, us_w: null, us_y: 5,   uk: null, eu: null },
    { length_cm: 24.0, us_m: null, us_w: null, us_y: 5.5, uk: null, eu: null },
    { length_cm: 24.5, us_m: null, us_w: null, us_y: 6,   uk: null, eu: null },
    { length_cm: 25.0, us_m: null, us_w: null, us_y: 6.5, uk: null, eu: null },
    { length_cm: 25.5, us_m: null, us_w: null, us_y: 7,   uk: null, eu: null },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT                     */
/* ---------------------------------- */

export const HOKA_FOOTWEAR_SIZE_GUIDE = {
  brand: "hoka",
  category: "footwear",
  datasets: {
    men: HOKA_MEN,
    women: HOKA_WOMEN,
    kids: HOKA_KIDS,
  },
};

export default HOKA_FOOTWEAR_SIZE_GUIDE;
