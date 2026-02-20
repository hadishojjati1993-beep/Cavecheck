// lib/vision/pipeline/runner.ts
import { captureFrameFromVideo } from "../utils/captureFrame";
import { getVisionWorker } from "@/lib/vision/worker/client";

import type { ScanFrame, ScanPipelineResult } from "@/lib/vision/types/scan";
import type { FrameQuality } from "@/lib/quality/frameQuality";
import { computeStabilityScore } from "@/lib/quality/stability";

export type RunnerState =
  | "warming-up"
  | "detecting-card"
  | "detecting-foot"
  | "measuring"
  | "converting";

export type RunnerProgressCb = (
  state: RunnerState,
  progress: number,
  message?: string
) => void;

export type RunnerOptions = {
  fps?: number;
  maxMs?: number;
  bufferMM?: number;
  minGoodFrames?: number;
};

export type RunnerResult = {
  measurement: {
    lengthMM: number;
    widthMM: number;
    lengthMMBuffered: number;
    widthMMBuffered: number;
    bufferMM: number;
  };
  sizes: {
    eu: string;
    us: string;
    uk: string;
    jp: string;
  };
  debug: {
    totalFrames: number;
    usableFrames: number;
    stableFrames: number;
    samplesUsed: number;
    bestFrameQuality?: FrameQuality;
    bestStability?: number;
    bestMotion?: number;
    cardRejects: number;
    lastErrorHint?: string;
  };
};

const STABILITY_THRESHOLD = 0.74;
const MOTION_THRESHOLD = 14.5;

// Measurement sanity (wide bounds, still protective)
const LENGTH_MM_MIN = 180;
const LENGTH_MM_MAX = 340;

// Scale sanity (mm/px); keep wide, tune later with real devices
const MMPERPX_MIN = 0.05;
const MMPERPX_MAX = 0.45;

// Require consecutive stable frames before running pipeline
const REQUIRED_STABLE_STREAK = 3;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function normalizeProgress(p: number) {
  if (!Number.isFinite(p)) return 0;
  return clamp(p, 0, 100);
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function median(values: number[]) {
  const arr = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (arr.length === 0) return NaN;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid]! : (arr[mid - 1]! + arr[mid]!) / 2;
}

function isCardOrScaleError(msg: string) {
  const m = msg.toLowerCase();
  return (
    m.includes("reference card") ||
    m.includes("reposition card") ||
    m.includes("scale") ||
    m.includes("mmperpx") ||
    m.includes("move closer") ||
    m.includes("out of range")
  );
}

function isFootError(msg: string) {
  const m = msg.toLowerCase();
  return m.includes("foot") || m.includes("contour");
}

function safeMessage(e: unknown) {
  if (e instanceof Error && typeof e.message === "string") return e.message;
  return "Unknown error";
}

function measurementLooksSane(out: ScanPipelineResult) {
  const m = out.measurement;
  if (!Number.isFinite(m.lengthMM) || !Number.isFinite(m.widthMM)) return false;
  if (!Number.isFinite(m.lengthMMBuffered) || !Number.isFinite(m.widthMMBuffered)) return false;
  if (!Number.isFinite(m.mmPerPx)) return false;

  if (m.lengthMMBuffered < LENGTH_MM_MIN || m.lengthMMBuffered > LENGTH_MM_MAX) return false;
  if (m.mmPerPx < MMPERPX_MIN || m.mmPerPx > MMPERPX_MAX) return false;

  return true;
}

export async function runPipelineFromVideo(
  videoEl: HTMLVideoElement,
  onProgress: RunnerProgressCb,
  opts: RunnerOptions = {}
): Promise<RunnerResult> {
  const worker = await getVisionWorker();

  const fps = opts.fps ?? 6;
  const maxMs = opts.maxMs ?? 12_000;
  const bufferMM = opts.bufferMM ?? 2;
  const minGoodFrames = opts.minGoodFrames ?? 5;

  const frameIntervalMs = Math.max(120, Math.round(1000 / Math.max(1, fps)));
  const start = performance.now();

  let totalFrames = 0;
  let usableFrames = 0;

  let stableStreak = 0;
  let prevSig: Uint8Array | undefined;

  let bestQuality: FrameQuality | undefined;
  let bestStability = 0;
  let bestMotion = 999;

  let cardRejects = 0;
  let lastErrorHint: string | undefined;

  const lengthSamples: number[] = [];
  const widthSamples: number[] = [];

  onProgress("warming-up", 2, "Initializing vision engine...");

  while (performance.now() - start < maxMs) {
    totalFrames += 1;

    // 1) Capture
    const rawFrame: ScanFrame = captureFrameFromVideo(videoEl);

    // 2) Preprocess
    const frame = await worker.preprocessFrame(rawFrame);

    // 3) Quality
    const q = await worker.evaluateQuality(frame);
    if (q.usable) usableFrames += 1;

    // 4) Stability (motion rejection)
    const stab = computeStabilityScore({
      img: frame.imageData,
      quality: q,
      prevSignature: prevSig,
    });

    prevSig = stab.signature;

    if (!bestQuality || q.sharpness > bestQuality.sharpness) bestQuality = q;
    if (stab.stability > bestStability) bestStability = stab.stability;
    if (stab.motion < bestMotion) bestMotion = stab.motion;

    const stabilityOk = stab.stability >= STABILITY_THRESHOLD;
    const motionOk = stab.motion <= MOTION_THRESHOLD;

    if (q.usable && stabilityOk && motionOk) {
      stableStreak += 1;
    } else {
      stableStreak = 0;
    }

    // Warm-up UX (until we have samples)
    if (lengthSamples.length === 0) {
      const warmTarget = 55;
      const p = normalizeProgress((usableFrames / minGoodFrames) * warmTarget);

      const msg =
        !q.usable
          ? "Improve lighting..."
          : stableStreak === 0
          ? "Hold still... stabilizing..."
          : `Stabilizing... (${stableStreak}/${REQUIRED_STABLE_STREAK})`;

      onProgress("warming-up", p, msg);
    }

    // Require stable streak before heavy work
    if (stableStreak < REQUIRED_STABLE_STREAK) {
      await sleep(frameIntervalMs);
      continue;
    }

    // 5) Run pipeline only on stable frames
    try {
      onProgress("detecting-card", 60, "Detecting reference card...");

      const out: ScanPipelineResult = await worker.runPipeline(frame, { bufferMM });

      // Hard gates (card/scale/measurement sanity)
      if (!measurementLooksSane(out)) {
        cardRejects += 1;
        lastErrorHint = "Scale/card confidence too low";
        onProgress("detecting-card", 62, "Reposition card and try again...");
        await sleep(frameIntervalMs);
        continue;
      }

      const m = out.measurement;

      lengthSamples.push(m.lengthMM);
      widthSamples.push(m.widthMM);

      onProgress("measuring", 86, "Accumulating measurements...");

      if (lengthSamples.length >= minGoodFrames) {
        break;
      }
    } catch (e) {
      const msg = safeMessage(e);

      if (isCardOrScaleError(msg)) {
        cardRejects += 1;
        lastErrorHint = msg;
        onProgress("detecting-card", 62, "Reposition card and try again...");
      } else if (isFootError(msg)) {
        lastErrorHint = msg;
        onProgress("detecting-foot", 70, "Reposition foot and keep it fully visible...");
      } else {
        lastErrorHint = msg;
        onProgress("warming-up", 40, "Adjust lighting and keep still...");
      }

      await sleep(frameIntervalMs);
      continue;
    }

    await sleep(frameIntervalMs);
  }

  if (lengthSamples.length === 0) {
    throw new Error("Reliable measurement not achieved.");
  }

  // Median fusion
  const lengthMM = median(lengthSamples);
  const widthMM = median(widthSamples);

  if (!Number.isFinite(lengthMM) || !Number.isFinite(widthMM)) {
    throw new Error("Measurement fusion failed.");
  }

  const lengthMMBuffered = lengthMM + bufferMM;
  const widthMMBuffered = widthMM + bufferMM;

  onProgress("converting", 95, "Finalizing sizes...");

  const sizes = await worker.convertOnly({ lengthMMBuffered });

  return {
    measurement: {
      lengthMM,
      widthMM,
      lengthMMBuffered,
      widthMMBuffered,
      bufferMM,
    },
    sizes,
    debug: {
      totalFrames,
      usableFrames,
      stableFrames: stableStreak,
      samplesUsed: lengthSamples.length,
      bestFrameQuality: bestQuality,
      bestStability,
      bestMotion,
      cardRejects,
      lastErrorHint,
    },
  };
}

