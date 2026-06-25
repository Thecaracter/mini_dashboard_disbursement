"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  className,
  label,
  error,
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#1C2421] mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full bg-white border-2 rounded-xl px-4 py-2.5 text-[#1C2421] placeholder:text-[#606C5A] text-sm",
          "focus:outline-none focus:ring-2 focus:ring-[#C27D58]/50 focus:border-[#C27D58]",
          "transition-all duration-200",
          error ? "border-red-500 focus:ring-red-500/30" : "border-[#E8E3DB]",
          className
        )}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
