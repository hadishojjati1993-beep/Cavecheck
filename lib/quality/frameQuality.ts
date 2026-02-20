// lib/vision/quality/frameQuality.ts

export type FrameQuality = {
  usable: boolean;
  brightness: number; // 0..255 approx
  sharpness: number; // higher = sharper
  motion: number; // higher = more motion/noise
};

export type FrameQualityResult = FrameQuality & {
  // Optional unified score for ranking frames (0..1)
  score: number;
  reason?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/**
 * Commercial-grade "good enough" heuristic:
 * - brightness: avoid too dark / too bright
 * - sharpness: Laplacian energy approximation
 * - motion: frame noise proxy (can be improved later)
 */
export function evaluateFrameQuality(img: ImageData): FrameQuality {
  const { data, width, height } = img;

  // Sample stride to keep it fast on mobile
  const step = 4 * 6; // sample every ~6 pixels (RGBA)
  let sum = 0;
  let count = 0;

  // brightness (luma)
  for (let i = 0; i < data.length; i += step) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    // Rec.601 luma
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += y;
    count += 1;
  }

  const brightness = count ? sum / count : 0;

  // sharpness: lightweight laplacian-like measure
  // We'll sample pixels and compare to right/down neighbors.
  let sharp = 0;
  let sharpCount = 0;

  // motion/noise proxy: local absolute differences average
  let motion = 0;
  let motionCount = 0;

  const stride = width * 4;

  // sample grid (avoid borders)
  const pxStep = 6;
  for (let y = 1; y < height - 2; y += pxStep) {
    for (let x = 1; x < width - 2; x += pxStep) {
      const idx = y * stride + x * 4;

      const y0 = lumaAt(data, idx);
      const yR = lumaAt(data, idx + 4);
      const yD = lumaAt(data, idx + stride);

      const dx = Math.abs(y0 - yR);
      const dy = Math.abs(y0 - yD);

      motion += dx + dy;
      motionCount += 2;

      // Laplacian-ish: center minus neighbors
      const lap = Math.abs(yR + yD - 2 * y0);
      sharp += lap;
      sharpCount += 1;
    }
  }

  const sharpness = sharpCount ? sharp / sharpCount : 0;
  const motionScore = motionCount ? motion / motionCount : 0;

  // Thresholds tuned for "works well" baseline (we’ll tune later with real samples)
  const brightnessOk = brightness >= 60 && brightness <= 220;
  const sharpOk = sharpness >= 10;
  const motionOk = motionScore <= 18;

  const usable = brightnessOk && sharpOk && motionOk;

  return {
    usable,
    brightness: clamp(brightness, 0, 255),
    sharpness,
    motion: motionScore,
  };
}

/**
 * ✅ Compatibility wrapper for runner.ts
 * runner imports `frameQuality(...)`
 *
 * - keeps your existing heuristic intact
 * - adds a normalized `score` (0..1) so runner can rank frames
 */
export function frameQuality(img: ImageData): FrameQualityResult {
  const q = evaluateFrameQuality(img);

  // Normalize into a single score for ranking "best" frames.
  // Brightness centered around ~140, motion lower is better, sharpness higher better.
  const brightnessCenter = 140;
  const brightnessPenalty = Math.min(1, Math.abs(q.brightness - brightnessCenter) / 140); // 0..1
  const brightnessScore = 1 - brightnessPenalty;

  const sharpnessScore = clamp(q.sharpness / 25, 0, 1); // tune later
  const motionScore = 1 - clamp(q.motion / 30, 0, 1); // tune later

  const score = clamp(
    brightnessScore * 0.35 + sharpnessScore * 0.45 + motionScore * 0.2,
    0,
    1
  );

  let reason: string | undefined;
  if (!q.usable) {
    if (q.brightness < 60) reason = "Too dark";
    else if (q.brightness > 220) reason = "Too bright";
    else if (q.sharpness < 10) reason = "Too blurry";
    else if (q.motion > 18) reason = "Too much motion";
    else reason = "Low quality frame";
  }

  return { ...q, score, reason };
}

function lumaAt(data: Uint8ClampedArray, idx: number) {
  const r = data[idx] ?? 0;
  const g = data[idx + 1] ?? 0;
  const b = data[idx + 2] ?? 0;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
