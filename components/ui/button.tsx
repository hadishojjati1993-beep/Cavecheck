"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  shimmer?: boolean; // NEW: neon shimmer for CTA
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border border-white/25 border-t-white/90"
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      shimmer = false,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const base =
      "ui-tap relative inline-flex select-none items-center justify-center gap-2 rounded-2xl " +
      "font-semibold tracking-tight " +
      "transition-[transform,filter,background-color,border-color,box-shadow,opacity] duration-200 " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--ring),0.95)] focus-visible:ring-offset-0 " +
      "disabled:opacity-55 disabled:cursor-not-allowed";

    const sizes: Record<ButtonSize, string> = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4 text-[15px]",
      lg: "h-12 px-5 text-[15px]",
    };

    const variants: Record<ButtonVariant, string> = {
      primary:
        // Strong neon gradient + glow
        "overflow-hidden border border-white/12 text-white " +
        "bg-[linear-gradient(135deg,rgba(var(--accent-a),0.95),rgba(var(--accent-b),0.75),rgba(var(--accent-c),0.85))] " +
        "shadow-[0_20px_60px_rgba(0,0,0,0.60),0_0_40px_rgba(var(--accent-a),0.22),0_0_52px_rgba(var(--accent-b),0.16)] " +
        "hover:brightness-[1.08] hover:shadow-[0_24px_70px_rgba(0,0,0,0.62),0_0_52px_rgba(var(--accent-a),0.28),0_0_62px_rgba(var(--accent-b),0.20)] " +
        "active:brightness-[0.98]",
      secondary:
        "border border-white/12 bg-[rgba(var(--panel-2),0.72)] text-white " +
        "hover:bg-[rgba(var(--panel-2),0.86)] " +
        "hover:shadow-[0_10px_30px_rgba(0,0,0,0.35),0_0_28px_rgba(var(--accent-a),0.08)] " +
        "active:bg-[rgba(var(--panel-2),0.68)]",
      ghost:
        "border border-transparent bg-transparent text-white " +
        "hover:bg-white/6 active:bg-white/4",
      danger:
        "border border-white/12 bg-[rgba(220,38,38,0.24)] text-white " +
        "hover:bg-[rgba(220,38,38,0.32)] active:bg-[rgba(220,38,38,0.22)]",
    };

    const iconWrap = "inline-flex h-5 w-5 items-center justify-center";

    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], variants[variant], className)}
        disabled={isDisabled}
        {...props}
      >
        {/* Shimmer overlay for CTA */}
        {variant === "primary" && shimmer && !isDisabled && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0",
              "before:absolute before:inset-[-40%] before:translate-x-[-60%]",
              "before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]",
              "before:rotate-[18deg] before:blur-[2px]",
              "before:animate-[shimmer_2.4s_ease-in-out_infinite]"
            )}
          />
        )}

        <span className={cn(iconWrap, "shrink-0")}>
          {isLoading ? <Spinner /> : leftIcon ?? null}
        </span>

        <span className="min-w-0 truncate">{children}</span>

        <span className={cn(iconWrap, "shrink-0")}>{rightIcon ?? null}</span>
      </button>
    );
  }
);

Button.displayName = "Button";