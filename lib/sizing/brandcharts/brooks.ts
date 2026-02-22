// brooks.ts
// Brooks Footwear Size Guide
// Canonical sizing: EU (because foot length is not provided in the source screenshots)

export type BrooksGender = "men" | "women";

export type BrooksSizeRow = {
  eu: number; // canonical key
  uk: number;
  us_m: number | null;
  us_w: number | null;
};

export type BrooksSizeRowWithGender = BrooksSizeRow & {
  gender: BrooksGender;
};

export type BrooksSizeDataset = {
  brand: "brooks";
  category: "footwear";
  gender: BrooksGender;
  units: Array<"eu" | "uk" | "us_m" | "us_w">;
  rows: BrooksSizeRow[];
};

export type BrooksWidthCode = "Narrow" | "Medium" | "Wide" | "Extra Wide";

export type BrooksWidthGuide = {
  brand: "brooks";
  category: "footwear";
  widths: {
    men: Record<BrooksWidthCode, "B" | "D" | "2E" | "4E">;
    women: Record<BrooksWidthCode, "2A" | "B" | "D" | "2E">;
  };
};

/* ----------------------------- */
/* WOMEN SIZE CHART (EU based)   */
/* ----------------------------- */

export const BROOKS_WOMEN: BrooksSizeDataset = {
  brand: "brooks",
  category: "footwear",
  gender: "women",
  units: ["eu", "uk", "us_m", "us_w"],
  rows: [
    { eu: 35.5, uk: 3, us_m: null, us_w: 5 },
    { eu: 36, uk: 3.5, us_m: null, us_w: 5.5 },
    { eu: 36.5, uk: 4, us_m: null, us_w: 6 },
    { eu: 37.5, uk: 4.5, us_m: null, us_w: 6.5 },
    { eu: 38, uk: 5, us_m: null, us_w: 7 },
    { eu: 38.5, uk: 5.5, us_m: null, us_w: 7.5 },
    { eu: 39, uk: 6, us_m: null, us_w: 8 },
    { eu: 40, uk: 6.5, us_m: null, us_w: 8.5 },
    { eu: 40.5, uk: 7, us_m: null, us_w: 9 },
    { eu: 41, uk: 7.5, us_m: null, us_w: 9.5 },
    { eu: 42, uk: 8, us_m: null, us_w: 10 },
    { eu: 42.5, uk: 8.5, us_m: null, us_w: 10.5 },
    { eu: 43, uk: 9, us_m: null, us_w: 11 },
    { eu: 44, uk: 9.5, us_m: null, us_w: 11.5 },
    { eu: 44.5, uk: 10, us_m: null, us_w: 12 },
    { eu: 45, uk: 10.5, us_m: null, us_w: 12.5 },
    { eu: 45.5, uk: 11, us_m: null, us_w: 13 },
  ],
};

/* ----------------------------- */
/* MEN SIZE CHART (EU based)     */
/* ----------------------------- */

export const BROOKS_MEN: BrooksSizeDataset = {
  brand: "brooks",
  category: "footwear",
  gender: "men",
  units: ["eu", "uk", "us_m", "us_w"],
  rows: [
    { eu: 37.5, uk: 4, us_m: 5, us_w: null },
    { eu: 38, uk: 4.5, us_m: 5.5, us_w: null },
    { eu: 38.5, uk: 5, us_m: 6, us_w: null },
    { eu: 39, uk: 5.5, us_m: 6.5, us_w: null },
    { eu: 40, uk: 6, us_m: 7, us_w: null },
    { eu: 40.5, uk: 6.5, us_m: 7.5, us_w: null },
    { eu: 41, uk: 7, us_m: 8, us_w: null },
    { eu: 42, uk: 7.5, us_m: 8.5, us_w: null },
    { eu: 42.5, uk: 8, us_m: 9, us_w: null },
    { eu: 43, uk: 8.5, us_m: 9.5, us_w: null },
    { eu: 44, uk: 9, us_m: 10, us_w: null },
    { eu: 44.5, uk: 9.5, us_m: 10.5, us_w: null },
    { eu: 45, uk: 10, us_m: 11, us_w: null },
    { eu: 45.5, uk: 10.5, us_m: 11.5, us_w: null },
    { eu: 46, uk: 11, us_m: 12, us_w: null },
    { eu: 46.5, uk: 11.5, us_m: 12.5, us_w: null },
    { eu: 47.5, uk: 12, us_m: 13, us_w: null },
    { eu: 48.5, uk: 13, us_m: 14, us_w: null },
    { eu: 49.5, uk: 14, us_m: 15, us_w: null },
    { eu: 50.5, uk: 15, us_m: 16, us_w: null },
  ],
};

/* ----------------------------- */
/* WIDTH CODES                   */
/* ----------------------------- */

export const BROOKS_WIDTH_GUIDE: BrooksWidthGuide = {
  brand: "brooks",
  category: "footwear",
  widths: {
    men: {
      Narrow: "B",
      Medium: "D",
      Wide: "2E",
      "Extra Wide": "4E",
    },
    women: {
      Narrow: "2A",
      Medium: "B",
      Wide: "D",
      "Extra Wide": "2E",
    },
  },
};

/* ---------------------------------- */
/* UNIFIED EXPORT (index.ts friendly) */
/* ---------------------------------- */

export const BROOKS_FOOTWEAR_SIZE_GUIDE = {
  brand: "brooks",
  category: "footwear",

  // ✅ IMPORTANT: keep a top-level rows for index.ts compatibility
  // (some aggregators expect .rows at the root)
  rows: [
    ...BROOKS_MEN.rows.map((r) => ({ ...r, gender: "men" as const })),
    ...BROOKS_WOMEN.rows.map((r) => ({ ...r, gender: "women" as const })),
  ] as BrooksSizeRowWithGender[],

  // ✅ Also keep datasets for your resolver-by-gender logic
  datasets: {
    men: BROOKS_MEN,
    women: BROOKS_WOMEN,
  },

  widthGuide: BROOKS_WIDTH_GUIDE,
};

export default BROOKS_FOOTWEAR_SIZE_GUIDE;
