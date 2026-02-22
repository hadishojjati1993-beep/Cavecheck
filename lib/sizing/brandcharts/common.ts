// lib/sizing/brandcharts/common.ts
import type { SizeChart, SizeRow } from "./types";

export const STANDARD_UNISEX_CHART: SizeChart = {
  label: "Standard (Mondopoint-based)",
  rows: [
    { mm: 220, eu: "35", us: "4", uk: "2.5", jp: "22", is: "35" },
    { mm: 225, eu: "36", us: "4.5", uk: "3", jp: "22.5", is: "36" },
    { mm: 230, eu: "36.5", us: "5", uk: "3.5", jp: "23", is: "36.5" },
    { mm: 235, eu: "37.5", us: "5.5", uk: "4", jp: "23.5", is: "37.5" },
    { mm: 240, eu: "38", us: "6", uk: "4.5", jp: "24", is: "38" },
    { mm: 245, eu: "38.5", us: "6.5", uk: "5", jp: "24.5", is: "38.5" },
    { mm: 250, eu: "39", us: "7", uk: "5.5", jp: "25", is: "39" },
    { mm: 255, eu: "40", us: "7.5", uk: "6", jp: "25.5", is: "40" },
    { mm: 260, eu: "40.5", us: "8", uk: "6.5", jp: "26", is: "40.5" },
    { mm: 265, eu: "41", us: "8.5", uk: "7", jp: "26.5", is: "41" },
    { mm: 270, eu: "42", us: "9", uk: "7.5", jp: "27", is: "42" },
    { mm: 275, eu: "42.5", us: "9.5", uk: "8", jp: "27.5", is: "42.5" },
    { mm: 280, eu: "43", us: "10", uk: "8.5", jp: "28", is: "43" },
    { mm: 285, eu: "44", us: "10.5", uk: "9", jp: "28.5", is: "44" },
    { mm: 290, eu: "44.5", us: "11", uk: "9.5", jp: "29", is: "44.5" },
    { mm: 295, eu: "45", us: "11.5", uk: "10", jp: "29.5", is: "45" },
    { mm: 300, eu: "46", us: "12", uk: "10.5", jp: "30", is: "46" },
    { mm: 305, eu: "47", us: "12.5", uk: "11", jp: "30.5", is: "47" },
    { mm: 310, eu: "47.5", us: "13", uk: "11.5", jp: "31", is: "47.5" },
  ],
};

// helpful for other adapters
export function nearestStandardRow(mm: number): SizeRow {
  let best = STANDARD_UNISEX_CHART.rows[0]!;
  let bestD = Math.abs(best.mm - mm);

  for (const r of STANDARD_UNISEX_CHART.rows) {
    const d = Math.abs(r.mm - mm);
    if (d < bestD) {
      best = r;
      bestD = d;
    }
  }
  return best;
}