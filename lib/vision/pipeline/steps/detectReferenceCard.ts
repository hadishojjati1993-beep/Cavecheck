// lib/vision/pipeline/steps/detectReferenceCard.ts
import type { ScanFrame } from "@/lib/vision/types/scan";

export type Point2D = { x: number; y: number };

export type ReferenceCardResult = {
  corners: [Point2D, Point2D, Point2D, Point2D]; // TL, TR, BR, BL
  widthPx: number; // longer side in pixels
  heightPx: number; // shorter side in pixels
  mmPerPx: number;
  confidence: number; // 0..1
  debug?: Record<string, unknown>;
};

// ISO/IEC 7810 ID-1 (bank card) dimensions
const CARD_W_MM = 85.6;
const CARD_H_MM = 53.98;
const CARD_ASPECT = CARD_W_MM / CARD_H_MM; // ~1.586

// Conservative sanity bounds for mmPerPx across typical mobile cameras/resolutions
// (Used for confidence penalty, not hard-fail unless extreme)
const MM_PER_PX_MIN = 0.02;
const MM_PER_PX_MAX = 0.45;

type CvInstance = Record<string, unknown>;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function dist(a: Point2D, b: Point2D) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getCv(): CvInstance | null {
  const g = globalThis as { cv?: unknown };
  if (!g.cv || typeof g.cv !== "object") return null;
  return g.cv as CvInstance;
}

function polygonArea(pts: Point2D[]) {
  let a = 0;
  for (let i = 0; i < pts.length; i += 1) {
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % pts.length]!;
    a += p1.x * p2.y - p2.x * p1.y;
  }
  return Math.abs(a) / 2;
}

function orderCorners(pts: Point2D[]): [Point2D, Point2D, Point2D, Point2D] {
  // TL: min(x+y), BR: max(x+y), TR: max(x-y), BL: min(x-y)
  const sum = pts.map((p) => p.x + p.y);
  const diff = pts.map((p) => p.x - p.y);

  const tl = pts[sum.indexOf(Math.min(...sum))]!;
  const br = pts[sum.indexOf(Math.max(...sum))]!;
  const tr = pts[diff.indexOf(Math.max(...diff))]!;
  const bl = pts[diff.indexOf(Math.min(...diff))]!;

  return [tl, tr, br, bl];
}

function quadSideLengths(ordered: [Point2D, Point2D, Point2D, Point2D]) {
  const [tl, tr, br, bl] = ordered;
  const top = dist(tl, tr);
  const right = dist(tr, br);
  const bottom = dist(bl, br);
  const left = dist(tl, bl);
  return { top, right, bottom, left };
}

function quadSizePx(ordered: [Point2D, Point2D, Point2D, Point2D]) {
  const { top, right, bottom, left } = quadSideLengths(ordered);
  const w = (top + bottom) / 2;
  const h = (left + right) / 2;

  // Normalize so widthPx is the longer side (card long side)
  if (w >= h) return { widthPx: w, heightPx: h };
  return { widthPx: h, heightPx: w };
}

function angleAt(a: Point2D, b: Point2D, c: Point2D) {
  // angle ABC in degrees
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;

  const dot = abx * cbx + aby * cby;
  const na = Math.hypot(abx, aby);
  const nb = Math.hypot(cbx, cby);
  const denom = na * nb || 1;

  const cos = clamp(dot / denom, -1, 1);
  return (Math.acos(cos) * 180) / Math.PI;
}

function cornerAngleConfidence(ordered: [Point2D, Point2D, Point2D, Point2D]) {
  // Card corners should be near 90 degrees in perspective (allow wide tolerance)
  const [tl, tr, br, bl] = ordered;
  const a1 = angleAt(tr, tl, bl);
  const a2 = angleAt(tl, tr, br);
  const a3 = angleAt(tr, br, bl);
  const a4 = angleAt(br, bl, tl);

  const angles = [a1, a2, a3, a4].filter(Number.isFinite);
  if (angles.length !== 4) return 0;

  // Penalize if any angle is extremely acute/obtuse (bad quad)
  const minA = Math.min(...angles);
  const maxA = Math.max(...angles);

  // Acceptable rough bounds for a planar rectangle in perspective
  if (minA < 35 || maxA > 145) return 0;

  // Soft score around 90
  const dev = angles.reduce((acc, a) => acc + Math.abs(a - 90), 0) / 4;
  // dev 0 => 1, dev 25 => ~0, clamp
  return clamp(1 - dev / 25, 0, 1);
}

function aspectConfidence(aspect: number) {
  const rel = Math.abs(aspect - CARD_ASPECT) / CARD_ASPECT;
  return clamp(1 - rel * 2.2, 0, 1);
}

function areaConfidence(areaPx: number, frameAreaPx: number) {
  const ratio = areaPx / Math.max(1, frameAreaPx);

  // Hard reject extremes (too tiny / too huge)
  if (ratio < 0.01) return 0;
  if (ratio > 0.5) return 0;

  // Soft ramp (ideal ~2%..35%)
  return clamp((ratio - 0.01) / (0.35 - 0.01), 0, 1);
}

function rectangularityConfidence(polyArea: number, ordered: [Point2D, Point2D, Point2D, Point2D]) {
  // Compare polygon area vs bounding parallelogram-ish area (widthPx * heightPx)
  const { widthPx, heightPx } = quadSizePx(ordered);
  const boxArea = Math.max(1, widthPx * heightPx);
  const ratio = polyArea / boxArea; // 0..1
  // If it's very low, it's likely not a clean rectangle
  return clamp((ratio - 0.55) / (0.95 - 0.55), 0, 1);
}

function scaleConsistencyConfidence(
  widthPx: number,
  heightPx: number,
  mmPerPxW: number,
  mmPerPxH: number
) {
  // mmPerPx computed from each side should roughly match
  if (!Number.isFinite(mmPerPxW) || !Number.isFinite(mmPerPxH)) return 0;

  // Penalize extreme scale
  const scaleOk =
    mmPerPxW >= MM_PER_PX_MIN &&
    mmPerPxW <= MM_PER_PX_MAX &&
    mmPerPxH >= MM_PER_PX_MIN &&
    mmPerPxH <= MM_PER_PX_MAX;

  const base = scaleOk ? 1 : 0.4;

  // Relative mismatch
  const denom = Math.max(1e-6, (mmPerPxW + mmPerPxH) / 2);
  const relDiff = Math.abs(mmPerPxW - mmPerPxH) / denom;

  // relDiff 0 => 1, relDiff 0.18 => ~0
  const match = clamp(1 - relDiff / 0.18, 0, 1);

  // Also ensure the observed pixel aspect is plausible (avoid swapped/warped results)
  const observedAspect = Math.max(1e-6, widthPx / Math.max(1e-6, heightPx));
  const aC = aspectConfidence(observedAspect);

  return clamp(base * (0.65 * match + 0.35 * aC), 0, 1);
}

function computeConfidence(args: {
  aspect: number;
  polyArea: number;
  frameAreaPx: number;
  convex: boolean;
  angleC: number;
  rectC: number;
  scaleC: number;
}) {
  const aC = aspectConfidence(args.aspect);
  const arC = areaConfidence(args.polyArea, args.frameAreaPx);
  const cvx = args.convex ? 1 : 0.25;

  // Weighted blend (commercial gating)
  // aspect + area are strong signals, but corner angles + rectangularity + scale consistency reduce false positives
  const score =
    0.28 * aC +
    0.20 * arC +
    0.10 * cvx +
    0.16 * args.angleC +
    0.14 * args.rectC +
    0.12 * args.scaleC;

  return clamp(score, 0, 1);
}

export async function detectReferenceCard(frame: ScanFrame): Promise<ReferenceCardResult> {
  const cv = getCv();
  if (!cv) {
    throw new Error("Reference card not detected. Reposition card and try again.");
  }

  // Typed OpenCV handles (no any)
  const matFromImageData = cv["matFromImageData"] as unknown as (img: ImageData) => unknown;
  const Mat = cv["Mat"] as unknown as { new (): unknown };

  const cvtColor = cv["cvtColor"] as unknown as (src: unknown, dst: unknown, code: number) => void;
  const COLOR_RGBA2GRAY = cv["COLOR_RGBA2GRAY"] as unknown as number;

  const GaussianBlur = cv["GaussianBlur"] as unknown as (
    src: unknown,
    dst: unknown,
    ksize: unknown,
    sigmaX: number,
    sigmaY: number,
    borderType: number
  ) => void;

  const Size = cv["Size"] as unknown as { new (w: number, h: number): unknown };
  const BORDER_DEFAULT = cv["BORDER_DEFAULT"] as unknown as number;

  const Canny = cv["Canny"] as unknown as (src: unknown, dst: unknown, t1: number, t2: number) => void;

  const MatVector = cv["MatVector"] as unknown as {
    new (): unknown;
    size?: () => number;
    get?: (i: number) => unknown;
    delete?: () => void;
  };

  const findContours = cv["findContours"] as unknown as (
    image: unknown,
    contours: unknown,
    hierarchy: unknown,
    mode: number,
    method: number
  ) => void;

  const RETR_EXTERNAL = cv["RETR_EXTERNAL"] as unknown as number;
  const CHAIN_APPROX_SIMPLE = cv["CHAIN_APPROX_SIMPLE"] as unknown as number;

  const contourArea = cv["contourArea"] as unknown as (contour: unknown, oriented?: boolean) => number;
  const arcLength = cv["arcLength"] as unknown as (curve: unknown, closed: boolean) => number;

  const approxPolyDP = cv["approxPolyDP"] as unknown as (
    curve: unknown,
    approxCurve: unknown,
    epsilon: number,
    closed: boolean
  ) => void;

  const isContourConvex = cv["isContourConvex"] as unknown as (contour: unknown) => boolean;

  const cvPointAt = (mat: unknown, idx: number): { x: number; y: number } => {
    const intPtr = (mat as { intPtr?: (i: number, j: number) => Int32Array }).intPtr;
    if (!intPtr) return { x: 0, y: 0 };
    const p = intPtr(idx, 0);
    return { x: p[0] ?? 0, y: p[1] ?? 0 };
  };

  const src = matFromImageData(frame.imageData);
  const gray = new Mat();
  const blurred = new Mat();
  const edges = new Mat();
  const contours = new MatVector();
  const hierarchy = new Mat();

  try {
    cvtColor(src, gray, COLOR_RGBA2GRAY);
    GaussianBlur(gray, blurred, new Size(5, 5), 0, 0, BORDER_DEFAULT);
    Canny(blurred, edges, 60, 140);

    findContours(edges, contours, hierarchy, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE);

    const frameAreaPx = frame.width * frame.height;

    let best: {
      corners: [Point2D, Point2D, Point2D, Point2D];
      widthPx: number;
      heightPx: number;
      aspect: number;
      polyArea: number;
      confidence: number;
      convex: boolean;
      mmPerPx: number;
      mmPerPxW: number;
      mmPerPxH: number;
      angleC: number;
      rectC: number;
      scaleC: number;
    } | null = null;

    const sizeFn = (contours as { size?: () => number }).size;
    const getFn = (contours as { get?: (i: number) => unknown }).get;
    const n = sizeFn ? sizeFn.call(contours) : 0;

    for (let i = 0; i < n; i += 1) {
      if (!getFn) break;
      const cnt = getFn.call(contours, i);

      const areaPx = contourArea(cnt);
      if (!Number.isFinite(areaPx) || areaPx < frameAreaPx * 0.01) continue;

      const peri = arcLength(cnt, true);
      const approx = new Mat();

      try {
        approxPolyDP(cnt, approx, 0.02 * peri, true);

        const rows = (approx as { rows?: number }).rows ?? 0;
        if (rows !== 4) continue;

        const pts: Point2D[] = [];
        for (let k = 0; k < 4; k += 1) {
          const p = cvPointAt(approx, k);
          pts.push({ x: p.x, y: p.y });
        }

        const ordered = orderCorners(pts);
        const { widthPx, heightPx } = quadSizePx(ordered);

        if (!Number.isFinite(widthPx) || !Number.isFinite(heightPx) || widthPx < 30 || heightPx < 30) continue;

        const aspect = widthPx / Math.max(1e-6, heightPx);
        const convex = isContourConvex(approx);

        const polyArea = polygonArea(pts);
        const angleC = cornerAngleConfidence(ordered);
        const rectC = rectangularityConfidence(polyArea, ordered);

        // Compute mmPerPx from both dimensions (long side vs CARD_W_MM, short side vs CARD_H_MM)
        const mmPerPxW = CARD_W_MM / Math.max(1e-6, widthPx);
        const mmPerPxH = CARD_H_MM / Math.max(1e-6, heightPx);
        const mmPerPx = (mmPerPxW + mmPerPxH) / 2;

        const scaleC = scaleConsistencyConfidence(widthPx, heightPx, mmPerPxW, mmPerPxH);

        const confidence = computeConfidence({
          aspect,
          polyArea,
          frameAreaPx,
          convex,
          angleC,
          rectC,
          scaleC,
        });

        if (!best || confidence > best.confidence) {
          best = {
            corners: ordered,
            widthPx,
            heightPx,
            aspect,
            polyArea,
            confidence,
            convex,
            mmPerPx,
            mmPerPxW,
            mmPerPxH,
            angleC,
            rectC,
            scaleC,
          };
        }
      } finally {
        const del = (approx as { delete?: () => void }).delete;
        if (del) del.call(approx);
      }
    }

    // Commercial gating threshold
    if (!best || best.confidence < 0.62) {
      throw new Error("Reference card not detected. Reposition card and try again.");
    }

    // Extra safety: if mmPerPx is totally implausible, fail fast
    if (!Number.isFinite(best.mmPerPx) || best.mmPerPx < MM_PER_PX_MIN || best.mmPerPx > MM_PER_PX_MAX) {
      throw new Error("Reference card scale invalid. Reposition card and try again.");
    }

    return {
      corners: best.corners,
      widthPx: best.widthPx,
      heightPx: best.heightPx,
      mmPerPx: best.mmPerPx,
      confidence: best.confidence,
      debug: {
        aspect: best.aspect,
        polyArea: best.polyArea,
        convex: best.convex,
        angleC: best.angleC,
        rectC: best.rectC,
        scaleC: best.scaleC,
        mmPerPxW: best.mmPerPxW,
        mmPerPxH: best.mmPerPxH,
      },
    };
  } finally {
    const del = (x: unknown) => {
      const fn = (x as { delete?: () => void }).delete;
      if (fn) fn.call(x);
    };
    del(src);
    del(gray);
    del(blurred);
    del(edges);
    del(contours);
    del(hierarchy);
  }
}
