"use client";

export default function Skeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      {/* Circular spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-[#E8E3DB] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#C27D58] border-r-[#C27D58] rounded-full animate-spin"></div>
      </div>
      
      {/* Loading text */}
      <p className="text-[#606C5A] text-sm font-medium">Memuat data transaksi...</p>
      
      {/* Skeleton bars */}
      <div className="w-full space-y-4 mt-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3.5 px-4">
            <div className="h-4 bg-[#E8E3DB] rounded-full w-1/6 flex-shrink-0" />
            <div className="h-4 bg-[#E8E3DB] rounded-full w-1/4" />
            <div className="h-4 bg-[#E8E3DB] rounded-full w-1/5" />
            <div className="h-4 bg-[#E8E3DB] rounded-full w-1/4" />
            <div className="h-4 bg-[#E8E3DB] rounded-full w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
