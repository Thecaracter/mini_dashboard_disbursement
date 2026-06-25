"use client";

import type { Transaction, TransactionStatus } from "@/models/transaction";
import { formatRupiah, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { ChevronLeft, ChevronRight, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: unknown;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowClick: (transaction: Transaction) => void;
  isAdmin?: boolean;
  onApprove?: (transactionId: string) => void;
  onReject?: (transactionId: string) => void;
  refetch?: () => void;
  sortBy?: string;
  order?: "asc" | "desc";
  onSort?: (column: string) => void;
}

export default function TransactionTable({
  transactions,
  isLoading,
  error,
  page,
  limit,
  total,
  onPageChange,
  onRowClick,
  isAdmin = false,
  onApprove,
  onReject,
  refetch,
  sortBy,
  order,
  onSort,
}: TransactionTableProps) {
  const totalPages = Math.ceil(total / limit);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <div className="w-4 h-4" />;
    }
    return order === "asc" ? (
      <ArrowUp className="w-4 h-4 text-[#C27D58]" />
    ) : (
      <ArrowDown className="w-4 h-4 text-[#C27D58]" />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
        <div className="p-6">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-12 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-[#606C5A] mb-4">Gagal memuat data transaksi</p>
          <Button onClick={refetch} variant="secondary" className="border-2 border-black text-[#1C2421]">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-12 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-[#606C5A]">Tidak ada transaksi ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-black bg-[#FFF9F3]">
              <th 
                onClick={() => onSort?.("id")}
                className="text-left py-4 px-4 text-xs font-semibold text-[#1C2421] uppercase tracking-wider cursor-pointer hover:bg-[#F0EDEA] transition-colors"
              >
                <div className="flex items-center gap-2">
                  ID
                  <SortIcon column="id" />
                </div>
              </th>
              <th 
                onClick={() => onSort?.("sender_name")}
                className="text-left py-4 px-4 text-xs font-semibold text-[#1C2421] uppercase tracking-wider cursor-pointer hover:bg-[#F0EDEA] transition-colors"
              >
                <div className="flex items-center gap-2">
                  Pengirim
                  <SortIcon column="sender_name" />
                </div>
              </th>
              <th 
                onClick={() => onSort?.("bank")}
                className="text-left py-4 px-4 text-xs font-semibold text-[#1C2421] uppercase tracking-wider cursor-pointer hover:bg-[#F0EDEA] transition-colors"
              >
                <div className="flex items-center gap-2">
                  Bank
                  <SortIcon column="bank" />
                </div>
              </th>
              <th 
                onClick={() => onSort?.("amount")}
                className="text-right py-4 px-4 text-xs font-semibold text-[#1C2421] uppercase tracking-wider cursor-pointer hover:bg-[#F0EDEA] transition-colors"
              >
                <div className="flex items-center justify-end gap-2">
                  Jumlah
                  <SortIcon column="amount" />
                </div>
              </th>
              <th 
                onClick={() => onSort?.("admin_fee")}
                className="text-right py-4 px-4 text-xs font-semibold text-[#1C2421] uppercase tracking-wider cursor-pointer hover:bg-[#F0EDEA] transition-colors"
              >
                <div className="flex items-center justify-end gap-2">
                  Admin
                  <SortIcon column="admin_fee" />
                </div>
              </th>
              <th className="text-center py-4 px-4 text-xs font-semibold text-[#1C2421] uppercase tracking-wider">
                Status
              </th>
              <th 
                onClick={() => onSort?.("created_at")}
                className="text-left py-4 px-4 text-xs font-semibold text-[#1C2421] uppercase tracking-wider cursor-pointer hover:bg-[#F0EDEA] transition-colors"
              >
                <div className="flex items-center gap-2">
                  Tanggal
                  <SortIcon column="created_at" />
                </div>
              </th>
              {isAdmin && (
                <th className="text-center py-4 px-4 text-xs font-semibold text-[#1C2421] uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-[#E8E3DB] hover:bg-[#FFF9F3] cursor-pointer transition-all duration-150 group"
                onClick={() => onRowClick(tx)}
              >
                <td className="py-4 px-4 text-sm text-[#606C5A] font-mono group-hover:text-[#1C2421] transition-colors">
                  {tx.id.slice(0, 8)}
                </td>
                <td className="py-4 px-4 text-sm text-[#1C2421] font-medium">
                  {tx.sender_name}
                </td>
                <td className="py-4 px-4 text-sm text-[#606C5A]">
                  {tx.bank}
                </td>
                <td className="py-4 px-4 text-sm text-[#1C2421] text-right font-medium">
                  {formatRupiah(tx.amount)}
                </td>
                <td className="py-4 px-4 text-sm text-[#606C5A] text-right">
                  {formatRupiah(tx.admin_fee)}
                </td>
                <td className="py-4 px-4 text-center">
                  <Badge status={tx.status} />
                </td>
                <td className="py-4 px-4 text-sm text-[#606C5A]">
                  {formatDate(tx.created_at)}
                </td>
                {isAdmin && (
                  <td className="py-4 px-4 text-center">
                    {tx.status === "PENDING" ? (
                      <div className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          onClick={() => onApprove?.(tx.id)}
                          variant="success"
                          className="px-3 py-1.5 text-xs"
                        >
                          Setujui
                        </Button>
                        <Button
                          onClick={() => onReject?.(tx.id)}
                          variant="danger"
                          className="px-3 py-1.5 text-xs"
                        >
                          Tolak
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#606C5A]">-</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-6 border-t-2 border-black bg-[#FFF9F3]">
        <p className="text-sm font-medium text-[#1C2421]">
          {(page - 1) * limit + 1}–{Math.min(page * limit, total)} dari {total} transaksi
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            variant="secondary"
            className="px-3 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold text-[#1C2421] px-3 py-2 flex items-center">
            {page} / {totalPages}
          </span>
          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            variant="secondary"
            className="px-3 py-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
