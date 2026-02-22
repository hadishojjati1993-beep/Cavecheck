// adidas.ts
// Adidas Footwear Size Guide (Adult + Kids/Youth/Teens) — extracted from provided size chart screenshots
// Canonical key: heel-to-toe length (cm).
// Adult: keeps your original structure (us_m/us_w/eu/uk/jp)
// Kids: uses string sizing for US/UK because Adidas kid sizes include "K" suffix (e.g., 10K, 13.5K).

/* =========================
 * Adult (original types)
 * ========================= */

export type FootwearSizeRow = {
  heel_cm: number;     // Heel-to-toe length (cm) — canonical
  us_m: number;        // US - Men
  us_w: number | null; // US - Women (null when chart shows "--")
  eu: number;          // EU (e.g., 36 2/3 => 36.6667, 37 1/3 => 37.3333)
  uk: number;          // UK
  jp: number | null;   // JP (null when chart shows "--")
};

export type AdidasAdultSizeGuide = {
  brand: "adidas";
  category: "footwear";
  genders: Array<"men" | "women" | "unisex">;
  units: Array<"heel_cm" | "us_m" | "us_w" | "uk" | "eu" | "jp">;
  rows: FootwearSizeRow[];
};

export const ADIDAS_ADULT_FOOTWEAR_SIZE_GUIDE: AdidasAdultSizeGuide = {
  brand: "adidas",
  category: "footwear",
  genders: ["men", "women", "unisex"],
  units: ["heel_cm", "us_m", "us_w", "uk", "eu", "jp"],
  rows: [
    // 22.1 cm -> 25.0 cm
    { heel_cm: 22.1, us_m: 4,   us_w: 5,   eu: 36,      uk: 3.5, jp: 220 },
    { heel_cm: 22.5, us_m: 4.5, us_w: 5.5, eu: 36.6667, uk: 4,   jp: 225 },
    { heel_cm: 22.9, us_m: 5,   us_w: 6,   eu: 37.3333, uk: 4.5, jp: 230 },
    { heel_cm: 23.3, us_m: 5.5, us_w: 6.5, eu: 38,      uk: 5,   jp: 235 },
    { heel_cm: 23.8, us_m: 6,   us_w: 7,   eu: 38.6667, uk: 5.5, jp: 240 },
    { heel_cm: 24.2, us_m: 6.5, us_w: 7.5, eu: 39.3333, uk: 6,   jp: 245 },
    { heel_cm: 24.6, us_m: 7,   us_w: 8,   eu: 40,      uk: 6.5, jp: 250 },
    { heel_cm: 25.0, us_m: 7.5, us_w: 8.5, eu: 40.6667, uk: 7,   jp: 255 },

    // 25.5 cm -> 28.4 cm
    { heel_cm: 25.5, us_m: 8,   us_w: 9,   eu: 41.3333, uk: 7.5, jp: 260 },
    { heel_cm: 25.9, us_m: 8.5, us_w: 9.5, eu: 42,      uk: 8,   jp: 265 },
    { heel_cm: 26.3, us_m: 9,   us_w: 10,  eu: 42.6667, uk: 8.5, jp: 270 },
    { heel_cm: 26.7, us_m: 9.5, us_w: 10.5,eu: 43.3333, uk: 9,   jp: 275 },
    { heel_cm: 27.1, us_m: 10,  us_w: 11,  eu: 44,      uk: 9.5, jp: 280 },
    { heel_cm: 27.6, us_m: 10.5,us_w: 11.5,eu: 44.6667, uk: 10,  jp: 285 },
    { heel_cm: 28.0, us_m: 11,  us_w: 12,  eu: 45.3333, uk: 10.5,jp: 290 },
    { heel_cm: 28.4, us_m: 11.5,us_w: 12.5,eu: 46,      uk: 11,  jp: 295 },

    // 28.8 cm -> 31.8 cm
    { heel_cm: 28.8, us_m: 12,  us_w: 13,  eu: 46.6667, uk: 11.5,jp: 300 },
    { heel_cm: 29.3, us_m: 12.5,us_w: 13.5,eu: 47.3333, uk: 12,  jp: 305 },
    { heel_cm: 29.7, us_m: 13,  us_w: 14,  eu: 48,      uk: 12.5,jp: 310 },
    { heel_cm: 30.1, us_m: 13.5,us_w: 14.5,eu: 48.6667, uk: 13,  jp: 315 },
    { heel_cm: 30.5, us_m: 14,  us_w: 15,  eu: 49.3333, uk: 13.5,jp: 320 },
    { heel_cm: 31.0, us_m: 14.5,us_w: 15.5,eu: 50,      uk: 14,  jp: 325 },
    { heel_cm: 31.4, us_m: 15,  us_w: null,eu: 50.6667, uk: 14.5,jp: null },
    { heel_cm: 31.8, us_m: 16,  us_w: null,eu: 51.3333, uk: 15,  jp: null },

    // Extended sizes (men only in chart): 32.6 cm -> 35.2 cm
    { heel_cm: 32.6, us_m: 17,  us_w: null,eu: 52.6667, uk: 16,  jp: null },
    { heel_cm: 33.5, us_m: 18,  us_w: null,eu: 53.3333, uk: 17,  jp: null },
    { heel_cm: 34.3, us_m: 19,  us_w: null,eu: 54.6667, uk: 18,  jp: null },
    { heel_cm: 35.2, us_m: 20,  us_w: null,eu: 55.6667, uk: 19,  jp: null },
  ],
};

/* =========================
 * Kids / Youth / Teens
 * ========================= */

export type AdidasKidsSizeRow = {
  heel_cm: number; // canonical
  us: string;      // US kids sizing string (keeps K suffix)
  uk: string;      // UK kids sizing string (keeps K suffix)
  eu: number;      // EU (some are .5; keep as number)
};

export type AdidasKidsDataset = {
  brand: "adidas";
  category: "footwear";
  segment: "babies_toddlers" | "children" | "youth_teens";
  units: Array<"heel_cm" | "us" | "uk" | "eu">;
  rows: AdidasKidsSizeRow[];
};

// Babies & toddlers (0–3) — from your screenshots
export const ADIDAS_KIDS_BABIES_TODDLERS: AdidasKidsDataset = {
  brand: "adidas",
  category: "footwear",
  segment: "babies_toddlers",
  units: ["heel_cm", "us", "uk", "eu"],
  rows: [
    { heel_cm: 8.1,  us: "1K",   uk: "0K",   eu: 16 },
    { heel_cm: 9.0,  us: "2K",   uk: "1K",   eu: 17 },
    { heel_cm: 9.8,  us: "3K",   uk: "2K",   eu: 18 },
    { heel_cm: 10.6, us: "4K",   uk: "3K",   eu: 19 },
    { heel_cm: 11.5, us: "5K",   uk: "4K",   eu: 20 },
    { heel_cm: 12.3, us: "5.5K", uk: "5K",   eu: 21 },
    { heel_cm: 12.8, us: "6K",   uk: "5.5K", eu: 22 },
    { heel_cm: 13.2, us: "6.5K", uk: "6K",   eu: 23 },

    { heel_cm: 13.6, us: "7K",   uk: "6.5K", eu: 23.5 },
    { heel_cm: 14.0, us: "7.5K", uk: "7K",   eu: 24 },
    { heel_cm: 14.5, us: "8K",   uk: "7.5K", eu: 25 },
    { heel_cm: 14.9, us: "8.5K", uk: "8K",   eu: 25.5 },
    { heel_cm: 15.3, us: "9K",   uk: "8.5K", eu: 26 },
    { heel_cm: 15.7, us: "9.5K", uk: "9K",   eu: 26.5 },
    { heel_cm: 16.1, us: "10K",  uk: "9.5K", eu: 27 },
  ],
};

// Children (4–7) — from your screenshots
export const ADIDAS_KIDS_CHILDREN: AdidasKidsDataset = {
  brand: "adidas",
  category: "footwear",
  segment: "children",
  units: ["heel_cm", "us", "uk", "eu"],
  rows: [
    { heel_cm: 16.6, us: "10.5K", uk: "10K",   eu: 28 },
    { heel_cm: 17.0, us: "11K",   uk: "10.5K", eu: 28.5 },
    { heel_cm: 17.4, us: "11.5K", uk: "11K",   eu: 29 },
    { heel_cm: 17.8, us: "12K",   uk: "11.5K", eu: 30 },
    { heel_cm: 18.3, us: "12.5K", uk: "12K",   eu: 30.5 },
    { heel_cm: 18.7, us: "13K",   uk: "12.5K", eu: 31 },
    { heel_cm: 19.1, us: "13.5K", uk: "13K",   eu: 31.5 },
    { heel_cm: 19.5, us: "1",     uk: "13.5K", eu: 32 },

    { heel_cm: 20.0, us: "1.5",   uk: "1",     eu: 33 },
    { heel_cm: 20.4, us: "2",     uk: "1.5",   eu: 33.5 },
    { heel_cm: 20.8, us: "2.5",   uk: "2",     eu: 34 },
    { heel_cm: 21.2, us: "3",     uk: "2.5",   eu: 35 },
  ],
};

// Youth & teens (8–16) — from your screenshots (EU with thirds converted to decimals)
export const ADIDAS_KIDS_YOUTH_TEENS: AdidasKidsDataset = {
  brand: "adidas",
  category: "footwear",
  segment: "youth_teens",
  units: ["heel_cm", "us", "uk", "eu"],
  rows: [
    { heel_cm: 21.6, us: "3.5", uk: "3",   eu: 35.5 },
    { heel_cm: 22.1, us: "4",   uk: "3.5", eu: 36 },
    { heel_cm: 22.5, us: "4.5", uk: "4",   eu: 36.6667 }, // 36 2/3
    { heel_cm: 22.9, us: "5",   uk: "4.5", eu: 37.3333 }, // 37 1/3
    { heel_cm: 23.3, us: "5.5", uk: "5",   eu: 38 },
    { heel_cm: 23.8, us: "6",   uk: "5.5", eu: 38.6667 }, // 38 2/3
    { heel_cm: 24.2, us: "6.5", uk: "6",   eu: 39.3333 }, // 39 1/3
    { heel_cm: 24.6, us: "7",   uk: "6.5", eu: 40 },
    { heel_cm: 25.0, us: "7.5", uk: "7",   eu: 40.6667 }, // 40 2/3
  ],
};

/* =========================
 * Unified export (index.ts friendly)
 * ========================= */

export const ADIDAS_FOOTWEAR_SIZE_GUIDE = {
  brand: "adidas" as const,
  category: "footwear" as const,
  datasets: {
    adult: ADIDAS_ADULT_FOOTWEAR_SIZE_GUIDE,
    kids: {
      babies_toddlers: ADIDAS_KIDS_BABIES_TODDLERS,
      children: ADIDAS_KIDS_CHILDREN,
      youth_teens: ADIDAS_KIDS_YOUTH_TEENS,
    },
  },
};

export default ADIDAS_FOOTWEAR_SIZE_GUIDE;
