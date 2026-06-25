"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { BANK_LIST } from "@/models/transaction";
import { calculateAdminFee, formatRupiah } from "@/lib/utils";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/components/ui/Toast";
import { useCallback, useState } from "react";

const createTransactionSchema = z.object({
  sender_name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  account_number: z
    .string()
    .min(6, "No. rekening minimal 6 digit")
    .max(20, "No. rekening maksimal 20 digit")
    .regex(/^\d+$/, "No. rekening hanya boleh angka"),
  bank: z.string().min(1, "Pilih bank yang valid"),
  amount: z
    .number()
    .min(10_000, "Minimal transfer Rp 10.000")
    .max(100_000_000, "Maksimal transfer Rp 100.000.000"),
  note: z.string().max(255, "Catatan maksimal 255 karakter").optional(),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

interface CreateTransactionFormProps {
  onSuccess?: () => void;
}

export default function CreateTransactionForm({
  onSuccess,
}: CreateTransactionFormProps) {
  const mutation = useCreateTransaction();
  const { showToast } = useToast();
  const [displayAmount, setDisplayAmount] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    mode: "onBlur",
  });

  const amount = watch("amount");
  const adminFee = amount ? calculateAdminFee(amount) : 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Extract only digits
    const numValue = value.replace(/\D/g, "");
    if (numValue) {
      const num = parseInt(numValue, 10);
      setDisplayAmount(formatRupiah(num));
      // Update React Hook Form value
      setValue("amount", num);
    } else {
      setDisplayAmount("");
      setValue("amount", 0);
    }
  };

  const onSubmit = useCallback(
    async (data: CreateTransactionFormData) => {
      mutation.mutate(
        {
          ...data,
          admin_fee: calculateAdminFee(data.amount),
          status: "PENDING",
        },
        {
          onSuccess: () => {
            showToast({
              type: "success",
              message: "Transaksi berhasil dibuat!",
            });
            reset();
            onSuccess?.();
          },
          onError: () => {
            showToast({
              type: "error",
              message: "Gagal membuat transaksi. Silakan coba lagi.",
            });
          },
        }
      );
    },
    [mutation, reset, showToast, onSuccess]
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="sender_name"
          label="Nama Pengirim"
          placeholder="Contoh: Budi Santoso"
          {...register("sender_name")}
          error={errors.sender_name?.message}
        />

        <div>
          <label htmlFor="bank" className="block text-sm font-medium text-[#1C2421] mb-2">
            Bank Tujuan
          </label>
          <select
            id="bank"
            {...register("bank")}
            className="w-full bg-white border-2 border-[#E8E3DB] rounded-xl px-4 py-2.5 text-[#1C2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#C27D58]/50 focus:border-[#C27D58] transition-all duration-200 appearance-none cursor-pointer hover:border-[#C27D58]"
          >
            <option value="">Pilih Bank</option>
            {BANK_LIST.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bank && (
            <p className="text-red-600 text-sm mt-1">{errors.bank.message}</p>
          )}
        </div>

        <Input
          id="account_number"
          label="Nomor Rekening Tujuan"
          placeholder="Contoh: 1234567890"
          {...register("account_number")}
          error={errors.account_number?.message}
        />

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-[#1C2421] mb-2">
            Jumlah Transfer (Rp)
          </label>
          <input
            id="amount"
            type="text"
            placeholder="Contoh: 1000000"
            value={displayAmount}
            onChange={handleAmountChange}
            className="w-full bg-white border-2 border-[#E8E3DB] rounded-xl px-4 py-2.5 text-[#1C2421] placeholder:text-[#606C5A] text-sm focus:outline-none focus:ring-2 focus:ring-[#C27D58]/50 focus:border-[#C27D58] transition-all duration-200"
          />
          {errors.amount && (
            <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        {amount > 0 && (
          <div className="bg-[#FFF9F3] border-2 border-[#E8E3DB] rounded-xl p-4">
            <p className="text-xs text-[#606C5A] uppercase tracking-wider mb-2">
              Biaya Admin (Otomatis)
            </p>
            <p className="text-lg font-bold text-[#C27D58]">
              {formatRupiah(adminFee)}
            </p>
            <p className="text-xs text-[#606C5A] mt-2">
              Total: {formatRupiah((amount || 0) + adminFee)}
            </p>
          </div>
        )}

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-[#1C2421] mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            id="note"
            {...register("note")}
            placeholder="Tambahkan catatan jika diperlukan..."
            rows={3}
            className="w-full bg-white border-2 border-[#E8E3DB] rounded-xl px-4 py-2.5 text-[#1C2421] placeholder:text-[#606C5A] text-sm focus:outline-none focus:ring-2 focus:ring-[#C27D58]/50 focus:border-[#C27D58] transition-all duration-200 resize-none"
          />
          {errors.note && (
            <p className="text-red-600 text-sm mt-1">{errors.note.message}</p>
          )}
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting || mutation.isPending}
          className="w-full bg-[#C27D58] hover:bg-[#B06F4A] text-white border-2 border-black"
        >
          Buat Transaksi
        </Button>
      </form>
    </div>
  );
}
