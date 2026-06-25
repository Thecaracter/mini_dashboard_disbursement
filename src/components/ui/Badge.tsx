"use client";

import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/models/transaction";

interface BadgeProps {
  status: TransactionStatus;
}

export default function Badge({ status }: BadgeProps) {
  const badgeConfig: Record<
    TransactionStatus,
    string
  > = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-300 border-2",
    SUCCESS: "bg-emerald-100 text-emerald-700 border-emerald-300 border-2",
    APPROVED: "bg-blue-100 text-blue-700 border-blue-300 border-2",
    FAILED: "bg-red-100 text-red-700 border-red-300 border-2",
    REJECTED: "bg-orange-100 text-orange-700 border-orange-300 border-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        badgeConfig[status] || "bg-gray-100 text-gray-700 border-gray-300 border-2"
      )}
    >
      {status}
    </span>
  );
}
