"use client";

import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-black sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-[#1C2421]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#606C5A] hover:text-[#1C2421] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-[#1C2421]">{children}</div>
      </div>
    </div>
  );
}
