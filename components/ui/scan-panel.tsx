"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Info,
  Flashlight,
  FlashlightOff,
  CheckCircle2,
  AlertTriangle,
  Camera,
  CreditCard,
  Footprints,
} from "lucide-react";

export type ScanStep =
  | "idle"
  | "permission"
  | "card"
  | "foot"
  | "steady"
  | "measuring"
  | "done"
  | "error";

type Props = {
  open: boolean;
  step: ScanStep;
  progress: number; // 0..100
  message?: string;
  cameraError?: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onClose: () => void;

  // NEW (torch UI)
  torchSupported?: boolean;
  torchOn?: boolean;
  onToggleTorch?: () => void;
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function stepTitle(step: ScanStep): string {
  switch (step) {
    case "permission":
      return "Camera permission";
    case "card":
      return "Reference card";
    case "foot":
      return "Foot alignment";
    case "steady":
      return "Hold still";
    case "measuring":
      return "Measuring";
    case "done":
      return "Done";
    case "error":
      return "Camera error";
    default:
      return "Ready";
  }
}

function stepIcon(step: ScanStep) {
  switch (step) {
    case "permission":
      return <Camera className="h-4 w-4" />;
    case "card":
      return <CreditCard className="h-4 w-4" />;
    case "foot":
      return <Footprints className="h-4 w-4" />;
    case "done":
      return <CheckCircle2 className="h-4 w-4" />;
    case "error":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Camera className="h-4 w-4" />;
  }
}

export function ScanPanel({
  open,
  step,
  progress,
  message,
  cameraError,
  videoRef,
  onClose,
  torchSupported = false,
  torchOn = false,
  onToggleTorch,
}: Props) {
  const [helpOpen, setHelpOpen] = React.useState(false);
  const pct = clamp(progress);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(94vw,520px)] -translate-x-1/2 -translate-y-1/2 ui-surface p-3 shadow-soft outline-none">
        <Dialog.Title className="sr-only">
  Foot scanning camera
</Dialog.Title>
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 px-2 pb-2">
            <div className="flex items-center gap-2">
              <div className="ui-surface-2 flex h-9 w-9 items-center justify-center">
                {stepIcon(step)}
              </div>
              <div>
                <p className="text-sm font-medium">{stepTitle(step)}</p>
                <p className="text-xs text-muted">
                  {message ?? "Follow the steps to scan accurately."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Help (minimal) */}
              <button
                type="button"
                className="ui-surface-2 ui-tap flex h-9 w-9 items-center justify-center"
                aria-label="Help"
                onClick={() => setHelpOpen(true)}
              >
                <Info className="h-4 w-4" />
              </button>

              {/* Torch toggle (only if supported) */}
              {torchSupported && (
                <button
                  type="button"
                  className="ui-surface-2 ui-tap flex h-9 w-9 items-center justify-center"
                  aria-label={torchOn ? "Turn torch off" : "Turn torch on"}
                  onClick={onToggleTorch}
                >
                  {torchOn ? (
                    <FlashlightOff className="h-4 w-4" />
                  ) : (
                    <Flashlight className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* Close */}
              <button
                type="button"
                className="ui-surface-2 ui-tap flex h-9 w-9 items-center justify-center"
                aria-label="Close"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Video area */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
            <video
              ref={videoRef as React.RefObject<HTMLVideoElement>}
              className="block h-[320px] w-full object-cover"
              playsInline
              muted
              autoPlay
            />

            {/* Overlay grid + reticle (minimal) */}
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-44 w-72 rounded-3xl border border-white/15 bg-black/10 backdrop-blur-sm" />
            </div>

            {/* Error badge */}
            {step === "error" && (
              <div className="absolute inset-x-3 bottom-3 ui-surface-2 px-3 py-2">
                <p className="text-sm font-medium">Camera error</p>
                <p className="mt-1 text-xs text-muted">
                  {cameraError ?? "Unable to access the camera."}
                </p>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="px-2 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">Progress</p>
              <p className="text-xs text-muted tabular-nums">{pct}%</p>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white/60 transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Tiny hint line (only when scanning) */}
            {step !== "done" && step !== "error" && (
              <p className="mt-2 text-xs text-muted">
                Keep the card and your foot on the same flat surface.
              </p>
            )}
          </div>

          {/* Help mini sheet (Dialog inside) */}
          <Dialog.Root open={helpOpen} onOpenChange={setHelpOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/55 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 ui-surface px-5 py-5 shadow-soft outline-none">
                <Dialog.Title className="text-base font-semibold tracking-tight">
                  Quick tips
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-muted">
                  For best accuracy:
                </Dialog.Description>

                <div className="mt-4 space-y-3">
                  <div className="ui-surface-2 px-3 py-3">
                    <p className="text-sm font-medium">Use a standard-size card</p>
                    <p className="mt-1 text-xs text-muted">
                      Any card with standard bank card size works as reference.
                    </p>
                  </div>
                  <div className="ui-surface-2 px-3 py-3">
                    <p className="text-sm font-medium">Avoid shadows</p>
                    <p className="mt-1 text-xs text-muted">
                      Use good lighting. Torch can help if supported.
                    </p>
                  </div>
                  <div className="ui-surface-2 px-3 py-3">
                    <p className="text-sm font-medium">Hold still</p>
                    <p className="mt-1 text-xs text-muted">
                      Keep the phone steady for a clean edge scan.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    className="ui-surface-2 ui-tap w-full px-4 py-3 text-sm font-medium"
                    onClick={() => setHelpOpen(false)}
                  >
                    Got it
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
