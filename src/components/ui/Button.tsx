"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  isLoading?: boolean;
}

export default function Button({
  className,
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      "bg-[#C27D58] hover:bg-[#B06F4A] active:bg-[#9D6A42] text-white border-2 border-black disabled:opacity-50",
    secondary:
      "bg-white hover:bg-[#F0EDEA] text-[#1C2421] border-2 border-black disabled:opacity-50",
    danger:
      "bg-red-500 hover:bg-red-600 text-white border-2 border-black disabled:opacity-50",
    success:
      "bg-[#A3E635] hover:bg-[#96D71C] text-black border-2 border-black disabled:opacity-50",
  };

  return (
    <button
      className={cn(
        "font-medium px-4 py-2.5 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variantClasses[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
