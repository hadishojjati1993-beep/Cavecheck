// lib/sizing/brandcharts/adidas.ts

import type { BrandSizing } from "../types";

export const ADIDAS: BrandSizing = {
  brandId: "adidas",
  displayName: "adidas",

  charts: {
    men: {
      label: "adidas Men",
      rows: [
        { mm: 250, eu: "40", us: "7", uk: "6.5", jp: "25" },
        { mm: 255, eu: "40 2/3", us: "7.5", uk: "7", jp: "25.5" },
        { mm: 260, eu: "41 1/3", us: "8", uk: "7.5", jp: "26" },
        { mm: 265, eu: "42", us: "8.5", uk: "8", jp: "26.5" },
        { mm: 270, eu: "42 2/3", us: "9", uk: "8.5", jp: "27" },
        { mm: 275, eu: "43 1/3", us: "9.5", uk: "9", jp: "27.5" },
        { mm: 280, eu: "44", us: "10", uk: "9.5", jp: "28" }
      ]
    }
  }
};