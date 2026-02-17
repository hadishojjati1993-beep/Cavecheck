"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

type ToastType = "success" | "error";

type ToastState = {
  open: boolean;
  type: ToastType;
  title: string;
  description?: string;
};

export function Toast({
  state,
  onClose,
}: {
  state: ToastState;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!state.open) return;
    const t = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(t);
  }, [state.open, onClose]);

  if (!state.open) return null;

  return (
    <div className="fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
      <div className="ui-surface w-[min(520px,92vw)] px-4 py-3 shadow-soft animate-in fade-in slide-in-from-top-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 ui-surface-2 flex h-10 w-10 items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">{state.title}</p>
            {state.description && (
              <p className="mt-1 text-xs text-muted">{state.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}