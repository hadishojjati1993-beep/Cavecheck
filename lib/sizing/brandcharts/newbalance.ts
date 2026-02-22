// newbalance.ts
// New Balance Footwear Size Guide — extracted from provided screenshots
// Canonical sizing: foot length (cm)
// Keeping only: length_cm, US (men/women/kids), UK, EU
// Ignoring width tables (Standard/Wide/etc.)

export type NewBalanceAdultSizeRow = {
  length_cm: number;       // canonical key
  us_m: number | null;     // US Men's/Unisex (null for women dataset)
  us_w: number | null;     // US Women's (null for men dataset)
  uk: number;
  eu: number;
};

export type NewBalanceKidsSizeRow = {
  length_cm: number;       // canonical key
  us_k: number;            // Kids US size (as shown in NB kids tables)
  uk: number;
  eu: number;
};

export type NewBalanceDataset =
  | {
      brand: "newbalance";
      category: "footwear";
      gender: "men" | "women";
      units: Array<"length_cm" | "us_m" | "us_w" | "uk" | "eu">;
      rows: NewBalanceAdultSizeRow[];
    }
  | {
      brand: "newbalance";
      category: "footwear";
      gender: "kids";
      units: Array<"length_cm" | "us_k" | "uk" | "eu">;
      rows: NewBalanceKidsSizeRow[];
    };

/* ----------------------------- */
/* MEN / UNISEX                  */
/* ----------------------------- */

export const NEWBALANCE_MEN: NewBalanceDataset = {
  brand: "newbalance",
  category: "footwear",
  gender: "men",
  units: ["length_cm", "us_m", "us_w", "uk", "eu"],
  rows: [
    { length_cm: 20.5, us_m: 2.5, us_w: 4,   uk: 2,   eu: 34 },
    { length_cm: 21.0, us_m: 3,   us_w: 4.5, uk: 2.5, eu: 35 },
    { length_cm: 21.5, us_m: 3.5, us_w: 5,   uk: 3,   eu: 35.5 },
    { length_cm: 22.0, us_m: 4,   us_w: 5.5, uk: 3.5, eu: 36 },
    { length_cm: 22.5, us_m: 4.5, us_w: 6,   uk: 4,   eu: 37 },
    { length_cm: 23.0, us_m: 5,   us_w: 6.5, uk: 4.5, eu: 37.5 },
    { length_cm: 23.5, us_m: 5.5, us_w: 7,   uk: 5,   eu: 38 },
    { length_cm: 24.0, us_m: 6,   us_w: 7.5, uk: 5.5, eu: 38.5 },
    { length_cm: 24.5, us_m: 6.5, us_w: 8,   uk: 6,   eu: 39.5 },
    { length_cm: 25.0, us_m: 7,   us_w: 8.5, uk: 6.5, eu: 40 },
    { length_cm: 25.5, us_m: 7.5, us_w: 9,   uk: 7,   eu: 40.5 },
    { length_cm: 26.0, us_m: 8,   us_w: 9.5, uk: 7.5, eu: 41.5 },
    { length_cm: 26.5, us_m: 8.5, us_w: 10,  uk: 8,   eu: 42 },
    { length_cm: 27.0, us_m: 9,   us_w: 10.5,uk: 8.5, eu: 42.5 },
    { length_cm: 27.5, us_m: 9.5, us_w: 11,  uk: 9,   eu: 43 },
    { length_cm: 28.0, us_m: 10,  us_w: 11.5,uk: 9.5, eu: 44 },
    { length_cm: 28.5, us_m: 10.5,us_w: 12,  uk: 10,  eu: 44.5 },
    { length_cm: 29.0, us_m: 11,  us_w: 12.5,uk: 10.5,eu: 45 },
    { length_cm: 29.5, us_m: 11.5,us_w: 13,  uk: 11,  eu: 45.5 },
    { length_cm: 30.0, us_m: 12,  us_w: 13.5,uk: 11.5,eu: 46.5 },
    { length_cm: 30.5, us_m: 12.5,us_w: 14,  uk: 12,  eu: 47 },
    { length_cm: 31.0, us_m: 13,  us_w: 14.5,uk: 12.5,eu: 47.5 },
    { length_cm: 31.5, us_m: 13.5,us_w: 15,  uk: 13,  eu: 48.5 },
    { length_cm: 32.0, us_m: 14,  us_w: 15.5,uk: 13.5,eu: 49 },
    { length_cm: 33.0, us_m: 15,  us_w: 16.5,uk: 14.5,eu: 50 },
    { length_cm: 34.0, us_m: 16,  us_w: 17.5,uk: 15.5,eu: 51 },
    { length_cm: 35.0, us_m: 17,  us_w: 18.5,uk: 16.5,eu: 52 },
    { length_cm: 36.0, us_m: 18,  us_w: 19.5,uk: 17.5,eu: 53 },
    { length_cm: 37.0, us_m: 19,  us_w: null,uk: 18.5,eu: 54 },
    { length_cm: 38.0, us_m: 20,  us_w: null,uk: 19.5,eu: 55 },
  ],
};

/* ----------------------------- */
/* WOMEN                          */
/* ----------------------------- */

export const NEWBALANCE_WOMEN: NewBalanceDataset = {
  brand: "newbalance",
  category: "footwear",
  gender: "women",
  units: ["length_cm", "us_m", "us_w", "uk", "eu"],
  rows: [
    { length_cm: 20.0, us_m: 1.5, us_w: 3,   uk: 1,   eu: 33 },
    { length_cm: 20.5, us_m: 2,   us_w: 3.5, uk: 1.5, eu: 33.5 },
    { length_cm: 21.0, us_m: 2.5, us_w: 4,   uk: 2,   eu: 34 },
    { length_cm: 21.5, us_m: 3,   us_w: 4.5, uk: 2.5, eu: 34.5 },
    { length_cm: 22.0, us_m: 3.5, us_w: 5,   uk: 3,   eu: 35 },
    { length_cm: 22.5, us_m: 4,   us_w: 5.5, uk: 3.5, eu: 36 },
    { length_cm: 23.0, us_m: 4.5, us_w: 6,   uk: 4,   eu: 36.5 },
    { length_cm: 23.5, us_m: 5,   us_w: 6.5, uk: 4.5, eu: 37 },
    { length_cm: 24.0, us_m: 5.5, us_w: 7,   uk: 5,   eu: 37.5 },
    { length_cm: 24.5, us_m: 6,   us_w: 7.5, uk: 5.5, eu: 38 },
    { length_cm: 25.0, us_m: 6.5, us_w: 8,   uk: 6,   eu: 39 },
    { length_cm: 25.5, us_m: 7,   us_w: 8.5, uk: 6.5, eu: 40 },
    { length_cm: 26.0, us_m: 7.5, us_w: 9,   uk: 7,   eu: 40.5 },
    { length_cm: 26.5, us_m: 8,   us_w: 9.5, uk: 7.5, eu: 41 },
    { length_cm: 27.0, us_m: 8.5, us_w: 10,  uk: 8,   eu: 41.5 },
    { length_cm: 27.5, us_m: 9,   us_w: 10.5,uk: 8.5, eu: 42.5 },
    { length_cm: 28.0, us_m: 9.5, us_w: 11,  uk: 9,   eu: 43 },
    { length_cm: 28.5, us_m: 10,  us_w: 11.5,uk: 9.5, eu: 43.5 },
    { length_cm: 29.0, us_m: 10.5,us_w: 12,  uk: 10,  eu: 44 },
    { length_cm: 29.5, us_m: 11,  us_w: 12.5,uk: 10.5,eu: 45 },
    { length_cm: 30.0, us_m: 11.5,us_w: 13,  uk: 11,  eu: 45.5 },
    { length_cm: 30.5, us_m: 12,  us_w: 13.5,uk: 11.5,eu: 46 },
    { length_cm: 31.0, us_m: 12.5,us_w: 14,  uk: 12,  eu: 46.5 },
    { length_cm: 32.0, us_m: 13.5,us_w: 15,  uk: 13,  eu: 48 },
    { length_cm: 32.5, us_m: 14.5,us_w: 16,  uk: 14,  eu: 49 },
  ],
};

/* ----------------------------- */
/* KIDS                            */
/* ----------------------------- */

export const NEWBALANCE_KIDS: NewBalanceDataset = {
  brand: "newbalance",
  category: "footwear",
  gender: "kids",
  units: ["length_cm", "us_k", "uk", "eu"],
  rows: [
    // Kids (1–10)
    { length_cm: 8.5,  us_k: 1,   uk: 0.5, eu: 16 },
    { length_cm: 9.0,  us_k: 1.5, uk: 1,   eu: 16.5 },
    { length_cm: 9.5,  us_k: 2,   uk: 1.5, eu: 17 },
    { length_cm: 10.0, us_k: 2.5, uk: 2,   eu: 18 },
    { length_cm: 10.0, us_k: 3,   uk: 2.5, eu: 18.5 },
    { length_cm: 10.5, us_k: 3.5, uk: 3,   eu: 19 },
    { length_cm: 11.0, us_k: 4,   uk: 3.5, eu: 20 },
    { length_cm: 11.5, us_k: 4.5, uk: 4,   eu: 20.5 },
    { length_cm: 12.0, us_k: 5,   uk: 4.5, eu: 21 },
    { length_cm: 12.0, us_k: 5.5, uk: 5,   eu: 21.5 },
    { length_cm: 12.5, us_k: 6,   uk: 5.5, eu: 22.5 },
    { length_cm: 13.0, us_k: 6.5, uk: 6,   eu: 23 },
    { length_cm: 13.5, us_k: 7,   uk: 6.5, eu: 23.5 },
    { length_cm: 14.0, us_k: 7.5, uk: 7,   eu: 24 },
    { length_cm: 14.5, us_k: 8,   uk: 7.5, eu: 25 },
    { length_cm: 15.0, us_k: 8.5, uk: 8,   eu: 25.5 },
    { length_cm: 15.0, us_k: 9,   uk: 8.5, eu: 26 },
    { length_cm: 15.5, us_k: 9.5, uk: 9,   eu: 26.5 },
    { length_cm: 16.0, us_k: 10,  uk: 9.5, eu: 27.5 },

    // Kids (10.5–13.5 + 1–3 continuation table)
    { length_cm: 16.5, us_k: 10.5, uk: 10,   eu: 28 },
    { length_cm: 17.0, us_k: 11,   uk: 10.5, eu: 28.5 },
    { length_cm: 17.5, us_k: 11.5, uk: 11,   eu: 29 },
    { length_cm: 17.5, us_k: 12,   uk: 11.5, eu: 30 },
    { length_cm: 18.0, us_k: 12.5, uk: 12,   eu: 30.5 },
    { length_cm: 18.5, us_k: 13,   uk: 12.5, eu: 31 },
    { length_cm: 19.0, us_k: 13.5, uk: 13,   eu: 32 },

    { length_cm: 19.0, us_k: 1,    uk: 13.5, eu: 32.5 },
    { length_cm: 19.5, us_k: 1.5,  uk: 1,    eu: 33 },
    { length_cm: 20.0, us_k: 2,    uk: 1.5,  eu: 33.5 },
    { length_cm: 20.5, us_k: 2.5,  uk: 2,    eu: 34.5 }, // در اسکرین‌شات UK شبیه "5" افتاده بود؛ با الگوی جدول، 2 صحیح است
    { length_cm: 21.0, us_k: 3,    uk: 2.5,  eu: 35 },

    // Big Kid 8–12 years (kids US 3.5–7)
    { length_cm: 21.5, us_k: 3.5,  uk: 3,    eu: 35.5 },
    { length_cm: 22.0, us_k: 4,    uk: 3.5,  eu: 36 },
    { length_cm: 22.5, us_k: 4.5,  uk: 4,    eu: 37 },
    { length_cm: 23.0, us_k: 5,    uk: 4.5,  eu: 37.5 },
    { length_cm: 23.5, us_k: 5.5,  uk: 5,    eu: 38 },
    { length_cm: 24.0, us_k: 6,    uk: 5.5,  eu: 38.5 },
    { length_cm: 24.5, us_k: 6.5,  uk: 6,    eu: 39 },
    { length_cm: 25.0, us_k: 7,    uk: 6.5,  eu: 40 },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const NEWBALANCE_FOOTWEAR_SIZE_GUIDE = {
  brand: "newbalance",
  category: "footwear",
  datasets: {
    men: NEWBALANCE_MEN,
    women: NEWBALANCE_WOMEN,
    kids: NEWBALANCE_KIDS,
  },
};

export default NEWBALANCE_FOOTWEAR_SIZE_GUIDE;
