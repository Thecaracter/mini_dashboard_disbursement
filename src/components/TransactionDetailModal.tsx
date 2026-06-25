"use client";

import type { Transaction } from "@/models/transaction";
import { formatRupiah, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Transaksi">
      <div className="space-y-4">
        {/* ID */}
        <div>
          <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-1">
            ID Transaksi
          </p>
          <p className="text-[#1C2421] font-mono font-semibold">{transaction.id}</p>
        </div>

        {/* Nama Pengirim */}
        <div>
          <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-1">
            Nama Pengirim
          </p>
          <p className="text-[#1C2421]">{transaction.sender_name}</p>
        </div>

        {/* Bank & No. Rekening */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-1">
              Bank
            </p>
            <p className="text-[#1C2421]">{transaction.bank}</p>
          </div>
          <div>
            <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-1">
              No. Rekening
            </p>
            <p className="text-[#1C2421] font-mono">{transaction.account_number}</p>
          </div>
        </div>

        {/* Jumlah & Biaya Admin */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-1">
              Jumlah
            </p>
            <p className="text-[#1C2421] font-semibold">
              {formatRupiah(transaction.amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-1">
              Biaya Admin
            </p>
            <p className="text-[#1C2421] font-semibold">
              {formatRupiah(transaction.admin_fee)}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="bg-[#FFF9F3] border-2 border-[#E8E3DB] rounded-xl p-4">
          <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-2">
            Total (Jumlah + Biaya)
          </p>
          <p className="text-lg font-bold text-[#C27D58]">
            {formatRupiah(transaction.amount + transaction.admin_fee)}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-2">
            Status
          </p>
          <Badge status={transaction.status} />
        </div>

        {/* Tanggal */}
        <div>
          <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-1">
            Tanggal Dibuat
          </p>
          <p className="text-[#1C2421] text-sm">{formatDate(transaction.created_at)}</p>
        </div>

        {/* Catatan */}
        <div>
          <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-1">
            Catatan
          </p>
          <p className="text-[#1C2421] text-sm">
            {transaction.note || "-"}
          </p>
        </div>
      </div>
    </Modal>
  );
}
