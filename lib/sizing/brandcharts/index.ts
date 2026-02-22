// lib/sizing/brandcharts/index.ts
import type { BrandSizing, SizeChart, SizeRow } from "./types";
import { STANDARD_UNISEX_CHART } from "./common";

// ---- Brand raw guides (your files) ----
import NIKE from "./nike";
import ADIDAS from "./adidas";
import PUMA from "./puma";
import NEWBALANCE from "./newbalance";
import ASICS from "./asics";
import CONVERSE from "./converse";
import VANS from "./vans";
import { REEBOK_FOOTWEAR_SIZE_GUIDE } from "./reebok";
import SKECHERS from "./skechers";
import TIMBERLAND from "./timberland";
import SALOMON from "./salomon";
import HOKA from "./hoka";
import BROOKS from "./brooks";

// ✅ fix: make module resolution unambiguous
import DRMARTENS from "./drmartens";

// -------------------- helpers --------------------

function mmFromCm(cm: number): number {
  // keep it integer mm
  return Math.round(cm * 10);
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function nearestStandardRow(mm: number): SizeRow {
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

/**
 * Ensure row has all required fields (esp `is` which your types currently require).
 * Fallbacks: if any region is missing, fill from nearest STANDARD row.
 */
function normalizeRow(row: Partial<SizeRow> & { mm: number }): SizeRow {
  const std = nearestStandardRow(row.mm);

  const eu = row.eu ?? std.eu;
  const us = row.us ?? std.us;
  const uk = row.uk ?? std.uk;
  const jp = row.jp ?? std.jp;
  const is = row.is ?? eu; // important for your current TypeScript errors

  return {
    mm: row.mm,
    eu,
    us,
    uk,
    jp,
    is,
  };
}

function makeChart(
  label: string,
  rows: Array<Partial<SizeRow> & { mm: number }>
): SizeChart {
  return {
    label,
    rows: rows
      .filter(r => Number.isFinite(r.mm) && r.mm > 0)
      .map(normalizeRow)
      .sort((a, b) => a.mm - b.mm),
  };
}

// For EU-only brands (Puma/Brooks adult): map EU -> mm using STANDARD chart EU values
const EU_TO_MM: Record<string, number> = Object.fromEntries(
  STANDARD_UNISEX_CHART.rows.map(r => [String(r.eu), r.mm])
);

function mmFromEU(eu: number): number | null {
  // try exact, then try one-decimal string
  const key1 = String(eu);
  if (EU_TO_MM[key1] != null) return EU_TO_MM[key1]!;
  const key2 = String(Math.round(eu * 10) / 10);
  if (EU_TO_MM[key2] != null) return EU_TO_MM[key2]!;
  return null;
}

// -------------------- adapters --------------------

function adaptNike(): BrandSizing {
  const menRows = NIKE.datasets.men.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_m),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));

  const womenRows = NIKE.datasets.women.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_w),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));

  const kidsRows = NIKE.datasets.kids.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_k),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));

  return {
    brandId: "nike",
    displayName: "Nike",
    charts: {
      men: makeChart("Nike Men", menRows),
      women: makeChart("Nike Women", womenRows),
      kids: makeChart("Nike Kids", kidsRows),
      unisex: makeChart("Nike Unisex", menRows),
    },
  };
}

function adaptAdidas(): BrandSizing {
  const adult = ADIDAS.datasets.adult.rows.map((r: any) => ({
    mm: mmFromCm(r.heel_cm),
    us: toStr(r.us_m),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: r.jp != null ? toStr(r.jp >= 100 ? r.jp / 10 : r.jp) : "",
    is: toStr(r.eu),
  }));

  const babies = ADIDAS.datasets.kids.babies_toddlers.rows.map((r: any) => ({
    mm: mmFromCm(r.heel_cm),
    us: toStr(r.us),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.heel_cm),
    is: toStr(r.eu),
  }));
  const children = ADIDAS.datasets.kids.children.rows.map((r: any) => ({
    mm: mmFromCm(r.heel_cm),
    us: toStr(r.us),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.heel_cm),
    is: toStr(r.eu),
  }));
  const youth = ADIDAS.datasets.kids.youth_teens.rows.map((r: any) => ({
    mm: mmFromCm(r.heel_cm),
    us: toStr(r.us),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.heel_cm),
    is: toStr(r.eu),
  }));

  const kidsAll = [...babies, ...children, ...youth];

  return {
    brandId: "adidas",
    displayName: "Adidas",
    charts: {
      adult: makeChart("Adidas Adult", adult),
      kids: makeChart("Adidas Kids", kidsAll),
      unisex: makeChart("Adidas Unisex", adult),
      men: makeChart("Adidas Men", adult),
      women: makeChart(
        "Adidas Women",
        adult.map((x: any) => ({ ...x, us: "" }))
      ),
    },
  };
}

function adaptAsics(): BrandSizing {
  const men = ASICS.datasets.men.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_m),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));
  const women = ASICS.datasets.women.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_w),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));
  const kids = ASICS.datasets.kids.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_k),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));

  return {
    brandId: "asics",
    displayName: "ASICS",
    charts: {
      men: makeChart("ASICS Men", men),
      women: makeChart("ASICS Women", women),
      kids: makeChart("ASICS Kids", kids),
      unisex: makeChart("ASICS Unisex", men),
    },
  };
}

function adaptNewBalance(): BrandSizing {
  const men = NEWBALANCE.datasets.men.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_m),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));
  const women = NEWBALANCE.datasets.women.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_w),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));
  const kids = NEWBALANCE.datasets.kids.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_k),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));

  return {
    brandId: "newbalance",
    displayName: "New Balance",
    charts: {
      men: makeChart("New Balance Men", men),
      women: makeChart("New Balance Women", women),
      kids: makeChart("New Balance Kids", kids),
      unisex: makeChart("New Balance Unisex", men),
    },
  };
}

function adaptConverse(): BrandSizing {
  const adult = CONVERSE.rows
    .filter((r: any) => r.us_k == null)
    .map((r: any) => ({
      mm: mmFromCm(r.length_cm),
      us: toStr(r.us_m),
      uk: toStr(r.uk),
      eu: toStr(r.eu),
      jp: toStr(r.length_cm),
      is: toStr(r.eu),
    }));

  const kids = CONVERSE.rows
    .filter((r: any) => r.us_k != null)
    .map((r: any) => ({
      mm: mmFromCm(r.length_cm),
      us: toStr(r.us_k),
      uk: toStr(r.uk),
      eu: toStr(r.eu),
      jp: toStr(r.length_cm),
      is: toStr(r.eu),
    }));

  return {
    brandId: "converse",
    displayName: "Converse",
    charts: {
      unisex: makeChart("Converse Adult", adult),
      kids: makeChart("Converse Kids", kids),
      men: makeChart("Converse Men", adult),
      women: makeChart("Converse Women", adult.map((x: any) => ({ ...x, us: "" }))),
    },
  };
}

function adaptVans(): BrandSizing {
  const adult = VANS.rows
    .filter((r: any) => r.group === "adult")
    .map((r: any) => ({
      mm: mmFromCm(r.length_cm),
      us: r.us_m != null ? toStr(r.us_m) : toStr(r.us_w),
      uk: toStr(r.uk),
      eu: toStr(r.eu),
      jp: toStr(r.length_cm),
      is: toStr(r.eu),
    }));

  const kids = VANS.rows
    .filter((r: any) => r.group !== "adult")
    .map((r: any) => ({
      mm: mmFromCm(r.length_cm),
      us: toStr(r.us_k),
      uk: toStr(r.uk),
      eu: toStr(r.eu),
      jp: toStr(r.length_cm),
      is: toStr(r.eu),
    }));

  return {
    brandId: "vans",
    displayName: "Vans",
    charts: {
      unisex: makeChart("Vans Adult", adult),
      kids: makeChart("Vans Kids", kids),
      men: makeChart("Vans Men", adult),
      women: makeChart("Vans Women", adult.map((x: any) => ({ ...x, us: "" }))),
    },
  };
}

function adaptReebok(): BrandSizing {
  const men = REEBOK_FOOTWEAR_SIZE_GUIDE.datasets.men.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_m),
    is: "",
  }));

  const women = REEBOK_FOOTWEAR_SIZE_GUIDE.datasets.women.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_w),
    is: "",
  }));

  const kids = REEBOK_FOOTWEAR_SIZE_GUIDE.datasets.kids.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: r.us_m != null ? toStr(r.us_m) : toStr(r.us_w),
    is: "",
  }));

  return {
    brandId: "reebok",
    displayName: "Reebok",
    charts: {
      men: makeChart("Reebok Men", men),
      women: makeChart("Reebok Women", women),
      kids: makeChart("Reebok Kids", kids),
      unisex: makeChart("Reebok Unisex", men),
    },
  };
}

function adaptSkechers(): BrandSizing {
  const men = SKECHERS.datasets.men.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_m),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));
  const women = SKECHERS.datasets.women.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_w),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));

  return {
    brandId: "skechers",
    displayName: "Skechers",
    charts: {
      men: makeChart("Skechers Men", men),
      women: makeChart("Skechers Women", women),
      unisex: makeChart("Skechers Unisex", men),
    },
  };
}

function adaptTimberland(): BrandSizing {
  const men = TIMBERLAND.datasets.men.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));
  const women = TIMBERLAND.datasets.women.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));
  const infant = TIMBERLAND.datasets.infant.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));
  const toddler = TIMBERLAND.datasets.toddler.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.length_cm),
    is: toStr(r.eu),
  }));

  return {
    brandId: "timberland",
    displayName: "Timberland",
    charts: {
      men: makeChart("Timberland Men", men),
      women: makeChart("Timberland Women", women),
      infant: makeChart("Timberland Infant", infant),
      toddler: makeChart("Timberland Toddler", toddler),
      unisex: makeChart("Timberland Unisex", men),
    },
  };
}

function adaptSalomon(): BrandSizing {
  const rows = SALOMON.rows.map((r: any) => ({
    mm: mmFromCm(r.foot_length_cm),
    us: toStr(r.us_m),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: toStr(r.jp),
    is: toStr(r.eu),
  }));

  return {
    brandId: "salomon",
    displayName: "Salomon",
    charts: {
      men: makeChart("Salomon", rows),
      unisex: makeChart("Salomon", rows),
    },
  };
}

function adaptHoka(): BrandSizing {
  const men = HOKA.datasets.men.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_m),
    uk: r.uk == null ? "" : toStr(r.uk),
    eu: r.eu == null ? "" : toStr(r.eu),
    jp: toStr(r.length_cm),
    is: r.eu == null ? "" : toStr(r.eu),
  }));

  const women = HOKA.datasets.women.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_w),
    uk: r.uk == null ? "" : toStr(r.uk),
    eu: r.eu == null ? "" : toStr(r.eu),
    jp: toStr(r.length_cm),
    is: r.eu == null ? "" : toStr(r.eu),
  }));

  const kids = HOKA.datasets.kids.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_y),
    is: "",
  }));

  return {
    brandId: "hoka",
    displayName: "HOKA",
    charts: {
      men: makeChart("HOKA Men", men),
      women: makeChart("HOKA Women", women),
      kids: makeChart("HOKA Kids", kids),
      unisex: makeChart("HOKA Unisex", men),
    },
  };
}

function adaptDrMartens(): BrandSizing {
  const men = DRMARTENS.datasets.men.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_m),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: r.jp == null ? "" : toStr(r.jp),
    is: toStr(r.eu),
  }));

  const women = DRMARTENS.datasets.women.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_w),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: r.jp == null ? "" : toStr(r.jp),
    is: toStr(r.eu),
  }));

  const kids = DRMARTENS.datasets.kids.rows.map((r: any) => ({
    mm: mmFromCm(r.length_cm),
    us: toStr(r.us_k),
    uk: toStr(r.uk),
    eu: toStr(r.eu),
    jp: r.jp == null ? "" : toStr(r.jp),
    is: toStr(r.eu),
  }));

  return {
    brandId: "drmartens",
    displayName: "Dr. Martens",
    charts: {
      men: makeChart("Dr. Martens Men", men),
      women: makeChart("Dr. Martens Women", women),
      kids: makeChart("Dr. Martens Kids", kids),
      unisex: makeChart("Dr. Martens Unisex", men),
    },
  };
}

function adaptEUOnlyBrand(args: {
  brandId: string;
  displayName: string;
  menRows?: Array<{ eu: number; uk: number; us_m?: number | null; us_w?: number | null }>;
  womenRows?: Array<{ eu: number; uk: number; us_m?: number | null; us_w?: number | null }>;
}): BrandSizing {
  const { brandId, displayName, menRows, womenRows } = args;

  const men = (menRows ?? [])
    .map(r => {
      const mm = mmFromEU(r.eu);
      if (!mm) return null;
      return {
        mm,
        us: r.us_m == null ? "" : toStr(r.us_m),
        uk: toStr(r.uk),
        eu: toStr(r.eu),
        is: toStr(r.eu),
      };
    })
    .filter(Boolean) as Array<Partial<SizeRow> & { mm: number }>;

  const women = (womenRows ?? [])
    .map(r => {
      const mm = mmFromEU(r.eu);
      if (!mm) return null;
      return {
        mm,
        us: r.us_w == null ? "" : toStr(r.us_w),
        uk: toStr(r.uk),
        eu: toStr(r.eu),
        is: toStr(r.eu),
      };
    })
    .filter(Boolean) as Array<Partial<SizeRow> & { mm: number }>;

  return {
    brandId,
    displayName,
    charts: {
      men: makeChart(`${displayName} Men`, men),
      women: makeChart(`${displayName} Women`, women),
      unisex: makeChart(`${displayName} Unisex`, men.length ? men : women),
    },
  };
}

function adaptPuma(): BrandSizing {
  return adaptEUOnlyBrand({
    brandId: "puma",
    displayName: "Puma",
    menRows: PUMA.datasets.men.rows,
    womenRows: PUMA.datasets.women.rows,
  });
}

function adaptBrooks(): BrandSizing {
  return adaptEUOnlyBrand({
    brandId: "brooks",
    displayName: "Brooks",
    menRows: BROOKS.datasets.men.rows,
    womenRows: BROOKS.datasets.women.rows,
  });
}

// -------------------- registry --------------------

export const BRAND_REGISTRY: Record<string, BrandSizing> = {
  nike: adaptNike(),
  adidas: adaptAdidas(),
  puma: adaptPuma(),
  newbalance: adaptNewBalance(),
  asics: adaptAsics(),
  converse: adaptConverse(),
  vans: adaptVans(),
  reebok: adaptReebok(),
  skechers: adaptSkechers(),
  timberland: adaptTimberland(),
  salomon: adaptSalomon(),
  hoka: adaptHoka(),
  brooks: adaptBrooks(),
  drmartens: adaptDrMartens(),
};

export function getBrandSizing(brandId: string): BrandSizing | null {
  return BRAND_REGISTRY[brandId] ?? null;
}

export const BRANDS: BrandSizing[] = Object.values(BRAND_REGISTRY);
