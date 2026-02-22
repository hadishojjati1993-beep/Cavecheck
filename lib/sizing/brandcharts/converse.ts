// converse.ts
// Converse Footwear Size Guide
// Canonical sizing: foot length (cm)

export type ConverseSizeRow = {
  length_cm: number;

  // adult sizing
  us_m: number | null;
  us_w: number | null;

  // kids sizing
  us_k: string | null; // 10C, 1Y, 5Y ...

  uk: number;
  eu: number;
};

export type ConverseSizeGuide = {
  brand: "converse";
  category: "footwear";
  genders: Array<"men" | "women" | "unisex" | "kids">;
  units: Array<"length_cm" | "us_m" | "us_w" | "us_k" | "uk" | "eu">;
  rows: ConverseSizeRow[];
};

export const CONVERSE_FOOTWEAR_SIZE_GUIDE: ConverseSizeGuide = {
  brand: "converse",
  category: "footwear",
  genders: ["men", "women", "unisex", "kids"],
  units: ["length_cm", "us_m", "us_w", "us_k", "uk", "eu"],

  rows: [
    /* ===================================== */
    /* ADULT                                */
    /* ===================================== */

    { length_cm: 22,   us_m: 3,   us_w: 5,   us_k: null, uk: 3,   eu: 35 },
    { length_cm: 22.5, us_m: 3.5, us_w: 5.5, us_k: null, uk: 3.5, eu: 36 },
    { length_cm: 23,   us_m: 4,   us_w: 6,   us_k: null, uk: 4,   eu: 36.5 },
    { length_cm: 23.5, us_m: 4.5, us_w: 6.5, us_k: null, uk: 4.5, eu: 37 },
    { length_cm: 24,   us_m: 5,   us_w: 7,   us_k: null, uk: 5,   eu: 37.5 },
    { length_cm: 24.5, us_m: 5.5, us_w: 7.5, us_k: null, uk: 5.5, eu: 38 },
    { length_cm: 25,   us_m: 6,   us_w: 8,   us_k: null, uk: 6,   eu: 39 },
    { length_cm: 25.5, us_m: 6.5, us_w: 8.5, us_k: null, uk: 6.5, eu: 39.5 },
    { length_cm: 26,   us_m: 7,   us_w: 9,   us_k: null, uk: 7,   eu: 40 },
    { length_cm: 26.5, us_m: 7.5, us_w: 9.5, us_k: null, uk: 7.5, eu: 41 },
    { length_cm: 27,   us_m: 8,   us_w: 10,  us_k: null, uk: 8,   eu: 41.5 },
    { length_cm: 27.5, us_m: 8.5, us_w: 10.5,us_k: null, uk: 8.5, eu: 42 },
    { length_cm: 28,   us_m: 9,   us_w: 11,  us_k: null, uk: 9,   eu: 42.5 },
    { length_cm: 28.5, us_m: 9.5, us_w: 11.5,us_k: null, uk: 9.5, eu: 43 },
    { length_cm: 29,   us_m: 10,  us_w: 12,  us_k: null, uk: 10,  eu: 44 },
    { length_cm: 29.5, us_m: 10.5,us_w: 12.5,us_k: null, uk: 10.5,eu: 44.5 },
    { length_cm: 30,   us_m: 11,  us_w: 13,  us_k: null, uk: 11,  eu: 45 },
    { length_cm: 30.5, us_m: 11.5,us_w: 13.5,us_k: null, uk: 11.5,eu: 46 },
    { length_cm: 31.5, us_m: 13,  us_w: 15,  us_k: null, uk: 13,  eu: 48 },
    { length_cm: 32,   us_m: 14,  us_w: 16,  us_k: null, uk: 14,  eu: 49 },
    { length_cm: 33,   us_m: 15,  us_w: 17,  us_k: null, uk: 15,  eu: 50 },

    /* ===================================== */
    /* KIDS (from Converse Kids chart)       */
    /* ===================================== */

    { length_cm: 16.9, us_m: null, us_w: null, us_k: "10C",   uk: 9.5, eu: 27 },
    { length_cm: 17.3, us_m: null, us_w: null, us_k: "10.5C", uk: 10,  eu: 27.5 },
    { length_cm: 17.7, us_m: null, us_w: null, us_k: "11C",   uk: 10.5, eu: 28 },
    { length_cm: 18.2, us_m: null, us_w: null, us_k: "11.5C", uk: 11,  eu: 29 },
    { length_cm: 18.6, us_m: null, us_w: null, us_k: "12C",   uk: 11.5, eu: 29.5 },
    { length_cm: 19.0, us_m: null, us_w: null, us_k: "12.5C", uk: 12,  eu: 30 },
    { length_cm: 19.4, us_m: null, us_w: null, us_k: "13C",   uk: 12.5, eu: 30.5 },
    { length_cm: 19.8, us_m: null, us_w: null, us_k: "13.5C", uk: 13,  eu: 31 },
    { length_cm: 20.3, us_m: null, us_w: null, us_k: "1Y",    uk: 13.5, eu: 31.5 },
    { length_cm: 20.7, us_m: null, us_w: null, us_k: "1.5Y",  uk: 1,   eu: 32 },
    { length_cm: 21.1, us_m: null, us_w: null, us_k: "2Y",    uk: 1.5, eu: 32.5 },
    { length_cm: 21.5, us_m: null, us_w: null, us_k: "2.5Y",  uk: 2,   eu: 33 },
    { length_cm: 22.0, us_m: null, us_w: null, us_k: "3Y",    uk: 2.5, eu: 34 },
    { length_cm: 22.4, us_m: null, us_w: null, us_k: "3.5Y",  uk: 3,   eu: 35 },
    { length_cm: 22.8, us_m: null, us_w: null, us_k: "4Y",    uk: 3.5, eu: 36 },
    { length_cm: 23.2, us_m: null, us_w: null, us_k: "4.5Y",  uk: 4,   eu: 37 },
    { length_cm: 23.6, us_m: null, us_w: null, us_k: "5Y",    uk: 4.5, eu: 37.5 },
    { length_cm: 24.1, us_m: null, us_w: null, us_k: "5.5Y",  uk: 5,   eu: 38 },
    { length_cm: 24.5, us_m: null, us_w: null, us_k: "6Y",    uk: 5.5, eu: 39 },
  ],
};

export default CONVERSE_FOOTWEAR_SIZE_GUIDE;
