"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ScanLine, ShoppingBag, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketplaceButton } from "@/components/ui/marketplace-button";
import { SearchBar } from "@/components/ui/search-bar";
import { SizeChips, type FootSizes } from "@/components/ui/size-chips";
import { ScanPanel, type ScanStep } from "@/components/ui/scan-panel";
import { Toast } from "@/components/ui/toast";
import { MARKETPLACES } from "@/lib/marketplaces";

type FlowState = "idle" | "scanning" | "done";

type ToastType = "success" | "error";
type ToastState = {
  open: boolean;
  type: ToastType;
  title: string;
  description?: string;
};

type TorchCapableTrack = MediaStreamTrack & {
  getCapabilities?: () => unknown;
  applyConstraints?: (constraints: MediaTrackConstraints) => Promise<void>;
};

function hasTorchCapability(caps: unknown): caps is { torch: boolean } {
  return !!caps && typeof caps === "object" && "torch" in (caps as object);
}

function getAudioContextCtor(): (new () => AudioContext) | undefined {
  const w = window as unknown as {
    AudioContext?: new () => AudioContext;
    webkitAudioContext?: new () => AudioContext;
  };
  return w.AudioContext ?? w.webkitAudioContext;
}

function playSuccessChime() {
  try {
    const Ctor = getAudioContextCtor();
    if (!Ctor) return;

    const ctx = new Ctor();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    master.connect(ctx.destination);

    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    o1.type = "sine";
    o2.type = "triangle";

    o1.frequency.setValueAtTime(880, now);
    o1.frequency.setValueAtTime(1174.66, now + 0.11);
    o2.frequency.setValueAtTime(587.33, now);
    o2.frequency.setValueAtTime(740, now + 0.11);

    const g1 = ctx.createGain();
    const g2 = ctx.createGain();
    g1.gain.setValueAtTime(0.9, now);
    g2.gain.setValueAtTime(0.35, now);

    o1.connect(g1);
    o2.connect(g2);
    g1.connect(master);
    g2.connect(master);

    o1.start(now);
    o2.start(now);
    o1.stop(now + 0.65);
    o2.stop(now + 0.65);

    window.setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, 900);
  } catch {
    // ignore
  }
}

export default function HomePage() {
  const [flow, setFlow] = React.useState<FlowState>("idle");
  const [sizes, setSizes] = React.useState<FootSizes | null>(null);
  const [query, setQuery] = React.useState("");

  const [prepOpen, setPrepOpen] = React.useState(false);

  const [scanOpen, setScanOpen] = React.useState(false);
  const [scanStep, setScanStep] = React.useState<ScanStep>("idle");
  const [scanProgress, setScanProgress] = React.useState(0);
  const [scanMessage, setScanMessage] = React.useState<string | undefined>();

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [torchSupported, setTorchSupported] = React.useState(false);
  const [torchOn, setTorchOn] = React.useState(false);

  const [cameraError, setCameraError] = React.useState<string | null>(null);

  const [toast, setToast] = React.useState<ToastState>({
    open: false,
    type: "success",
    title: "",
    description: "",
  });

  function showToast(next: Omit<ToastState, "open">) {
    setToast({ ...next, open: true });
  }

  function hideToast() {
    setToast((t) => ({ ...t, open: false }));
  }

  function getVideoTrack(): TorchCapableTrack | null {
    const s = streamRef.current;
    if (!s) return null;
    const t = s.getVideoTracks?.()[0] ?? null;
    return t as TorchCapableTrack | null;
  }

  async function detectTorchSupport(): Promise<boolean> {
    try {
      const track = getVideoTrack();
      if (!track?.getCapabilities) return false;
      const caps = track.getCapabilities();
      return hasTorchCapability(caps) && caps.torch === true;
    } catch {
      return false;
    }
  }

  async function setTorch(on: boolean): Promise<void> {
    try {
      const track = getVideoTrack();
      if (!track?.applyConstraints || !track.getCapabilities) {
        setTorchSupported(false);
        setTorchOn(false);
        return;
      }

      const caps = track.getCapabilities();
      if (!hasTorchCapability(caps) || caps.torch !== true) {
        setTorchSupported(false);
        setTorchOn(false);
        return;
      }

      await track.applyConstraints({
        advanced: [{ torch: on } as unknown as MediaTrackConstraintSet],
      });

      setTorchSupported(true);
      setTorchOn(on);
    } catch {
      setTorchSupported(false);
      setTorchOn(false);
    }
  }

  function stopCamera() {
    try {
      void setTorch(false);

      const s = streamRef.current;
      if (s) {
        s.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch {
      // no-op
    }
  }

  function resetScanUI() {
    setScanOpen(false);
    setScanStep("idle");
    setScanProgress(0);
    setScanMessage(undefined);
    setCameraError(null);
  }

  function closeScan() {
    stopCamera();
    resetScanUI();

    if (flow === "scanning" && !sizes) setFlow("idle");
  }

  async function startScan() {
    // reset previous
    setSizes(null);
    setFlow("scanning");

    setScanOpen(true);
    setScanStep("permission");
    setScanProgress(5);
    setScanMessage("Requesting camera access…");
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      const canTorch = await detectTorchSupport();
      setTorchSupported(canTorch);

      if (canTorch) {
        await setTorch(true);
        setScanMessage(
          "Torch enabled. Place your foot + any card with standard bank card size."
        );
      } else {
        setScanMessage("Place your foot + any card with standard bank card size.");
      }

      setScanStep("card");
      setScanProgress(25);

      window.setTimeout(() => {
        setScanStep("foot");
        setScanProgress(45);
        setScanMessage("Align your foot inside the frame.");
      }, 900);

      window.setTimeout(() => {
        setScanStep("steady");
        setScanProgress(65);
        setScanMessage("Hold still… scanning edges.");
      }, 1800);

      window.setTimeout(() => {
        setScanStep("measuring");
        setScanProgress(85);
        setScanMessage("Measuring… converting sizes.");
      }, 2800);

      window.setTimeout(() => {
        // ✅ IMPORTANT: mm is still stored (required by FootSizes type),
        // but you can hide it in the UI (SizeChips component).
        const result: FootSizes = {
          mm: 265,
          eu: "42",
          us: "9",
          uk: "8",
          jp: "26.5",
        };

        setSizes(result);
        setScanStep("done");
        setScanProgress(100);
        setScanMessage("Done. Your size is ready.");
        setFlow("done");

        playSuccessChime();
        showToast({
          type: "success",
          title: "Scan complete",
          description: `EU ${result.eu} • US ${result.us} • UK ${result.uk} • JP ${result.jp}`,
        });

        window.setTimeout(() => {
          stopCamera();
          resetScanUI();
        }, 900);
      }, 3800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to access camera.";

      setCameraError(msg);
      setScanStep("error");
      setScanProgress(0);
      setScanMessage("Camera permission was denied or unavailable.");

      showToast({
        type: "error",
        title: "Camera unavailable",
        description: "Please allow camera access and try again.",
      });

      stopCamera();
    }
  }

  function onScanClick() {
    if (flow === "scanning") return;
    setPrepOpen(true);
  }

  async function onGotIt() {
    setPrepOpen(false);
    await startScan();
  }

  const marketplacesEnabled = !!sizes && flow === "done";

  return (
    <>
      <Toast state={toast} onClose={hideToast} />

      <main className="mx-auto min-h-dvh max-w-md px-4 pb-8 pt-6">
        <header className="mb-5">
          <div className="ui-surface px-4 py-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">CaveCheck</p>
                <h1 className="text-xl font-semibold tracking-tight">
                  Perfect fit, instantly.
                </h1>
              </div>

              <button
                type="button"
                className="ui-surface-2 ui-tap flex h-11 w-11 items-center justify-center"
                aria-label="Account"
              >
                <span className="text-sm text-muted">👤</span>
              </button>
            </div>

            <div className="mt-4 ui-divider" />

            <p className="mt-4 text-sm text-muted">
              Scan with a standard-size reference card. We’ll show your converted
              size in EU/US/UK/JP and unlock marketplaces.
            </p>
          </div>
        </header>

        {/* Scan hero card */}
        <section className="mb-4">
          <div className="ui-surface overflow-hidden">
            <div className="relative h-56 bg-black/70">
              <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]" />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 backdrop-blur">
                  <p className="text-sm">
                    {sizes ? "Size captured." : "Ready when you are."}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {sizes ? "You can rescan anytime." : "Tap Start scan to begin."}
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-3">
                <Button
                  className="w-full"
                  size="lg"
                  leftIcon={<ScanLine className="h-5 w-5" />}
                  rightIcon={<ArrowRight className="h-5 w-5 opacity-80" />}
                  isLoading={flow === "scanning"}
                  onClick={onScanClick}
                >
                  {flow === "scanning" ? "Scanning…" : sizes ? "Rescan" : "Start scan"}
                </Button>
              </div>
            </div>

            <div className="px-4 py-4">
              {/* Note: SizeChips should render only EU/US/UK/JP (hide mm there) */}
              <SizeChips sizes={sizes} />
            </div>
          </div>
        </section>

        {/* Search */}
        <div className="mb-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={
              marketplacesEnabled
                ? "Search: running, hiking, Nike, Adidas…"
                : "Scan first to unlock search…"
            }
          />
          {!marketplacesEnabled && (
            <p className="mt-2 text-xs text-muted">
              Search and marketplace links unlock after you scan your foot.
            </p>
          )}
        </div>

        {/* Actions */}
        <section className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="w-full"
              variant="secondary"
              leftIcon={<ShoppingBag className="h-5 w-5" />}
              disabled={!marketplacesEnabled}
            >
              Shop
            </Button>

            <Button
              className="w-full"
              variant="secondary"
              leftIcon={<Tag className="h-5 w-5" />}
              disabled={!marketplacesEnabled}
            >
              Deals
            </Button>
          </div>
        </section>

        {/* Marketplaces */}
        <section className="mt-6">
          <div className="ui-surface px-4 py-4">
            <div>
              <h2 className="text-sm font-medium">Marketplaces</h2>
              <p className="mt-1 text-sm text-muted">
                Opens results filtered by your measured size.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {MARKETPLACES.map((m) => (
                <MarketplaceButton
                  key={m.id}
                  name={m.name}
                  enabled={marketplacesEnabled}
                  onClick={() => {
                    window.alert(
                      `Open ${m.name}\nEU size: ${sizes?.eu ?? "-"}\nQuery: ${
                        query || "(none)"
                      }`
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Prep modal */}
        <Dialog.Root open={prepOpen} onOpenChange={setPrepOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 ui-surface px-5 py-5 shadow-soft outline-none">
              <Dialog.Title className="text-base font-semibold tracking-tight">
                Before you scan
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted">
                You’ll need:
              </Dialog.Description>

              <div className="mt-4 space-y-3">
                <div className="ui-surface-2 px-3 py-3">
                  <p className="text-sm font-medium">A standard-size card</p>
                  <p className="mt-1 text-xs text-muted">
                    Any card with standard bank card size works as reference.
                  </p>
                </div>

                <div className="ui-surface-2 px-3 py-3">
                  <p className="text-sm font-medium">Good lighting</p>
                  <p className="mt-1 text-xs text-muted">
                    Torch will be enabled automatically if supported.
                  </p>
                </div>

                <div className="ui-surface-2 px-3 py-3">
                  <p className="text-sm font-medium">Flat surface</p>
                  <p className="mt-1 text-xs text-muted">
                    Keep your foot and the card on the same plane.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setPrepOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="w-full" onClick={onGotIt}>
                  Got it
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Scan panel */}
        <ScanPanel
          open={scanOpen}
          step={scanStep}
          progress={scanProgress}
          message={scanMessage}
          cameraError={cameraError}
          videoRef={videoRef}
          onClose={closeScan}
          torchSupported={torchSupported}
          torchOn={torchOn}
          onToggleTorch={() => {
            void setTorch(!torchOn);
          }}
        />
      </main>
    </>
  );
}
