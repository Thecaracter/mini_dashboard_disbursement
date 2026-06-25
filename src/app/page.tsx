"use client";

import { useEffect, useState, Suspense } from "react";
import { getCookie } from "cookies-next";
import { verifyToken } from "@/hooks/useAuth";
import type { User, Transaction } from "@/models/transaction";
import { useTransactions, useUpdateTransactionStatus } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import TransactionTable from "@/components/TransactionTable";
import TransactionFilter from "@/components/TransactionFilter";
import TransactionDetailModal from "@/components/TransactionDetailModal";
import CreateTransactionForm from "@/components/CreateTransactionForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Toast, { useToast } from "@/components/ui/Toast";
import { exportToCsv, formatRupiah } from "@/lib/utils";
import { Download, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: "APPROVED" | "REJECTED" | null;
    transactionId: string | null;
  }>({ isOpen: false, action: null, transactionId: null });

  const { logout } = useAuth();
  const { showToast } = useToast();
  const updateMutation = useUpdateTransactionStatus();
  const {
    data,
    isLoading: isTransactionsLoading,
    error,
    page,
    limit,
    search,
    status,
    sortBy,
    order,
    setPage,
    setSearch,
    setStatus,
    setSort,
    refetch,
  } = useTransactions();

  useEffect(() => {
    const loadUser = async () => {
      const token = getCookie("token") as string | undefined;
      if (token) {
        const userData = await verifyToken(token);
        setUser(userData);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const isAdmin = user?.role === "admin";
  const isOperator = user?.role === "operator";

  const handleStatusUpdate = (transactionId: string, newStatus: "APPROVED" | "REJECTED") => {
    updateMutation.mutate(
      { id: transactionId, status: newStatus },
      {
        onSuccess: () => {
          setConfirmDialog({ isOpen: false, action: null, transactionId: null });
          showToast({
            type: "success",
            message: `Transaksi berhasil di-${newStatus === "APPROVED" ? "setujui" : "tolak"}!`,
          });
        },
        onError: () => {
          showToast({
            type: "error",
            message: "Gagal mengupdate status. Silakan coba lagi.",
          });
        },
      }
    );
  };

  const handleExportCSV = () => {
    if (!data?.data || data.data.length === 0) {
      showToast({ type: "error", message: "Tidak ada data untuk diekspor" });
      return;
    }

    const csvData = data.data.map((tx) => ({
      ID: tx.id,
      "Nama Pengirim": tx.sender_name,
      Bank: tx.bank,
      "No. Rekening": tx.account_number,
      Jumlah: formatRupiah(tx.amount),
      "Biaya Admin": formatRupiah(tx.admin_fee),
      Status: tx.status,
      Tanggal: new Date(tx.created_at).toLocaleString("id-ID"),
    }));

    exportToCsv(`transactions-${new Date().toISOString().split("T")[0]}`, csvData);
    showToast({ type: "success", message: "Data berhasil diekspor!" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-[#606C5A]">Memuat...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-[#606C5A]">Silakan login terlebih dahulu</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <header className="border-b-2 border-black bg-white sticky top-0 z-40 shadow-[0px_4px_0px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1C2421]">
              Transaksi
            </h1>
            <p className="text-sm text-[#606C5A] mt-1">
              {user.username} • {user.role === "admin" ? "Administrator" : "Operator"}
            </p>
          </div>
          <div className="flex gap-3">
            {isOperator && (
              <Button onClick={() => setIsCreateModalOpen(true)} variant="success" className="gap-2 bg-[#C27D58] hover:bg-[#B06F4A] text-white border-2 border-black">
                + Buat Transaksi
              </Button>
            )}
            <Button onClick={logout} variant="secondary" className="gap-2 border-2 border-black text-[#1C2421] hover:bg-[#F0EDEA]">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <TransactionFilter
            search={search}
            status={status as any}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />

          <div className="flex justify-end">
            <Button onClick={handleExportCSV} variant="secondary" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          <TransactionTable
            transactions={data?.data || []}
            isLoading={isTransactionsLoading}
            error={error}
            page={page}
            limit={limit}
            total={data?.total || 0}
            onPageChange={setPage}
            onRowClick={(tx) => {
              setSelectedTransaction(tx);
              setIsDetailModalOpen(true);
            }}
            isAdmin={isAdmin}
            sortBy={sortBy}
            order={order}
            onSort={setSort}
            onApprove={(transactionId) => {
              setConfirmDialog({ isOpen: true, action: "APPROVED", transactionId });
            }}
            onReject={(transactionId) => {
              setConfirmDialog({ isOpen: true, action: "REJECTED", transactionId });
            }}
            refetch={refetch}
          />
        </div>
      </main>

      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Buat Transaksi Baru"
      >
        <CreateTransactionForm onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
        }} />
      </Modal>

      <Modal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, action: null, transactionId: null })}
        title={confirmDialog.action === "APPROVED" ? "Setujui Transaksi?" : "Tolak Transaksi?"}
      >
        <div className="space-y-6">
          <p className="text-base text-[#1C2421] font-medium">
            Apakah Anda yakin ingin {confirmDialog.action === "APPROVED" ? "menyetujui" : "menolak"} transaksi ini?
          </p>
          <div className="flex gap-3 justify-end pt-4 border-t-2 border-[#E8E3DB]">
            <Button
              onClick={() => setConfirmDialog({ isOpen: false, action: null, transactionId: null })}
              variant="secondary"
              className="border-2 border-black text-[#1C2421] px-6"
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                if (confirmDialog.transactionId && confirmDialog.action) {
                  handleStatusUpdate(confirmDialog.transactionId, confirmDialog.action);
                }
              }}
              variant={confirmDialog.action === "APPROVED" ? "success" : "danger"}
              isLoading={updateMutation.isPending}
              className="px-8 font-semibold border-2 border-black"
            >
              {confirmDialog.action === "APPROVED" ? "Setujui" : "Tolak"}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <p className="text-[#606C5A]">Memuat...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
