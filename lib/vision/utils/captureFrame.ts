// lib/vision/utils/captureFrame.ts
import type { ScanFrame } from "@/lib/vision/types/scan";

/**
 * Reusable canvas to avoid allocation on every frame.
 * This significantly improves mobile performance.
 */
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

export function captureFrameFromVideo(video: HTMLVideoElement): ScanFrame {
  // videoWidth/videoHeight may initially be 0 before metadata loads
  const width = Math.max(1, video.videoWidth || 1280);
  const height = Math.max(1, video.videoHeight || 720);

  if (!canvas) {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d", { willReadFrequently: true });
  }

  if (!canvas || !ctx) {
    throw new Error("Canvas 2D context not available.");
  }

  // Resize canvas only when dimensions change
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  // Draw current video frame
  ctx.drawImage(video, 0, 0, width, height);

  // Extract pixel data
  const imageData = ctx.getImageData(0, 0, width, height);

  return {
    kind: "imagedata",
    imageData,
    width,
    height,
  };
}