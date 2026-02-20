// lib/vision/worker/client.ts
import * as Comlink from "comlink";
import type { WorkerAPI } from "./vision.worker";

let singleton: Comlink.Remote<WorkerAPI> | null = null;

export function getVisionWorker() {
  if (singleton) return singleton;

  const worker = new Worker(new URL("./vision.worker.ts", import.meta.url), {
    type: "module",
  });

  singleton = Comlink.wrap<WorkerAPI>(worker);
  return singleton;
}