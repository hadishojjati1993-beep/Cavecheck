"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="ui-surface flex items-center gap-2 px-3 py-2">
      <Search className="h-4 w-4 text-muted" aria-hidden="true" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search shoes, brand, or type…"}
        className={cn(
          "w-full bg-transparent text-sm text-text outline-none",
          "placeholder:text-muted/80"
        )}
        aria-label="Search shoes"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="ui-tap flex h-9 w-9 items-center justify-center rounded-xl hover:bg-panel2"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}