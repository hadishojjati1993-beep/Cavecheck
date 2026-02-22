// reebok.ts
// Reebok Footwear Size Guide — extracted from provided charts (US + heel-to-toe in inches)
// All lengths converted to cm: inch * 2.54, rounded to 1 decimal for consistency

type ReebokGender = "men" | "women" | "kids";

export type ReebokSizeRow = {
  length_cm: number;        // canonical key
  us_m: number | null;      // US Men (null when not applicable)
  us_w: number | null;      // US Women (null when not applicable)
};

export type ReebokDataset = {
  brand: "reebok";
  category: "footwear";
  gender: ReebokGender;
  units: Array<"length_cm" | "us_m" | "us_w">;
  rows: ReebokSizeRow[];
};

const inchToCm = (inch: number): number => Math.round(inch * 2.54 * 10) / 10;

/* ---------------------------------- */
/* MEN (US Men Size -> Heel-to-toe in) */
/* ---------------------------------- */

export const REEBOK_MEN: ReebokDataset = {
  brand: "reebok",
  category: "footwear",
  gender: "men",
  units: ["length_cm", "us_m", "us_w"],
  rows: [
    { us_m: 6.5,  us_w: null, length_cm: inchToCm(9.5) },  // 24.1
    { us_m: 7,    us_w: null, length_cm: inchToCm(9.7) },  // 24.6
    { us_m: 7.5,  us_w: null, length_cm: inchToCm(9.8) },  // 24.9
    { us_m: 8,    us_w: null, length_cm: inchToCm(10.0) }, // 25.4
    { us_m: 8.5,  us_w: null, length_cm: inchToCm(10.2) }, // 25.9
    { us_m: 9,    us_w: null, length_cm: inchToCm(10.3) }, // 26.2
    { us_m: 9.5,  us_w: null, length_cm: inchToCm(10.5) }, // 26.7
    { us_m: 10,   us_w: null, length_cm: inchToCm(10.7) }, // 27.2
    { us_m: 10.5, us_w: null, length_cm: inchToCm(10.8) }, // 27.4
    { us_m: 11,   us_w: null, length_cm: inchToCm(11.0) }, // 27.9
    { us_m: 11.5, us_w: null, length_cm: inchToCm(11.2) }, // 28.4
    { us_m: 12,   us_w: null, length_cm: inchToCm(11.3) }, // 28.7
    { us_m: 12.5, us_w: null, length_cm: inchToCm(11.5) }, // 29.2
    { us_m: 13,   us_w: null, length_cm: inchToCm(11.7) }, // 29.7
    { us_m: 13.5, us_w: null, length_cm: inchToCm(11.8) }, // 30.0
    { us_m: 14,   us_w: null, length_cm: inchToCm(12.0) }, // 30.5
    { us_m: 14.5, us_w: null, length_cm: inchToCm(12.2) }, // 31.0
    { us_m: 15,   us_w: null, length_cm: inchToCm(12.3) }, // 31.2
    { us_m: 15.5, us_w: null, length_cm: inchToCm(12.5) }, // 31.8
    { us_m: 16,   us_w: null, length_cm: inchToCm(12.6) }, // 32.0
    { us_m: 16.5, us_w: null, length_cm: inchToCm(12.8) }, // 32.5
  ],
};

/* ---------------------------------- */
/* WOMEN (US Women Size -> Heel-to-toe in) */
/* ---------------------------------- */

export const REEBOK_WOMEN: ReebokDataset = {
  brand: "reebok",
  category: "footwear",
  gender: "women",
  units: ["length_cm", "us_m", "us_w"],
  rows: [
    { us_m: null, us_w: 3.5,  length_cm: inchToCm(8.0) },  // 20.3
    { us_m: null, us_w: 4,    length_cm: inchToCm(8.2) },  // 20.8
    { us_m: null, us_w: 4.5,  length_cm: inchToCm(8.3) },  // 21.1
    { us_m: null, us_w: 5,    length_cm: inchToCm(8.5) },  // 21.6
    { us_m: null, us_w: 5.5,  length_cm: inchToCm(8.7) },  // 22.1
    { us_m: null, us_w: 6,    length_cm: inchToCm(8.8) },  // 22.4
    { us_m: null, us_w: 6.5,  length_cm: inchToCm(9.0) },  // 22.9
    { us_m: null, us_w: 7,    length_cm: inchToCm(9.2) },  // 23.4
    { us_m: null, us_w: 7.5,  length_cm: inchToCm(9.3) },  // 23.6
    { us_m: null, us_w: 8,    length_cm: inchToCm(9.5) },  // 24.1
    { us_m: null, us_w: 8.5,  length_cm: inchToCm(9.7) },  // 24.6
    { us_m: null, us_w: 9,    length_cm: inchToCm(9.8) },  // 24.9
    { us_m: null, us_w: 9.5,  length_cm: inchToCm(10.0) }, // 25.4
    { us_m: null, us_w: 10,   length_cm: inchToCm(10.2) }, // 25.9
    { us_m: null, us_w: 10.5, length_cm: inchToCm(10.3) }, // 26.2
    { us_m: null, us_w: 11,   length_cm: inchToCm(10.5) }, // 26.7
    { us_m: null, us_w: 12,   length_cm: inchToCm(10.8) }, // 27.4
  ],
};

/* ---------------------------------- */
/* KIDS (using provided "Unisex Shoes Size Guide" as kids/unisex) */
/* ---------------------------------- */

export const REEBOK_KIDS: ReebokDataset = {
  brand: "reebok",
  category: "footwear",
  gender: "kids",
  units: ["length_cm", "us_m", "us_w"],
  rows: [
    { us_m: 2,   us_w: 3.5, length_cm: inchToCm(8.0) },
    { us_m: 2.5, us_w: 4,   length_cm: inchToCm(8.2) },
    { us_m: 3,   us_w: 4.5, length_cm: inchToCm(8.3) },
    { us_m: 3.5, us_w: 5,   length_cm: inchToCm(8.5) },
    { us_m: 4,   us_w: 5.5, length_cm: inchToCm(8.7) },
    { us_m: 4.5, us_w: 6,   length_cm: inchToCm(8.8) },
    { us_m: 5,   us_w: 6.5, length_cm: inchToCm(9.0) },
    { us_m: 5.5, us_w: 7,   length_cm: inchToCm(9.2) },
    { us_m: 6,   us_w: 7.5, length_cm: inchToCm(9.3) },
    { us_m: 6.5, us_w: 8,   length_cm: inchToCm(9.5) },
    { us_m: 7,   us_w: 8.5, length_cm: inchToCm(9.7) },
    { us_m: 7.5, us_w: 9,   length_cm: inchToCm(9.8) },
    { us_m: 8,   us_w: 9.5, length_cm: inchToCm(10.0) },
    { us_m: 8.5, us_w: 10,  length_cm: inchToCm(10.2) },
    { us_m: 9,   us_w: 10.5,length_cm: inchToCm(10.3) },
    { us_m: 9.5, us_w: 11,  length_cm: inchToCm(10.5) },
    { us_m: 10,  us_w: 11.5,length_cm: inchToCm(10.7) },
    { us_m: 10.5,us_w: 12,  length_cm: inchToCm(10.8) },
    { us_m: 11,  us_w: 12.5,length_cm: inchToCm(11.0) },
    { us_m: 11.5,us_w: 13,  length_cm: inchToCm(11.2) },
    { us_m: 12,  us_w: 13.5,length_cm: inchToCm(11.3) },
    { us_m: 12.5,us_w: 14,  length_cm: inchToCm(11.5) },
    { us_m: 13,  us_w: 14.5,length_cm: inchToCm(11.7) },
    { us_m: 13.5,us_w: 15,  length_cm: inchToCm(11.8) },

    // rows where women is "--" in the unisex chart
    { us_m: 14,   us_w: null, length_cm: inchToCm(12.0) },
    { us_m: 14.5, us_w: null, length_cm: inchToCm(12.2) },
    { us_m: 15,   us_w: null, length_cm: inchToCm(12.3) },
    { us_m: 15.5, us_w: null, length_cm: inchToCm(12.5) },
    { us_m: 16,   us_w: null, length_cm: inchToCm(12.6) },
    { us_m: 16.5, us_w: null, length_cm: inchToCm(12.8) },
    { us_m: 17,   us_w: null, length_cm: inchToCm(13.0) },
    { us_m: 17.5, us_w: null, length_cm: inchToCm(13.1) },
    { us_m: 18,   us_w: null, length_cm: inchToCm(13.3) },
    { us_m: 18.5, us_w: null, length_cm: inchToCm(13.5) },
  ],
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const REEBOK_FOOTWEAR_SIZE_GUIDE = {
  brand: "reebok",
  category: "footwear",
  datasets: {
    men: REEBOK_MEN,
    women: REEBOK_WOMEN,
    kids: REEBOK_KIDS,
  },
};