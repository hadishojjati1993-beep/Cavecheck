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

  // Commercial knobs (optional)
  minStableConsecutive?: number; // default 2
  minStability?: number; // default 0.62 (adaptive)
  maxMotion?: number; // default 18 (adaptive)

  // Fallback behavior
  fallbackAfterMs?: number; // default 5500 (try best frame once)
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
    lastFailure?: string;
    usedFallback?: boolean;
  };
};

type Candidate = {
  frame: ScanFrame;
  quality: FrameQuality;
  stability: number;
  motion: number;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function median(values: number[]) {
  const s = [...values].filter(Number.isFinite).sort((a, b) => a - b);
  if (!s.length) return NaN;
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

function normalizeProgress(p: number) {
  if (!Number.isFinite(p)) return 0;
  return clamp(p, 0, 100);
}

function nowMs() {
  // safer in case of edge envs
  // (but this pipeline should run in browser)
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

function isDebugEnabled() {
  try {
    const search = globalThis.location?.search ?? "";
    return new URLSearchParams(search).get("debug") === "1";
  } catch {
    return false;
  }
}

function isIOS() {
  try {
    const ua = globalThis.navigator?.userAgent ?? "";
    return /iPhone|iPad|iPod/i.test(ua);
  } catch {
    return false;
  }
}

function toUserHintFromErrorMessage(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("opencv not ready"))
    return "Vision engine is still loading. Please wait and try again.";
  if (m.includes("reference card"))
    return "Reposition the reference card and try again.";
  if (m.includes("scale")) return "Move closer and reposition the card.";
  if (m.includes("foot"))
    return "Reposition your foot and ensure it is fully visible.";
  if (m.includes("lighting"))
    return "Improve lighting and reduce shadows.";
  return "Try again with better lighting and a visible reference card.";
}

export async function runPipelineFromVideo(
  videoEl: HTMLVideoElement,
  onProgress: RunnerProgressCb,
  opts: RunnerOptions = {}
): Promise<RunnerResult> {
  const worker = await getVisionWorker();

  const fps = opts.fps ?? 6;
  const maxMs = opts.maxMs ?? 16_000;
  const bufferMM = opts.bufferMM ?? 2;
  const minGoodFrames = opts.minGoodFrames ?? 5;

  const minStableConsecutive = opts.minStableConsecutive ?? 2;

  // Device-aware baselines (iOS generally noisier)
  const ios = isIOS();
  const baseMinStability = opts.minStability ?? (ios ? 0.48 : 0.62);
  const baseMaxMotion = opts.maxMotion ?? (ios ? 24 : 18);

  // If user never reaches stable streak, try best frame once after this time
  const fallbackAfterMs = opts.fallbackAfterMs ?? 5500;

  const frameIntervalMs = Math.max(120, Math.round(1000 / Math.max(1, fps)));
  const start = nowMs();
  const debug = isDebugEnabled();

  let totalFrames = 0;
  let usableFrames = 0;

  let stableFrames = 0;
  let prevSig: Uint8Array | undefined;

  let bestQuality: FrameQuality | undefined;
  let bestStability = 0;
  let bestMotion = 999;

  const lengthSamples: number[] = [];
  const widthSamples: number[] = [];

  let lastFailure: string | undefined;
  let usedFallback = false;

  // Track best candidate frame for fallback attempt
  let bestCandidate: Candidate | undefined;

  // --- Worker / OpenCV readiness gate (critical for mobile) ---
  onProgress("warming-up", 2, "Loading vision engine...");

  try {
    const ensure = (worker as unknown as { ensureOpenCvReady?: () => Promise<{ ok?: boolean }> })
      .ensureOpenCvReady;

    if (typeof ensure === "function") {
      const health = await ensure();
      if (!health || health.ok !== true) {
        throw new Error("OpenCV not ready in worker.");
      }
    }
    // If method does not exist, continue (backwards compatible)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "OpenCV not ready in worker.";
    throw new Error(toUserHintFromErrorMessage(msg));
  }

  onProgress("warming-up", 6, "Initializing camera pipeline...");

  while (nowMs() - start < maxMs) {
    totalFrames += 1;
    const elapsed = nowMs() - start;

    // Adaptive thresholds: slowly relax if we're stuck
    const relax = clamp((elapsed - 2500) / 6000, 0, 1); // starts after ~2.5s, max by ~8.5s
    const minStability = clamp(baseMinStability - 0.18 * relax, 0.25, 0.9);
    const maxMotion = clamp(baseMaxMotion + 10 * relax, 12, 40);

    // 1) Capture
    const rawFrame: ScanFrame = captureFrameFromVideo(videoEl);

    // 2) Preprocess
    const frame = await worker.preprocessFrame(rawFrame);

    // 3) Quality
    const q = await worker.evaluateQuality(frame);
    if (q.usable) usableFrames += 1;

    // 4) Stability scoring
    const stab = computeStabilityScore({
      img: frame.imageData,
      quality: q,
      prevSignature: prevSig,
      options: {
        motionClamp: ios ? 32 : 22,
      },
    });

    prevSig = stab.signature;

    const stabilityOk = stab.stability >= minStability;
    const motionOk = stab.motion <= maxMotion;

    if (q.usable && stabilityOk && motionOk) {
      stableFrames += 1;
    } else {
      stableFrames = Math.max(0, stableFrames - 1);
    }

    if (!bestQuality || q.sharpness > bestQuality.sharpness) bestQuality = q;
    if (stab.stability > bestStability) bestStability = stab.stability;
    if (stab.motion < bestMotion) bestMotion = stab.motion;

    // Update bestCandidate (for fallback)
    const candidateScore =
      stab.stability * 1.2 + (q.usable ? 0.25 : 0) - stab.motion * 0.01;
    const bestScore = bestCandidate
      ? bestCandidate.stability * 1.2 +
        (bestCandidate.quality.usable ? 0.25 : 0) -
        bestCandidate.motion * 0.01
      : -Infinity;

    if (!bestCandidate || candidateScore > bestScore) {
      bestCandidate = {
        frame,
        quality: q,
        stability: stab.stability,
        motion: stab.motion,
      };
    }

    // Warm-up UX
    if (lengthSamples.length === 0) {
      const warmTarget = 55;
      const p = normalizeProgress(
        (usableFrames / Math.max(1, minGoodFrames)) * warmTarget
      );

      let msg = "Hold still... stabilizing...";
      if (!q.usable) msg = "Improve lighting...";
      else if (stableFrames > 0)
        msg = `Stabilizing... (${stableFrames}/${minStableConsecutive})`;

      if (debug) {
        msg += ` | st=${stab.stability.toFixed(2)} mo=${stab.motion.toFixed(
          1
        )} sh=${q.sharpness.toFixed(1)} thr(st>=${minStability.toFixed(
          2
        )}, mo<=${maxMotion.toFixed(1)})`;
      }

      onProgress("warming-up", p, msg);
    }

    // Fallback attempt: try pipeline once with bestCandidate after some time
    if (!usedFallback && elapsed >= fallbackAfterMs && bestCandidate) {
      usedFallback = true;

      try {
        onProgress("detecting-card", 60, "Detecting reference card...");
        const out: ScanPipelineResult = await worker.runPipeline(
          bestCandidate.frame,
          { bufferMM }
        );

        const m = out.measurement;
        const mmPerPx = Number(m.mmPerPx);
        const lenB = Number(m.lengthMMBuffered);
        const widB = Number(m.widthMMBuffered);

        // Sanity checks (wide bounds)
        const scaleOk =
          Number.isFinite(mmPerPx) && mmPerPx >= 0.02 && mmPerPx <= 0.45;
        const lenOk = Number.isFinite(lenB) && lenB >= 170 && lenB <= 360;
        const widOk = Number.isFinite(widB) && widB >= 50 && widB <= 155;

        if (scaleOk && lenOk && widOk) {
          lengthSamples.push(Number(m.lengthMM));
          widthSamples.push(Number(m.widthMM));
          onProgress(
            "measuring",
            86,
            `Accumulating measurements... (${lengthSamples.length}/${minGoodFrames})`
          );
        } else {
          lastFailure = "Sanity check rejected (fallback)";
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Pipeline failed";
        lastFailure = msg;
        onProgress("detecting-card", 62, toUserHintFromErrorMessage(msg));
      }
    }

    // Require consecutive stable frames before heavy pipeline (normal path)
    if (stableFrames < minStableConsecutive) {
      await sleep(frameIntervalMs);
      continue;
    }

    // 5) Pipeline
    try {
      onProgress("detecting-card", 60, "Detecting reference card...");

      const out: ScanPipelineResult = await worker.runPipeline(frame, {
        bufferMM,
      });
      const m = out.measurement;

      const mmPerPx = Number(m.mmPerPx);
      const lenB = Number(m.lengthMMBuffered);
      const widB = Number(m.widthMMBuffered);

      const scaleOk =
        Number.isFinite(mmPerPx) && mmPerPx >= 0.02 && mmPerPx <= 0.45;
      const lenOk = Number.isFinite(lenB) && lenB >= 170 && lenB <= 360;
      const widOk = Number.isFinite(widB) && widB >= 50 && widB <= 155;

      if (!scaleOk || !lenOk || !widOk) {
        lastFailure = "Sanity check rejected (scale/size out of range)";
        await sleep(frameIntervalMs);
        continue;
      }

      lengthSamples.push(Number(m.lengthMM));
      widthSamples.push(Number(m.widthMM));

      onProgress(
        "measuring",
        86,
        `Accumulating measurements... (${lengthSamples.length}/${minGoodFrames})`
      );

      if (lengthSamples.length >= minGoodFrames) break;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Pipeline failed";
      lastFailure = msg;

      onProgress("detecting-card", 62, toUserHintFromErrorMessage(msg));
      await sleep(frameIntervalMs);
      continue;
    }

    await sleep(frameIntervalMs);
  }

  if (!lengthSamples.length) {
    const hint = lastFailure
      ? toUserHintFromErrorMessage(lastFailure)
      : "Try again with better lighting and a visible reference card.";
    throw new Error(hint);
  }

  const lengthMM = median(lengthSamples);
  const widthMM = median(widthSamples);

  if (!Number.isFinite(lengthMM) || !Number.isFinite(widthMM)) {
    throw new Error(
      "Measurement unstable. Try again with better lighting and hold still."
    );
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
      stableFrames,
      samplesUsed: lengthSamples.length,
      bestFrameQuality: bestQuality,
      bestStability,
      bestMotion,
      lastFailure,
      usedFallback,
    },
  };
}
