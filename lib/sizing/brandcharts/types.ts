// lib/sizing/types.ts

export type SizeCategory =
  | "men"
  | "women"
  | "unisex"
  | "kids"
  | "adult"
  | "infant"
  | "toddler"
  | "children"
  | "youth_teens"
  | "babies_toddlers"
  | (string & {}); // allow future categories safely

export type SizeRow = {
  mm: number;

  // core regions (string because some sizes are "10C", "1Y", etc.)
  us: string;
  uk: string;
  eu: string;

  // optional regions
  jp?: string;

  // you currently require this (based on your errors)
  is: string;

  // allow future extensions without breaking types
  [k: string]: string | number | undefined;
};

export type SizeChart = {
  label: string;
  rows: SizeRow[];
};

export type BrandSizing = {
  brandId: string;
  displayName: string;

  // IMPORTANT: allow any categories (kids/adult/infant/...)
  charts: Record<string, SizeChart>;
};