// lib/vision/worker/vision.worker.ts
import * as Comlink from "comlink";

// Ensure OpenCV is bundled for the worker context.
import "@techstark/opencv-js";

import { ScanPipeline } from "@/lib/vision/pipeline/scanPipeline";
import { evaluateFrameQuality } from "@/lib/quality/frameQuality";
import type { ScanFrame, ScanPipelineResult } from "@/lib/vision/types/scan";

// Use your standard chart for fast conversion (no OpenCV, no pipeline).
import { STANDARD_UNISEX_CHART } from "@/lib/sizing/brandcharts/common";

export type WorkerQualityResult = ReturnType<typeof evaluateFrameQuality>;

export type WorkerAPI = {
  ensureOpenCvReady: () => Promise<{ ok: boolean; build?: string }>;
  evaluateQuality: (frame: ScanFrame) => WorkerQualityResult;
  preprocessFrame: (frame: ScanFrame) => ScanFrame;
  runPipeline: (
    frame: ScanFrame,
    opts?: { bufferMM?: number }
  ) => Promise<ScanPipelineResult>;
  convertOnly: (args: { lengthMMBuffered: number }) => Promise<ScanPipelineResult["sizes"]>;
};

type CvLike = {
  Mat?: unknown;
  getBuildInformation?: () => string;
  onRuntimeInitialized?: (() => void) | null;
};

function getCv(): CvLike | null {
  const g = globalThis as unknown as { cv?: unknown };
  if (!g.cv || typeof g.cv !== "object") return null;
  return g.cv as CvLike;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// Cache readiness so we don't re-wait on every call.
let openCvReadyPromise: Promise<{ ok: boolean; build?: string }> | null = null;

async function waitForOpenCv(timeoutMs = 12_000): Promise<{ ok: boolean; build?: string }> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const cv = getCv();
    if (cv && cv.Mat) {
      const build =
        typeof cv.getBuildInformation === "function" ? cv.getBuildInformation() : undefined;
      return { ok: true, build };
    }

    // If OpenCV exposes onRuntimeInitialized, wait once.
    const cv2 = getCv();
    if (cv2 && typeof cv2.onRuntimeInitialized === "function") {
      await new Promise<void>((resolve) => {
        const prev = cv2.onRuntimeInitialized;
        cv2.onRuntimeInitialized = () => {
          try {
            if (typeof prev === "function") prev();
          } finally {
            resolve();
          }
        };
      });

      const cv3 = getCv();
      if (cv3 && cv3.Mat) {
        const build =
          typeof cv3.getBuildInformation === "function" ? cv3.getBuildInformation() : undefined;
        return { ok: true, build };
      }
    }

    await sleep(50);
  }

  return { ok: false };
}

function ensureOpenCvReadyCached(): Promise<{ ok: boolean; build?: string }> {
  if (!openCvReadyPromise) {
    openCvReadyPromise = waitForOpenCv();
  }
  return openCvReadyPromise;
}

// Minimal preprocessing placeholder.
function preprocessFrame(frame: ScanFrame): ScanFrame {
  return frame;
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function nearestStandardRow(mm: number) {
  const rows = STANDARD_UNISEX_CHART.rows;
  let best = rows[0]!;
  let bestD = Math.abs(best.mm - mm);

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]!;
    const d = Math.abs(r.mm - mm);
    if (d < bestD) {
      best = r;
      bestD = d;
    }
  }

  return best;
}

function convertFromStandard(lengthMMBuffered: number): ScanPipelineResult["sizes"] {
  const mm = Number(lengthMMBuffered);

  if (!Number.isFinite(mm) || mm <= 0) {
    return { eu: "", us: "", uk: "", jp: "" };
  }

  const row = nearestStandardRow(mm);

  return {
    eu: toStr(row.eu),
    us: toStr(row.us),
    uk: toStr(row.uk),
    jp: toStr(row.jp ?? ""),
  };
}

const api: WorkerAPI = {
  async ensureOpenCvReady() {
    return ensureOpenCvReadyCached();
  },

  evaluateQuality(frame) {
    return evaluateFrameQuality(frame.imageData);
  },

  preprocessFrame(frame) {
    return preprocessFrame(frame);
  },

  async runPipeline(frame, opts) {
    const ready = await ensureOpenCvReadyCached();
    if (!ready.ok) {
      throw new Error("OpenCV not ready in worker.");
    }

    const pipeline = new ScanPipeline();
    return pipeline.run(frame, opts);
  },

  async convertOnly(args) {
    // Pure conversion: fast, deterministic, no OpenCV, no pipeline.
    return convertFromStandard(args.lengthMMBuffered);
  },
};

Comlink.expose(api);
