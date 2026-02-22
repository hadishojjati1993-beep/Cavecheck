// nike.ts
// Nike Footwear Size Guide (Official Nike charts provided via your screenshots)
// Canonical sizing: foot length (cm)
// Datasets: men/unisex + women + kids
// Units kept: length_cm, US (men/women/kids), UK, EU

export type NikeSizeRow = {
  length_cm: number;        // canonical key
  us_m: number | null;      // US - Men's / Unisex
  us_w: number | null;      // US - Women's
  us_k: string | null;      // US - Kids (e.g., "10C", "1Y", "6.5Y")
  uk: number;
  eu: number;
};

export type NikeDataset = {
  brand: "nike";
  category: "footwear";
  gender: "men" | "women" | "kids";
  rows: NikeSizeRow[];
};

/* ---------------------------------- */
/* MEN / UNISEX (from Nike men's chart) */
/* ---------------------------------- */

export const NIKE_MEN: NikeDataset = {
  brand: "nike",
  category: "footwear",
  gender: "men",
  rows: [
    { length_cm: 21.6, us_m: 3.5,  us_w: 5,    us_k: null, uk: 3,    eu: 35.5 },
    { length_cm: 22.0, us_m: 4,    us_w: 5.5,  us_k: null, uk: 3.5,  eu: 36 },
    { length_cm: 22.4, us_m: 4.5,  us_w: 6,    us_k: null, uk: 4,    eu: 36.5 },
    { length_cm: 22.9, us_m: 5,    us_w: 6.5,  us_k: null, uk: 4.5,  eu: 37.5 },
    { length_cm: 23.3, us_m: 5.5,  us_w: 7,    us_k: null, uk: 5,    eu: 38 },
    { length_cm: 23.7, us_m: 6,    us_w: 7.5,  us_k: null, uk: 5.5,  eu: 38.5 },
    { length_cm: 24.1, us_m: 6.5,  us_w: 8,    us_k: null, uk: 6,    eu: 39 },

    { length_cm: 24.5, us_m: 7,    us_w: 8.5,  us_k: null, uk: 6,    eu: 40 },
    { length_cm: 25.0, us_m: 7.5,  us_w: 9,    us_k: null, uk: 6.5,  eu: 40.5 },
    { length_cm: 25.4, us_m: 8,    us_w: 9.5,  us_k: null, uk: 7,    eu: 41 },
    { length_cm: 25.8, us_m: 8.5,  us_w: 10,   us_k: null, uk: 7.5,  eu: 42 },
    { length_cm: 26.2, us_m: 9,    us_w: 10.5, us_k: null, uk: 8,    eu: 42.5 },
    { length_cm: 26.7, us_m: 9.5,  us_w: 11,   us_k: null, uk: 8.5,  eu: 43 },
    { length_cm: 27.1, us_m: 10,   us_w: 11.5, us_k: null, uk: 9,    eu: 44 },

    { length_cm: 27.5, us_m: 10.5, us_w: 12,   us_k: null, uk: 9.5,  eu: 44.5 },
    { length_cm: 27.9, us_m: 11,   us_w: 12.5, us_k: null, uk: 10,   eu: 45 },
    { length_cm: 28.3, us_m: 11.5, us_w: 13,   us_k: null, uk: 10.5, eu: 45.5 },
    { length_cm: 28.8, us_m: 12,   us_w: 13.5, us_k: null, uk: 11,   eu: 46 },
    { length_cm: 29.2, us_m: 12.5, us_w: 14,   us_k: null, uk: 11.5, eu: 47 },
    { length_cm: 29.6, us_m: 13,   us_w: 14.5, us_k: null, uk: 12,   eu: 47.5 },
    { length_cm: 30.0, us_m: 13.5, us_w: 15,   us_k: null, uk: 12.5, eu: 48 },

    { length_cm: 30.5, us_m: 14,   us_w: 15.5, us_k: null, uk: 13,   eu: 48.5 },
    { length_cm: 30.9, us_m: 14.5, us_w: 16,   us_k: null, uk: 13.5, eu: 49 },
    { length_cm: 31.3, us_m: 15,   us_w: 16.5, us_k: null, uk: 14,   eu: 49.5 },
    { length_cm: 31.7, us_m: 15.5, us_w: 17,   us_k: null, uk: 14.5, eu: 50 },
    { length_cm: 32.2, us_m: 16,   us_w: 17.5, us_k: null, uk: 15,   eu: 50.5 },
    { length_cm: 32.6, us_m: 16.5, us_w: 18,   us_k: null, uk: 15.5, eu: 51 },
    { length_cm: 33.0, us_m: 17,   us_w: 18.5, us_k: null, uk: 16,   eu: 51.5 },

    { length_cm: 33.4, us_m: 17.5, us_w: 19,   us_k: null, uk: 16.5, eu: 52 },
    { length_cm: 33.9, us_m: 18,   us_w: 19.5, us_k: null, uk: 17,   eu: 52.5 },
    { length_cm: 34.3, us_m: 18.5, us_w: 20,   us_k: null, uk: 17.5, eu: 53 },

    { length_cm: 34.7, us_m: 19,   us_w: 20.5, us_k: null, uk: 18,   eu: 53.5 },
    { length_cm: 35.1, us_m: 19.5, us_w: 21,   us_k: null, uk: 18.5, eu: 54 },
    { length_cm: 35.5, us_m: 20,   us_w: 21.5, us_k: null, uk: 19,   eu: 54.5 },
    { length_cm: 36.0, us_m: 20.5, us_w: 22,   us_k: null, uk: 19.5, eu: 55 },
    { length_cm: 36.4, us_m: 21,   us_w: 22.5, us_k: null, uk: 20,   eu: 55.5 },
    { length_cm: 36.8, us_m: 21.5, us_w: 23,   us_k: null, uk: 20.5, eu: 56 },
    { length_cm: 37.2, us_m: 22,   us_w: 23.5, us_k: null, uk: 21,   eu: 56.5 },
  ],
};

/* helper: map US-Men -> length_cm (used to fill women's big sizes where length not visible) */
const MEN_US_TO_LENGTH_CM: Record<string, number> = Object.fromEntries(
  NIKE_MEN.rows
    .filter(r => r.us_m != null)
    .map(r => [String(r.us_m), r.length_cm]),
);

/* ---------------------------------- */
/* WOMEN (from Nike women's chart pieces you sent) */
/* ---------------------------------- */

export const NIKE_WOMEN: NikeDataset = {
  brand: "nike",
  category: "footwear",
  gender: "women",
  rows: [
    { length_cm: 20.8, us_m: 2,   us_w: 3.5, us_k: null, uk: 1.5, eu: 33.5 },
    { length_cm: 21.2, us_m: 2.5, us_w: 4,   us_k: null, uk: 1.5, eu: 34.5 },
    { length_cm: 21.6, us_m: 3,   us_w: 4.5, us_k: null, uk: 2,   eu: 35 },
    { length_cm: 22.0, us_m: 3.5, us_w: 5,   us_k: null, uk: 2.5, eu: 35.5 },
    { length_cm: 22.4, us_m: 4,   us_w: 5.5, us_k: null, uk: 3,   eu: 36 },
    { length_cm: 22.9, us_m: 4.5, us_w: 6,   us_k: null, uk: 3.5, eu: 36.5 },
    { length_cm: 23.3, us_m: 5,   us_w: 6.5, us_k: null, uk: 4,   eu: 37.5 },

    { length_cm: 26.7, us_m: 9,   us_w: 10.5, us_k: null, uk: 8,   eu: 42.5 },
    { length_cm: 27.1, us_m: 9.5, us_w: 11,   us_k: null, uk: 8.5, eu: 43 },
    { length_cm: 27.5, us_m: 10,  us_w: 11.5, us_k: null, uk: 9,   eu: 44 },
    { length_cm: 27.9, us_m: 10.5,us_w: 12,   us_k: null, uk: 9.5, eu: 44.5 },
    { length_cm: 28.3, us_m: 11,  us_w: 12.5, us_k: null, uk: 10,  eu: 45 },
    { length_cm: 28.8, us_m: 11.5,us_w: 13,   us_k: null, uk: 10.5,eu: 45.5 },
    { length_cm: 29.2, us_m: 12,  us_w: 13.5, us_k: null, uk: 11,  eu: 46 },

    { length_cm: 29.6, us_m: 12.5,us_w: 14,   us_k: null, uk: 11.5,eu: 47 },
    { length_cm: 30.0, us_m: 13,  us_w: 14.5, us_k: null, uk: 12,  eu: 47.5 },
    { length_cm: 30.5, us_m: 13.5,us_w: 15,   us_k: null, uk: 12.5,eu: 48 },
    { length_cm: 30.9, us_m: 14,  us_w: 15.5, us_k: null, uk: 13,  eu: 48.5 },
    { length_cm: 31.3, us_m: 14.5,us_w: 16,   us_k: null, uk: 13.5,eu: 49 },
    { length_cm: 31.7, us_m: 15,  us_w: 16.5, us_k: null, uk: 14,  eu: 50 },
    { length_cm: 32.2, us_m: 15.5,us_w: 17,   us_k: null, uk: 14.5,eu: 50.5 },

    { length_cm: MEN_US_TO_LENGTH_CM["16"],   us_m: 16,   us_w: 17.5, us_k: null, uk: 15,   eu: 51 },
    { length_cm: MEN_US_TO_LENGTH_CM["16.5"], us_m: 16.5, us_w: 18,   us_k: null, uk: 15.5, eu: 51.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["17"],   us_m: 17,   us_w: 18.5, us_k: null, uk: 16,   eu: 52 },
    { length_cm: MEN_US_TO_LENGTH_CM["17.5"], us_m: 17.5, us_w: 19,   us_k: null, uk: 16.5, eu: 52.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["18"],   us_m: 18,   us_w: 19.5, us_k: null, uk: 17,   eu: 53 },
    { length_cm: MEN_US_TO_LENGTH_CM["18.5"], us_m: 18.5, us_w: 20,   us_k: null, uk: 17.5, eu: 53.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["19"],   us_m: 19,   us_w: 20.5, us_k: null, uk: 18,   eu: 54 },

    { length_cm: MEN_US_TO_LENGTH_CM["19.5"], us_m: 19.5, us_w: 21,   us_k: null, uk: 18.5, eu: 54.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["20"],   us_m: 20,   us_w: 21.5, us_k: null, uk: 19,   eu: 55 },
    { length_cm: MEN_US_TO_LENGTH_CM["20.5"], us_m: 20.5, us_w: 22,   us_k: null, uk: 19.5, eu: 55.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["21"],   us_m: 21,   us_w: 22.5, us_k: null, uk: 20,   eu: 56 },
  ],
};

/* ---------------------------------- */
/* KIDS (from Nike kids charts you provided: Babies/Toddlers + Little Kids + Big Kids) */
/* ---------------------------------- */

export const NIKE_KIDS: NikeDataset = {
  brand: "nike",
  category: "footwear",
  gender: "kids",
  rows: [
    // Babies & Toddlers (1C - 10C)
    { length_cm: 9.1,  us_m: null, us_w: null, us_k: "1C",  uk: 0.5,  eu: 16 },
    { length_cm: 10.0, us_m: null, us_w: null, us_k: "2C",  uk: 1.5,  eu: 17 },
    { length_cm: 10.8, us_m: null, us_w: null, us_k: "3C",  uk: 2.5,  eu: 18.5 },
    { length_cm: 11.6, us_m: null, us_w: null, us_k: "4C",  uk: 3.5,  eu: 19.5 },
    { length_cm: 12.5, us_m: null, us_w: null, us_k: "5C",  uk: 4.5,  eu: 21 },
    { length_cm: 13.3, us_m: null, us_w: null, us_k: "6C",  uk: 5.5,  eu: 22 },
    { length_cm: 14.2, us_m: null, us_w: null, us_k: "7C",  uk: 6.5,  eu: 23.5 },
    { length_cm: 15.0, us_m: null, us_w: null, us_k: "8C",  uk: 7.5,  eu: 25 },
    { length_cm: 15.9, us_m: null, us_w: null, us_k: "9C",  uk: 8.5,  eu: 26 },
    { length_cm: 16.7, us_m: null, us_w: null, us_k: "10C", uk: 9.5,  eu: 27 },

    // Little Kids (8C - 3Y) additions
    { length_cm: 17.2, us_m: null, us_w: null, us_k: "10.5C", uk: 10,   eu: 27.5 },
    { length_cm: 17.6, us_m: null, us_w: null, us_k: "11C",   uk: 10.5, eu: 28 },
    { length_cm: 18.0, us_m: null, us_w: null, us_k: "11.5C", uk: 11,   eu: 28.5 },
    { length_cm: 18.4, us_m: null, us_w: null, us_k: "12C",   uk: 11.5, eu: 29.5 },
    { length_cm: 18.8, us_m: null, us_w: null, us_k: "12.5C", uk: 12,   eu: 30 },
    { length_cm: 19.3, us_m: null, us_w: null, us_k: "13C",   uk: 12.5, eu: 31 },
    { length_cm: 19.7, us_m: null, us_w: null, us_k: "13.5C", uk: 13,   eu: 31.5 },

    // Big Kids (1Y - 7Y)
    { length_cm: 20.1, us_m: null, us_w: null, us_k: "1Y",   uk: 13.5, eu: 32 },
    { length_cm: 20.5, us_m: null, us_w: null, us_k: "1.5Y", uk: 1,    eu: 33 },
    { length_cm: 20.9, us_m: null, us_w: null, us_k: "2Y",   uk: 1.5,  eu: 33.5 },
    { length_cm: 21.4, us_m: null, us_w: null, us_k: "2.5Y", uk: 2,    eu: 34 },
    { length_cm: 21.8, us_m: null, us_w: null, us_k: "3Y",   uk: 2.5,  eu: 35 },
    { length_cm: 22.2, us_m: null, us_w: null, us_k: "3.5Y", uk: 3,    eu: 35.5 },
    { length_cm: 22.4, us_m: null, us_w: null, us_k: "4Y",   uk: 3.5,  eu: 36 },
    { length_cm: 22.7, us_m: null, us_w: null, us_k: "4.5Y", uk: 4,    eu: 36.5 },
    { length_cm: 23.2, us_m: null, us_w: null, us_k: "5Y",   uk: 4.5,  eu: 37.5 },
    { length_cm: 23.5, us_m: null, us_w: null, us_k: "5.5Y", uk: 5,    eu: 38 },
    { length_cm: 23.8, us_m: null, us_w: null, us_k: "6Y",   uk: 5.5,  eu: 38.5 },
    { length_cm: 24.3, us_m: null, us_w: null, us_k: "6.5Y", uk: 6,    eu: 39 },
    { length_cm: 24.6, us_m: null, us_w: null, us_k: "7Y",   uk: 6,    eu: 40 },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const NIKE_FOOTWEAR_SIZE_GUIDE = {
  brand: "nike",
  category: "footwear",
  datasets: {
    men: NIKE_MEN,
    women: NIKE_WOMEN,
    kids: NIKE_KIDS,
  },
};

export default NIKE_FOOTWEAR_SIZE_GUIDE;
