"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ToastProps {
  type: "success" | "error";
  message: string;
  duration?: number;
}

const toastStack: React.Dispatch<React.SetStateAction<ToastProps[]>>[] = [];

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  React.useEffect(() => {
    toastStack.push(setToasts);
    return () => {
      toastStack.pop();
    };
  }, []);

  return {
    showToast: (toast: ToastProps) => {
      const id = Math.random();
      const toastWithId = { ...toast, id } as ToastProps & { id: number };

      setToasts((prev) => [...prev, toastWithId]);

      setTimeout(() => {
        setToasts((prev) =>
          prev.filter((t) => (t as any).id !== id)
        );
      }, toast.duration ?? 3000);
    },
  };
}

export default function Toast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);

  React.useEffect(() => {
    toastStack.push(setToasts as any);
    return () => {
      toastStack.pop();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] animate-in slide-in-from-right-5 ${
            toast.type === "success"
              ? "bg-emerald-100 border-emerald-300 text-emerald-700"
              : "bg-red-100 border-red-300 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
