// lib/vision/worker/vision.worker.ts
import * as Comlink from "comlink";

import { ScanPipeline } from "@/lib/vision/pipeline/scanPipeline";
import { evaluateFrameQuality } from "@/lib/quality/frameQuality";
import type { ScanFrame, ScanPipelineResult, ConvertedSizes } from "@/lib/vision/types/scan";
import { convertSizes } from "@/lib/vision/pipeline/steps";

export type WorkerQualityResult = ReturnType<typeof evaluateFrameQuality>;

export type WorkerAPI = {
  evaluateQuality: (frame: ScanFrame) => WorkerQualityResult;
  runPipeline: (frame: ScanFrame, opts?: { bufferMM?: number }) => Promise<ScanPipelineResult>;

  // Commercial pack additions
  preprocessFrame: (frame: ScanFrame, opts?: { targetMean?: number; maxGain?: number }) => ScanFrame;
  convertOnly: (input: { lengthMMBuffered: number }) => Promise<ConvertedSizes>;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function computeMeanLuma(img: ImageData): number {
  const { data } = img;
  const step = 4 * 6; // sample every ~6 pixels
  let sum = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += step) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += y;
    count += 1;
  }

  return count ? sum / count : 0;
}

/**
 * Lightweight brightness normalization:
 * - compute mean luma (sampled)
 * - apply gain with a safe clamp
 * This helps in dim rooms and overly bright lighting.
 */
function normalizeBrightness(img: ImageData, targetMean = 128, maxGain = 1.8): ImageData {
  const mean = computeMeanLuma(img);
  if (!Number.isFinite(mean) || mean <= 1) return img;

  const gain = clamp(targetMean / mean, 0.6, maxGain);
  if (Math.abs(gain - 1) < 0.06) return img; // skip tiny changes

  const out = new ImageData(img.width, img.height);
  const src = img.data;
  const dst = out.data;

  for (let i = 0; i < src.length; i += 4) {
    dst[i] = clamp(Math.round((src[i] ?? 0) * gain), 0, 255);
    dst[i + 1] = clamp(Math.round((src[i + 1] ?? 0) * gain), 0, 255);
    dst[i + 2] = clamp(Math.round((src[i + 2] ?? 0) * gain), 0, 255);
    dst[i + 3] = src[i + 3] ?? 255;
  }

  return out;
}

const api: WorkerAPI = {
  evaluateQuality(frame) {
    return evaluateFrameQuality(frame.imageData);
  },

  preprocessFrame(frame, opts) {
    const targetMean = opts?.targetMean ?? 128;
    const maxGain = opts?.maxGain ?? 1.8;

    const normalized = normalizeBrightness(frame.imageData, targetMean, maxGain);

    return {
      ...frame,
      imageData: normalized,
    };
  },

  async runPipeline(frame, opts) {
    const pipeline = new ScanPipeline();
    return pipeline.run(frame, opts);
  },

  async convertOnly(input) {
    return convertSizes({ lengthMMBuffered: input.lengthMMBuffered });
  },
};

Comlink.expose(api);

