// lib/quality/stability.ts
import type { FrameQuality } from "./frameQuality";

export type StabilityScore = {
  /** 0..1 higher is better */
  stability: number;
  /** higher means more motion */
  motion: number;
  /** thumbnail-based signature for next frame comparison */
  signature: Uint8Array;
};

type Options = {
  thumbW?: number;
  thumbH?: number;
  motionClamp?: number; // normalize motion
};

const DEFAULTS: Required<Options> = {
  thumbW: 32,
  thumbH: 18,
  motionClamp: 40, // tuned baseline; calibrate later with real device data
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function luma(r: number, g: number, b: number) {
  // Rec.601
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Creates a tiny grayscale "signature" (thumbnail) for motion estimation.
 * Very fast on mobile: sampling only.
 */
export function makeFrameSignature(img: ImageData, options: Options = {}): Uint8Array {
  const { thumbW, thumbH } = { ...DEFAULTS, ...options };
  const { data, width, height } = img;

  const sig = new Uint8Array(thumbW * thumbH);

  for (let ty = 0; ty < thumbH; ty++) {
    const y = Math.floor(((ty + 0.5) / thumbH) * height);
    for (let tx = 0; tx < thumbW; tx++) {
      const x = Math.floor(((tx + 0.5) / thumbW) * width);
      const idx = (y * width + x) * 4;

      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;

      const yv = luma(r, g, b);
      sig[ty * thumbW + tx] = Math.max(0, Math.min(255, Math.round(yv)));
    }
  }

  return sig;
}

/**
 * Mean absolute difference of signatures => motion proxy.
 */
export function motionFromSignatures(a: Uint8Array, b: Uint8Array): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 999;

  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.abs(a[i] - b[i]);
  return sum / n;
}

/**
 * Combines motion + optical quality into a single stability score.
 * This is the gate that makes results commercial-grade.
 */
export function computeStabilityScore(args: {
  img: ImageData;
  quality: FrameQuality;
  prevSignature?: Uint8Array;
  options?: Options;
}): StabilityScore {
  const { img, quality, prevSignature, options } = args;
  const opt = { ...DEFAULTS, ...(options ?? {}) };

  const signature = makeFrameSignature(img, opt);
  const motion = prevSignature ? motionFromSignatures(prevSignature, signature) : 999;

  // Normalize motion to 0..1 (0 good, 1 bad)
  const motionNorm = clamp01(motion / opt.motionClamp);
  const motionScore = 1 - motionNorm;

  // Sharpness: normalize to a soft 0..1 scale
  const sharpNorm = clamp01((quality.sharpness - 8) / 18);

  // Brightness: softly score it
  const brightNorm = clamp01((quality.brightness - 50) / 180);

  // Weighted blend (motion dominates)
  const stability = 0.62 * motionScore + 0.26 * sharpNorm + 0.12 * brightNorm;

  return {
    stability: clamp01(stability),
    motion,
    signature,
  };
}
