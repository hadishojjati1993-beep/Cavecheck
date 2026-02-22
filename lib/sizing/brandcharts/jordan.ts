// jordan.ts
// Jordan Footwear Size Guide (Nike/Jordan official charts provided by user)
// Canonical sizing: foot length (cm)
// Notes:
// - Men/Unisex chart includes full length_cm.
// - Women chart includes length_cm for many rows, but last screenshots did not show length_cm.
//   For those rows only, length_cm is derived by matching the provided US-Men’s value to Men/Unisex table.

export type JordanSizeRow = {
  length_cm: number;       // canonical key
  us_m: number | null;     // US Men's / Unisex
  us_w: number | null;     // US Women's
  uk: number;
  eu: number;
};

export type JordanDataset = {
  brand: "jordan";
  category: "footwear";
  gender: "men" | "women";
  rows: JordanSizeRow[];
};

/* ---------------------------------- */
/* MEN / UNISEX                        */
/* ---------------------------------- */

export const JORDAN_MEN: JordanDataset = {
  brand: "jordan",
  category: "footwear",
  gender: "men",
  rows: [
    { length_cm: 21.6, us_m: 3.5,  us_w: 5,    uk: 3,    eu: 35.5 },
    { length_cm: 22.0, us_m: 4,    us_w: 5.5,  uk: 3.5,  eu: 36 },
    { length_cm: 22.4, us_m: 4.5,  us_w: 6,    uk: 4,    eu: 36.5 },
    { length_cm: 22.9, us_m: 5,    us_w: 6.5,  uk: 4.5,  eu: 37.5 },
    { length_cm: 23.3, us_m: 5.5,  us_w: 7,    uk: 5,    eu: 38 },
    { length_cm: 23.7, us_m: 6,    us_w: 7.5,  uk: 5.5,  eu: 38.5 },
    { length_cm: 24.1, us_m: 6.5,  us_w: 8,    uk: 6,    eu: 39 },

    { length_cm: 24.5, us_m: 7,    us_w: 8.5,  uk: 6,    eu: 40 },
    { length_cm: 25.0, us_m: 7.5,  us_w: 9,    uk: 6.5,  eu: 40.5 },
    { length_cm: 25.4, us_m: 8,    us_w: 9.5,  uk: 7,    eu: 41 },
    { length_cm: 25.8, us_m: 8.5,  us_w: 10,   uk: 7.5,  eu: 42 },
    { length_cm: 26.2, us_m: 9,    us_w: 10.5, uk: 8,    eu: 42.5 },
    { length_cm: 26.7, us_m: 9.5,  us_w: 11,   uk: 8.5,  eu: 43 },
    { length_cm: 27.1, us_m: 10,   us_w: 11.5, uk: 9,    eu: 44 },

    { length_cm: 27.5, us_m: 10.5, us_w: 12,   uk: 9.5,  eu: 44.5 },
    { length_cm: 27.9, us_m: 11,   us_w: 12.5, uk: 10,   eu: 45 },
    { length_cm: 28.3, us_m: 11.5, us_w: 13,   uk: 10.5, eu: 45.5 },
    { length_cm: 28.8, us_m: 12,   us_w: 13.5, uk: 11,   eu: 46 },
    { length_cm: 29.2, us_m: 12.5, us_w: 14,   uk: 11.5, eu: 47 },
    { length_cm: 29.6, us_m: 13,   us_w: 14.5, uk: 12,   eu: 47.5 },
    { length_cm: 30.0, us_m: 13.5, us_w: 15,   uk: 12.5, eu: 48 },

    { length_cm: 30.5, us_m: 14,   us_w: 15.5, uk: 13,   eu: 48.5 },
    { length_cm: 30.9, us_m: 14.5, us_w: 16,   uk: 13.5, eu: 49 },
    { length_cm: 31.3, us_m: 15,   us_w: 16.5, uk: 14,   eu: 49.5 },
    { length_cm: 31.7, us_m: 15.5, us_w: 17,   uk: 14.5, eu: 50 },
    { length_cm: 32.2, us_m: 16,   us_w: 17.5, uk: 15,   eu: 50.5 },
    { length_cm: 32.6, us_m: 16.5, us_w: 18,   uk: 15.5, eu: 51 },
    { length_cm: 33.0, us_m: 17,   us_w: 18.5, uk: 16,   eu: 51.5 },

    { length_cm: 33.4, us_m: 17.5, us_w: 19,   uk: 16.5, eu: 52 },
    { length_cm: 33.9, us_m: 18,   us_w: 19.5, uk: 17,   eu: 52.5 },
    { length_cm: 34.3, us_m: 18.5, us_w: 20,   uk: 17.5, eu: 53 },
    { length_cm: 34.7, us_m: 19,   us_w: 20.5, uk: 18,   eu: 53.5 },
    { length_cm: 35.1, us_m: 19.5, us_w: 21,   uk: 18.5, eu: 54 },
    { length_cm: 35.5, us_m: 20,   us_w: 21.5, uk: 19,   eu: 54.5 },
    { length_cm: 36.0, us_m: 20.5, us_w: 22,   uk: 19.5, eu: 55 },

    { length_cm: 34.7, us_m: 19,   us_w: 20.5, uk: 18,   eu: 53.5 },
    { length_cm: 35.1, us_m: 19.5, us_w: 21,   uk: 18.5, eu: 54 },
    { length_cm: 35.5, us_m: 20,   us_w: 21.5, uk: 19,   eu: 54.5 },
    { length_cm: 36.0, us_m: 20.5, us_w: 22,   uk: 19.5, eu: 55 },
    { length_cm: 36.4, us_m: 21,   us_w: 22.5, uk: 20,   eu: 55.5 },
    { length_cm: 36.8, us_m: 21.5, us_w: 23,   uk: 20.5, eu: 56 },
    { length_cm: 37.2, us_m: 22,   us_w: 23.5, uk: 21,   eu: 56.5 },
  ],
};

/* helper: map US-Men -> length_cm (for filling women rows where length is not visible) */
const MEN_US_TO_LENGTH_CM: Record<string, number> = Object.fromEntries(
  JORDAN_MEN.rows
    .filter(r => r.us_m != null)
    .map(r => [String(r.us_m), r.length_cm]),
);

/* ---------------------------------- */
/* WOMEN                               */
/* ---------------------------------- */

export const JORDAN_WOMEN: JordanDataset = {
  brand: "jordan",
  category: "footwear",
  gender: "women",
  rows: [
    // small women sizing (from women chart)
    { length_cm: 20.8, us_m: 2,   us_w: 3.5, uk: 1.5, eu: 33.5 },
    { length_cm: 21.2, us_m: 2.5, us_w: 4,   uk: 1.5, eu: 34.5 },
    { length_cm: 21.6, us_m: 3,   us_w: 4.5, uk: 2,   eu: 35 },
    { length_cm: 22.0, us_m: 3.5, us_w: 5,   uk: 2.5, eu: 35.5 },
    { length_cm: 22.4, us_m: 4,   us_w: 5.5, uk: 3,   eu: 36 },
    { length_cm: 22.9, us_m: 4.5, us_w: 6,   uk: 3.5, eu: 36.5 },
    { length_cm: 23.3, us_m: 5,   us_w: 6.5, uk: 4,   eu: 37.5 },

    // mid / extended women sizing with length visible (from women chart)
    { length_cm: 26.7, us_m: 9,   us_w: 10.5, uk: 8,   eu: 42.5 },
    { length_cm: 27.1, us_m: 9.5, us_w: 11,   uk: 8.5, eu: 43 },
    { length_cm: 27.5, us_m: 10,  us_w: 11.5, uk: 9,   eu: 44 },
    { length_cm: 27.9, us_m: 10.5,us_w: 12,   uk: 9.5, eu: 44.5 },
    { length_cm: 28.3, us_m: 11,  us_w: 12.5, uk: 10,  eu: 45 },
    { length_cm: 28.8, us_m: 11.5,us_w: 13,   uk: 10.5,eu: 45.5 },
    { length_cm: 29.2, us_m: 12,  us_w: 13.5, uk: 11,  eu: 46 },

    { length_cm: 29.6, us_m: 12.5,us_w: 14,   uk: 11.5,eu: 47 },
    { length_cm: 30.0, us_m: 13,  us_w: 14.5, uk: 12,  eu: 47.5 },
    { length_cm: 30.5, us_m: 13.5,us_w: 15,   uk: 12.5,eu: 48 },
    { length_cm: 30.9, us_m: 14,  us_w: 15.5, uk: 13,  eu: 48.5 },
    { length_cm: 31.3, us_m: 14.5,us_w: 16,   uk: 13.5,eu: 49 },
    { length_cm: 31.7, us_m: 15,  us_w: 16.5, uk: 14,  eu: 50 },
    { length_cm: 32.2, us_m: 15.5,us_w: 17,   uk: 14.5,eu: 50.5 },

    // women rows where length_cm was not visible in screenshot:
    // length_cm is derived via men US -> MEN_US_TO_LENGTH_CM lookup
    { length_cm: MEN_US_TO_LENGTH_CM["16"],   us_m: 16,   us_w: 17.5, uk: 15,   eu: 51 },
    { length_cm: MEN_US_TO_LENGTH_CM["16.5"], us_m: 16.5, us_w: 18,   uk: 15.5, eu: 51.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["17"],   us_m: 17,   us_w: 18.5, uk: 16,   eu: 52 },
    { length_cm: MEN_US_TO_LENGTH_CM["17.5"], us_m: 17.5, us_w: 19,   uk: 16.5, eu: 52.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["18"],   us_m: 18,   us_w: 19.5, uk: 17,   eu: 53 },
    { length_cm: MEN_US_TO_LENGTH_CM["18.5"], us_m: 18.5, us_w: 20,   uk: 17.5, eu: 53.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["19"],   us_m: 19,   us_w: 20.5, uk: 18,   eu: 54 },

    { length_cm: MEN_US_TO_LENGTH_CM["19.5"], us_m: 19.5, us_w: 21,   uk: 18.5, eu: 54.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["20"],   us_m: 20,   us_w: 21.5, uk: 19,   eu: 55 },
    { length_cm: MEN_US_TO_LENGTH_CM["20.5"], us_m: 20.5, us_w: 22,   uk: 19.5, eu: 55.5 },
    { length_cm: MEN_US_TO_LENGTH_CM["21"],   us_m: 21,   us_w: 22.5, uk: 20,   eu: 56 },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const JORDAN_FOOTWEAR_SIZE_GUIDE = {
  brand: "jordan",
  category: "footwear",
  datasets: {
    men: JORDAN_MEN,
    women: JORDAN_WOMEN,
  },
};

export default JORDAN_FOOTWEAR_SIZE_GUIDE;