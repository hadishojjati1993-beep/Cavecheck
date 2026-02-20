// lib/vision/pipeline/steps/confidence.ts

export type CardConfidenceInput = {
  // expected: pixels of the detected card rectangle
  widthPx: number;
  heightPx: number;
  // optional: how much of the frame it covers (0..1)
  areaRatio?: number;
  // optional: how rectangular it is (0..1)
  rectangularity?: number;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function safe(n: unknown, fallback = 0) {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

/**
 * Standard bank card aspect ratio: 85.60 / 53.98 ~= 1.586
 * We score closeness to this ratio + reasonable size in frame.
 */
export function scoreCardConfidence(input: CardConfidenceInput): number {
  const w = Math.max(1, safe(input.widthPx, 1));
  const h = Math.max(1, safe(input.heightPx, 1));
  const ratio = w > h ? w / h : h / w;

  // ratio closeness to 1.586
  const target = 1.586;
  const ratioErr = Math.abs(ratio - target); // 0 is perfect
  const ratioScore = clamp01(1 - ratioErr / 0.55); // tolerant

  // card should not be too tiny in frame
  // (we don't know actual frame size here, so we use a soft heuristic)
  const minEdge = Math.min(w, h);
  const sizeScore = clamp01((minEdge - 80) / 220); // 80px..300px

  const areaRatio = clamp01(safe(input.areaRatio, 0.18)); // default medium
  const areaScore = clamp01((areaRatio - 0.04) / 0.20); // 4%..24%

  const rect = clamp01(safe(input.rectangularity, 0.9));
  const rectScore = rect;

  // weighted blend
  const confidence =
    0.42 * ratioScore +
    0.28 * sizeScore +
    0.18 * areaScore +
    0.12 * rectScore;

  return clamp01(confidence);
}

/**
 * mmPerPx confidence gate:
 * - penalize implausible scales
 * - prefer stable/typical ranges
 */
export function scoreMmPerPxConfidence(mmPerPx: number): number {
  if (!Number.isFinite(mmPerPx) || mmPerPx <= 0) return 0;

  // plausible bounds (already used in runner sanity checks, but we score here too)
  const lo = 0.12;
  const hi = 1.2;

  if (mmPerPx < lo || mmPerPx > hi) return 0;

  // best zone tends to be around ~0.2..0.6 depending on distance
  const bestLo = 0.18;
  const bestHi = 0.75;

  if (mmPerPx >= bestLo && mmPerPx <= bestHi) return 1;

  // soft falloff
  if (mmPerPx < bestLo) {
    return Math.max(0, 1 - (bestLo - mmPerPx) / (bestLo - lo));
  }
  return Math.max(0, 1 - (mmPerPx - bestHi) / (hi - bestHi));
}

