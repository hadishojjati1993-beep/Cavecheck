// vans.ts
// Vans Footwear Size Guide — extracted from provided charts (Adult + Kids)
// Canonical sizing: foot length (cm)
// Keeping only:
// - Adult: length_cm, US Men, US Women, UK, EU
// - Kids:  length_cm, US Kids (C/Y), UK, EU

export type VansSizeRow = {
  length_cm: number;       // canonical key
  us_m: number | null;     // US Men (null where not applicable)
  us_w: number | null;     // US Women (null where not applicable)
  us_k: string | null;     // US Kids (e.g., "2C", "10.5C", "1Y", "2.5Y")
  uk: number;
  eu: number;

  // optional metadata (keeps things clean for future filtering; resolver can ignore)
  group?: "adult" | "toddler" | "kids";
};

export type VansSizeGuide = {
  brand: "vans";
  category: "footwear";
  genders: Array<"men" | "women" | "unisex" | "kids">;
  units: Array<"length_cm" | "us_m" | "us_w" | "us_k" | "uk" | "eu">;
  rows: VansSizeRow[];
};

export const VANS_FOOTWEAR_SIZE_GUIDE: VansSizeGuide = {
  brand: "vans",
  category: "footwear",
  genders: ["men", "women", "unisex", "kids"],
  units: ["length_cm", "us_m", "us_w", "us_k", "uk", "eu"],
  rows: [
    /* ------------------------------- */
    /* ADULT (your existing rows)      */
    /* ------------------------------- */
    { group: "adult", length_cm: 21.5, us_m: null, us_w: 5,    us_k: null, uk: 2.5,  eu: 34.5 },
    { group: "adult", length_cm: 22.0, us_m: null, us_w: 5.5,  us_k: null, uk: 3,    eu: 35 },
    { group: "adult", length_cm: 22.5, us_m: null, us_w: 6,    us_k: null, uk: 3.5,  eu: 36 },
    { group: "adult", length_cm: 23.0, us_m: null, us_w: 6.5,  us_k: null, uk: 4,    eu: 36.5 },
    { group: "adult", length_cm: 23.5, us_m: null, us_w: 7,    us_k: null, uk: 4.5,  eu: 37 },
    { group: "adult", length_cm: 24.0, us_m: null, us_w: 7.5,  us_k: null, uk: 5,    eu: 38 },

    { group: "adult", length_cm: 24.5, us_m: 6.5,  us_w: 8,    us_k: null, uk: 5.5,  eu: 38.5 },
    { group: "adult", length_cm: 25.0, us_m: 7,    us_w: 8.5,  us_k: null, uk: 6,    eu: 39 },
    { group: "adult", length_cm: 25.5, us_m: 7.5,  us_w: 9,    us_k: null, uk: 6.5,  eu: 40 },
    { group: "adult", length_cm: 26.0, us_m: 8,    us_w: 9.5,  us_k: null, uk: 7,    eu: 40.5 },
    { group: "adult", length_cm: 26.5, us_m: 8.5,  us_w: 10,   us_k: null, uk: 7.5,  eu: 41 },
    { group: "adult", length_cm: 27.0, us_m: 9,    us_w: 10.5, us_k: null, uk: 8,    eu: 42 },
    { group: "adult", length_cm: 27.5, us_m: 9.5,  us_w: 11,   us_k: null, uk: 8.5,  eu: 42.5 },
    { group: "adult", length_cm: 28.0, us_m: 10,   us_w: 11.5, us_k: null, uk: 9,    eu: 43 },

    // extended (women column becomes "-")
    { group: "adult", length_cm: 28.5, us_m: 10.5, us_w: null, us_k: null, uk: 9.5,  eu: 44 },
    { group: "adult", length_cm: 29.0, us_m: 11,   us_w: null, us_k: null, uk: 10,   eu: 44.5 },
    { group: "adult", length_cm: 29.5, us_m: 11.5, us_w: null, us_k: null, uk: 10.5, eu: 45 },
    { group: "adult", length_cm: 30.0, us_m: 12,   us_w: null, us_k: null, uk: 11,   eu: 46 },
    { group: "adult", length_cm: 31.0, us_m: 13,   us_w: null, us_k: null, uk: 12,   eu: 47 },
    { group: "adult", length_cm: 32.0, us_m: 14,   us_w: null, us_k: null, uk: 13,   eu: 48 },
    { group: "adult", length_cm: 33.0, us_m: 15,   us_w: null, us_k: null, uk: 14,   eu: 49 },
    { group: "adult", length_cm: 34.0, us_m: 16,   us_w: null, us_k: null, uk: 15,   eu: 50 },

    /* ------------------------------- */
    /* KIDS — Toddlers' Shoes          */
    /* ------------------------------- */
    { group: "toddler", length_cm: 9.0,  us_m: null, us_w: null, us_k: "2C",   uk: 1.5, eu: 17 },
    { group: "toddler", length_cm: 9.5,  us_m: null, us_w: null, us_k: "2.5C", uk: 2,   eu: 17.5 },
    { group: "toddler", length_cm: 10.0, us_m: null, us_w: null, us_k: "3C",   uk: 2.5, eu: 18 },
    { group: "toddler", length_cm: 10.5, us_m: null, us_w: null, us_k: "3.5C", uk: 3,   eu: 18.5 },
    { group: "toddler", length_cm: 10.5, us_m: null, us_w: null, us_k: "4C",   uk: 3.5, eu: 19 },
    { group: "toddler", length_cm: 11.0, us_m: null, us_w: null, us_k: "4.5C", uk: 4,   eu: 20 },
    { group: "toddler", length_cm: 11.5, us_m: null, us_w: null, us_k: "5C",   uk: 4.5, eu: 21 },
    { group: "toddler", length_cm: 12.0, us_m: null, us_w: null, us_k: "5.5C", uk: 5,   eu: 21.5 },
    { group: "toddler", length_cm: 12.0, us_m: null, us_w: null, us_k: "6C",   uk: 5.5, eu: 22 },
    { group: "toddler", length_cm: 12.5, us_m: null, us_w: null, us_k: "6.5C", uk: 6,   eu: 22.5 },
    { group: "toddler", length_cm: 13.0, us_m: null, us_w: null, us_k: "7C",   uk: 6.5, eu: 23.5 },
    { group: "toddler", length_cm: 13.5, us_m: null, us_w: null, us_k: "7.5C", uk: 7,   eu: 24 },
    { group: "toddler", length_cm: 14.0, us_m: null, us_w: null, us_k: "8C",   uk: 7.5, eu: 24.5 },
    { group: "toddler", length_cm: 14.5, us_m: null, us_w: null, us_k: "8.5C", uk: 8,   eu: 25 },
    { group: "toddler", length_cm: 15.0, us_m: null, us_w: null, us_k: "9C",   uk: 8.5, eu: 25.5 },
    { group: "toddler", length_cm: 15.5, us_m: null, us_w: null, us_k: "9.5C", uk: 9,   eu: 26 },
    { group: "toddler", length_cm: 16.0, us_m: null, us_w: null, us_k: "10C",  uk: 9.5, eu: 26.5 },

    /* ------------------------------- */
    /* KIDS — Kids' Shoes              */
    /* ------------------------------- */
    { group: "kids", length_cm: 16.5, us_m: null, us_w: null, us_k: "10.5C", uk: 10,   eu: 27 },
    { group: "kids", length_cm: 16.5, us_m: null, us_w: null, us_k: "11C",   uk: 10.5, eu: 27.5 },
    { group: "kids", length_cm: 17.0, us_m: null, us_w: null, us_k: "11.5C", uk: 11,   eu: 28 },
    { group: "kids", length_cm: 17.5, us_m: null, us_w: null, us_k: "12C",   uk: 11.5, eu: 29 },
    { group: "kids", length_cm: 18.0, us_m: null, us_w: null, us_k: "12.5C", uk: 12,   eu: 30 },
    { group: "kids", length_cm: 18.5, us_m: null, us_w: null, us_k: "13C",   uk: 12.5, eu: 30.5 },
    { group: "kids", length_cm: 18.5, us_m: null, us_w: null, us_k: "13.5C", uk: 13,   eu: 31 },
    { group: "kids", length_cm: 19.0, us_m: null, us_w: null, us_k: "1Y",    uk: 13.5, eu: 31.5 },
    { group: "kids", length_cm: 19.5, us_m: null, us_w: null, us_k: "1.5Y",  uk: 1,    eu: 32 },
    { group: "kids", length_cm: 20.0, us_m: null, us_w: null, us_k: "2Y",    uk: 1.5,  eu: 32.5 },
    { group: "kids", length_cm: 20.5, us_m: null, us_w: null, us_k: "2.5Y",  uk: 2,    eu: 33 },
    { group: "kids", length_cm: 21.0, us_m: null, us_w: null, us_k: "3Y",    uk: 2.5,  eu: 34 },
  ],
};

export default VANS_FOOTWEAR_SIZE_GUIDE;
