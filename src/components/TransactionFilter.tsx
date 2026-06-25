"use client";

import Input from "@/components/ui/Input";
import { Search, Filter } from "lucide-react";
import type { TransactionStatus } from "@/models/transaction";
import { useCallback, useRef } from "react";

interface TransactionFilterProps {
  search: string;
  status: TransactionStatus | "";
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
}

export default function TransactionFilter({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TransactionFilterProps) {
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearchChange = useCallback(
    (value: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 400);
    },
    [onSearchChange]
  );

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#606C5A]" />
          <input
            type="text"
            placeholder="Cari nama pengirim..."
            defaultValue={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white border-2 border-[#E8E3DB] rounded-xl pl-10 pr-4 py-2.5 text-[#1C2421] placeholder:text-[#606C5A] text-sm focus:outline-none focus:ring-2 focus:ring-[#C27D58]/50 focus:border-[#C27D58] transition-all duration-200"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#606C5A] pointer-events-none z-10" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-white border-2 border-[#E8E3DB] rounded-xl pl-10 pr-10 py-2.5 text-[#1C2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#C27D58]/50 focus:border-[#C27D58] transition-all duration-200 appearance-none cursor-pointer font-medium hover:border-[#C27D58]"
          >
            <option value="" className="bg-white text-[#1C2421]">Semua Status</option>
            <option value="PENDING" className="bg-white text-[#1C2421]">PENDING</option>
            <option value="SUCCESS" className="bg-white text-[#1C2421]">SUCCESS</option>
            <option value="FAILED" className="bg-white text-[#1C2421]">FAILED</option>
            <option value="APPROVED" className="bg-white text-[#1C2421]">APPROVED</option>
            <option value="REJECTED" className="bg-white text-[#1C2421]">REJECTED</option>
          </select>
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#606C5A] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
