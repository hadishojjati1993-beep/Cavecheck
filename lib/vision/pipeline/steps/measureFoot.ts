// lib/vision/pipeline/steps/measureFoot.ts
import type { MeasurementResult } from "@/lib/vision/types/scan";
import type { ReferenceCardResult } from "./detectReferenceCard";

export type Point2D = { x: number; y: number };

export type MeasureFootInput = {
  card: ReferenceCardResult;
  foot: unknown;
  bufferMM: number;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function median(values: number[]) {
  const arr = values.filter((v) => Number.isFinite(v)).slice().sort((a, b) => a - b);
  if (arr.length === 0) return NaN;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid]! : (arr[mid - 1]! + arr[mid]!) / 2;
}

function quantile(values: number[], q: number) {
  const arr = values.filter((v) => Number.isFinite(v)).slice().sort((a, b) => a - b);
  if (arr.length === 0) return NaN;
  const p = clamp(q, 0, 1) * (arr.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  const a = arr[i]!;
  const b = arr[Math.min(i + 1, arr.length - 1)]!;
  return a + (b - a) * f;
}

function isPoint2D(v: unknown): v is Point2D {
  return (
    !!v &&
    typeof v === "object" &&
    Number.isFinite((v as { x?: unknown }).x) &&
    Number.isFinite((v as { y?: unknown }).y)
  );
}

function extractFootPoints(foot: unknown): Point2D[] {
  if (!foot || typeof foot !== "object") return [];

  const asObj = foot as Record<string, unknown>;

  const arrCandidates = [
    asObj["contour"],
    asObj["points"],
    asObj["outline"],
    asObj["polygon"],
  ];

  for (const c of arrCandidates) {
    if (Array.isArray(c) && c.length >= 10 && c.every(isPoint2D)) return c;
  }

  const bbox = asObj["bbox"];
  if (bbox && typeof bbox === "object") {
    const b = bbox as { x?: unknown; y?: unknown; width?: unknown; height?: unknown };
    const x = Number(b.x);
    const y = Number(b.y);
    const w = Number(b.width);
    const h = Number(b.height);
    if ([x, y, w, h].every(Number.isFinite) && w > 0 && h > 0) {
      return [
        { x, y },
        { x: x + w, y },
        { x: x + w, y: y + h },
        { x, y: y + h },
      ];
    }
  }

  return [];
}

function pcaAxis(points: Point2D[]) {
  let mx = 0;
  let my = 0;
  for (const p of points) {
    mx += p.x;
    my += p.y;
  }
  mx /= points.length;
  my /= points.length;

  let sxx = 0;
  let sxy = 0;
  let syy = 0;

  for (const p of points) {
    const dx = p.x - mx;
    const dy = p.y - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  sxx /= points.length;
  sxy /= points.length;
  syy /= points.length;

  const trace = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, trace * trace - 4 * det);
  const lambda1 = (trace + Math.sqrt(disc)) / 2;

  let vx = sxy;
  let vy = lambda1 - sxx;

  if (!Number.isFinite(vx) || !Number.isFinite(vy) || (vx === 0 && vy === 0)) {
    vx = 1;
    vy = 0;
  }

  const norm = Math.hypot(vx, vy) || 1;
  return { ux: vx / norm, uy: vy / norm };
}

function project(points: Point2D[], ux: number, uy: number) {
  const major: number[] = [];
  const minor: number[] = [];
  const vx = -uy;
  const vy = ux;

  for (const p of points) {
    major.push(p.x * ux + p.y * uy);
    minor.push(p.x * vx + p.y * vy);
  }

  return { major, minor };
}

function computeRobustSpan(values: number[], loQ: number, hiQ: number) {
  const lo = quantile(values, loQ);
  const hi = quantile(values, hiQ);
  return hi - lo;
}

function readFiniteNumber(obj: unknown, key: string): number | null {
  if (!obj || typeof obj !== "object") return null;
  const v = (obj as Record<string, unknown>)[key];
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function ensureCardIsUsable(card: ReferenceCardResult) {
  const conf = readFiniteNumber(card, "confidence");
  if (conf === null || conf < 0.6) {
    throw new Error("Reference card not detected reliably. Reposition card and try again.");
  }

  const mmPerPx = readFiniteNumber(card, "mmPerPx");
  if (mmPerPx === null) {
    throw new Error("Invalid scale. Reposition card and try again.");
  }

  if (mmPerPx < 0.02 || mmPerPx > 0.45) {
    throw new Error("Scale out of range. Move closer and reposition the card.");
  }
}

export async function measureFoot(input: MeasureFootInput): Promise<MeasurementResult> {
  const { card, foot, bufferMM } = input;

  ensureCardIsUsable(card);

  const points = extractFootPoints(foot);
  if (points.length < 4) {
    throw new Error("Foot not detected reliably. Reposition foot and try again.");
  }

  const { ux, uy } = pcaAxis(points);
  const { major, minor } = project(points, ux, uy);

  const trimPairs: Array<[number, number]> = [
    [0.01, 0.99],
    [0.02, 0.98],
    [0.05, 0.95],
  ];

  const lengthPxSamples: number[] = [];
  const widthPxSamples: number[] = [];

  for (const [lo, hi] of trimPairs) {
    const len = computeRobustSpan(major, lo, hi);
    const wid = computeRobustSpan(minor, lo, hi);
    if (Number.isFinite(len) && Number.isFinite(wid)) {
      lengthPxSamples.push(Math.abs(len));
      widthPxSamples.push(Math.abs(wid));
    }
  }

  const lengthPx = median(lengthPxSamples);
  const widthPx = median(widthPxSamples);

  if (!Number.isFinite(lengthPx) || !Number.isFinite(widthPx) || lengthPx <= 0 || widthPx <= 0) {
    throw new Error("Measurement unstable. Hold still and try again.");
  }

  const mmPerPx = readFiniteNumber(card, "mmPerPx");
  if (mmPerPx === null) {
    throw new Error("Invalid scale. Reposition card and try again.");
  }

  const lengthMM = lengthPx * mmPerPx;
  const widthMM = widthPx * mmPerPx;

  if (lengthMM < 160 || lengthMM > 340) {
    throw new Error("Unreliable measurement. Reposition card and foot and try again.");
  }
  if (widthMM < 55 || widthMM > 140) {
    throw new Error("Unreliable measurement. Reposition card and foot and try again.");
  }

  const b = Number.isFinite(bufferMM) ? bufferMM : 0;

  return {
    lengthMM,
    widthMM,
    mmPerPx,
    bufferMM: b,
    lengthMMBuffered: lengthMM + b,
    widthMMBuffered: widthMM + b,
  };
}

