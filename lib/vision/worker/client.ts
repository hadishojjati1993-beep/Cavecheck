// lib/vision/worker/client.ts
import * as Comlink from "comlink";
import type { WorkerAPI } from "./vision.worker";

let singleton: Comlink.Remote<WorkerAPI> | null = null;
let workerInstance: Worker | null = null;

function createWorker(): Worker {
  return new Worker(new URL("./vision.worker.ts", import.meta.url), {
    type: "module",
  });
}

/**
 * Returns a singleton Comlink remote for the vision worker.
 * - Keeps a reference to the Worker instance so we can terminate/reset if needed.
 * - Safe to call multiple times.
 */
export function getVisionWorker(): Comlink.Remote<WorkerAPI> {
  if (singleton && workerInstance) return singleton;

  workerInstance = createWorker();

  // Optional: log worker errors in dev; does not crash the app
  workerInstance.addEventListener("error", (e) => {
    // If the worker crashes, allow recreation on next getVisionWorker() call
    singleton = null;
    workerInstance = null;

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[vision-worker] error:", e);
    }
  });

  workerInstance.addEventListener("messageerror", (e) => {
    singleton = null;
    workerInstance = null;

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[vision-worker] messageerror:", e);
    }
  });

  singleton = Comlink.wrap<WorkerAPI>(workerInstance);
  return singleton;
}

/**
 * Terminates the current worker and clears the singleton.
 * Useful for recovery paths (Safari/iOS), memory pressure, or manual reset.
 */
export function resetVisionWorker(): void {
  try {
    workerInstance?.terminate();
  } finally {
    workerInstance = null;
    singleton = null;
  }
}