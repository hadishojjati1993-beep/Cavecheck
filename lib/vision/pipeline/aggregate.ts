// lib/vision/pipeline/aggregate.ts

export type MeasurementLike = {
  lengthMMBuffered: number;
  widthMMBuffered: number;
};

function median(values: number[]) {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

/**
 * Trimmed mean: remove X% lowest + X% highest, average the rest.
 * If trimming would remove everything, falls back to median.
 */
function trimmedMean(values: number[], trimRatio: number) {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const trim = Math.floor(sorted.length * trimRatio);
  const kept = sorted.slice(trim, sorted.length - trim);
  if (kept.length === 0) return median(values);
  const sum = kept.reduce((a, b) => a + b, 0);
  return sum / kept.length;
}

export function aggregateMeasurements(
  measurements: MeasurementLike[],
  opts?: { trimRatio?: number }
) {
  const trimRatio = opts?.trimRatio ?? 0.15;

  const lengths = measurements.map((m) => m.lengthMMBuffered);
  const widths = measurements.map((m) => m.widthMMBuffered);

  const lengthMedian = median(lengths);
  const widthMedian = median(widths);

  const lengthTrimmed = trimmedMean(lengths, trimRatio);
  const widthTrimmed = trimmedMean(widths, trimRatio);

  // Prefer trimmed mean when it’s sane; fallback to median.
  const length = Number.isFinite(lengthTrimmed) ? lengthTrimmed : lengthMedian;
  const width = Number.isFinite(widthTrimmed) ? widthTrimmed : widthMedian;

  return {
    lengthMMBuffered: length,
    widthMMBuffered: width,
    debug: {
      n: measurements.length,
      lengthMedian,
      widthMedian,
      lengthTrimmed,
      widthTrimmed,
    },
  };
}

export function pickClosestIndex(values: number[], target: number) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < values.length; i++) {
    const d = Math.abs(values[i] - target);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}