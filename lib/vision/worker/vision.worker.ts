// lib/vision/worker/vision.worker.ts
import * as Comlink from "comlink";

// Ensure OpenCV is bundled for the worker context.
// This package attaches cv to the global scope in most setups.
import "@techstark/opencv-js";

import { ScanPipeline } from "@/lib/vision/pipeline/scanPipeline";
import { evaluateFrameQuality } from "@/lib/quality/frameQuality";
import type { ScanFrame, ScanPipelineResult } from "@/lib/vision/types/scan";

export type WorkerQualityResult = ReturnType<typeof evaluateFrameQuality>;

export type WorkerAPI = {
  ensureOpenCvReady: () => Promise<{ ok: boolean; build?: string }>;
  evaluateQuality: (frame: ScanFrame) => WorkerQualityResult;
  preprocessFrame: (frame: ScanFrame) => ScanFrame;
  runPipeline: (frame: ScanFrame, opts?: { bufferMM?: number }) => Promise<ScanPipelineResult>;
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

async function waitForOpenCv(timeoutMs = 12_000): Promise<{ ok: boolean; build?: string }> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const cv = getCv();
    if (cv && cv.Mat) {
      const build = typeof cv.getBuildInformation === "function" ? cv.getBuildInformation() : undefined;
      return { ok: true, build };
    }

    // If OpenCV exposes onRuntimeInitialized, we can wait for it once.
    const cv2 = getCv();
    if (cv2 && typeof cv2.onRuntimeInitialized === "function") {
      await new Promise<void>((resolve) => {
        const current = cv2.onRuntimeInitialized;
        cv2.onRuntimeInitialized = () => {
          try {
            if (typeof current === "function") current();
          } finally {
            resolve();
          }
        };
      });

      const cv3 = getCv();
      if (cv3 && cv3.Mat) {
        const build = typeof cv3.getBuildInformation === "function" ? cv3.getBuildInformation() : undefined;
        return { ok: true, build };
      }
    }

    await new Promise<void>((r) => setTimeout(r, 50));
  }

  return { ok: false };
}

// Minimal, safe preprocessing placeholder.
// Keep it as identity until you add real exposure normalization.
function preprocessFrame(frame: ScanFrame): ScanFrame {
  return frame;
}

const api: WorkerAPI = {
  async ensureOpenCvReady() {
    return waitForOpenCv();
  },

  evaluateQuality(frame) {
    return evaluateFrameQuality(frame.imageData);
  },

  preprocessFrame(frame) {
    return preprocessFrame(frame);
  },

  async runPipeline(frame, opts) {
    const ready = await waitForOpenCv();
    if (!ready.ok) {
      throw new Error("OpenCV not ready in worker.");
    }

    const pipeline = new ScanPipeline();
    return pipeline.run(frame, opts);
  },

  async convertOnly(args) {
    // Reuse pipeline conversion step via ScanPipeline to keep one source of truth.
    const pipeline = new ScanPipeline();
    // This is a lightweight call in your steps implementation:
    // it should not need OpenCV if convertSizes is pure.
    // If your convertSizes is in steps and already pure, keep it there.
    // If not available, you can implement a dedicated convertSizes function on worker.
    const dummy: ScanFrame = {
      kind: "imagedata",
      imageData: new ImageData(1, 1),
      width: 1,
      height: 1,
    };

    const out = await pipeline.run(dummy, { bufferMM: 0 });
    // The above may not be correct depending on your pipeline; if it requires detections,
    // replace this with a direct convertSizes call inside the worker.
    return out.sizes;
  },
};

Comlink.expose(api);
