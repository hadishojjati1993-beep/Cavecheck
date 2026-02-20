// lib/vision/pipeline/steps.ts
import type {
  ConvertedSizes,
  MeasurementResult,
  ScanFrame,
} from "@/lib/vision/types/scan";

/**
 * Standard bank card size (ISO/IEC 7810 ID-1)
 */
export const CARD_WIDTH_MM = 85.60;
export const CARD_HEIGHT_MM = 53.98;

export const DEFAULT_BUFFER_MM = 2;

export type DetectedCard = {
  // Placeholder. In a real implementation you store the card quad/corners.
  mmPerPx: number;
};

export type DetectedFoot = {
  // Placeholder. In a real implementation you store the contour or keypoints.
  lengthPx: number;
  widthPx: number;
};

/**
 * Step 1: Detect reference card and estimate scale (mm per pixel).
 * NOTE: This is a safe stub. Replace with real detection later.
 */
export async function detectReferenceCard(frame: ScanFrame): Promise<DetectedCard> {
  // Very conservative fallback scale.
  // In real CV: detect card corners, compute card width in px => mmPerPx = CARD_WIDTH_MM / cardWidthPx.
  const fallbackMmPerPx = 0.20; // 1px ~ 0.20mm (placeholder)
  return { mmPerPx: fallbackMmPerPx };
}

/**
 * Step 2: Detect foot contour and estimate length/width in pixels.
 * NOTE: This is a safe stub. Replace with real segmentation/contour later.
 */
export async function detectFoot(frame: ScanFrame): Promise<DetectedFoot> {
  // Placeholder pixel measurements (so pipeline can run end-to-end).
  // Replace with: contour extraction, longest axis, ball width, etc.
  return {
    lengthPx: Math.max(1, Math.round(frame.width * 0.45)),
    widthPx: Math.max(1, Math.round(frame.width * 0.17)),
  };
}

/**
 * Step 3: Compute foot measurement in mm (with buffer).
 */
export async function measureFoot(input: {
  card: DetectedCard;
  foot: DetectedFoot;
  bufferMM?: number;
}): Promise<MeasurementResult> {
  const bufferMM = input.bufferMM ?? DEFAULT_BUFFER_MM;

  const mmPerPx = input.card.mmPerPx;

  const lengthMM = input.foot.lengthPx * mmPerPx;
  const widthMM = input.foot.widthPx * mmPerPx;

  const lengthMMBuffered = lengthMM + bufferMM;
  const widthMMBuffered = widthMM + bufferMM;

  return {
    lengthMM,
    widthMM,
    mmPerPx,
    bufferMM,
    lengthMMBuffered,
    widthMMBuffered,
  };
}

/**
 * Step 4: Convert sizes based on measured length (buffered).
 * NOTE: Stub conversion. Later you’ll swap with brand-charts engine.
 */
export async function convertSizes(input: {
  lengthMMBuffered: number;
}): Promise<ConvertedSizes> {
  const mm = input.lengthMMBuffered;

  // Simple placeholder mapping (do NOT ship this as final).
  // Replace with your sizing engine + brand charts.
  if (mm < 240) return { eu: "38", us: "6", uk: "5", jp: "24" };
  if (mm < 250) return { eu: "40", us: "7", uk: "6", jp: "25" };
  if (mm < 260) return { eu: "41", us: "8", uk: "7", jp: "26" };
  if (mm < 270) return { eu: "42", us: "9", uk: "8", jp: "27" };
  return { eu: "44", us: "10", uk: "9", jp: "28" };
}