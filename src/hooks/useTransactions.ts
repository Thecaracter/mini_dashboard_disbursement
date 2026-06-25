"use client";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  fetchTransactions,
  createTransaction,
  updateTransactionStatus,
  clearTransactionsCache,
} from "@/api/transactions";
import type {
  CreateTransactionData,
  TransactionParams,
  TransactionStatus,
} from "@/models/transaction";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params: TransactionParams) =>
    [...transactionKeys.lists(), params] as const,
};

export function useTransactions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "") as TransactionStatus | "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const order = (searchParams.get("order") ?? "desc") as "asc" | "desc";

  const params: TransactionParams = {
    page,
    limit,
    search: search || undefined,
    status: status || undefined,
    sortBy: sortBy || undefined,
    order,
  };

  const query = useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => fetchTransactions(params),
    placeholderData: (prev) => prev,
  });

  const setParam = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (value) {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
      // Reset to page 1 on filter change (except when changing page itself)
      if (key !== "page") sp.set("page", "1");
      router.push(`${pathname}?${sp.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const setPage = (p: number) => setParam("page", String(p));
  const setSearch = (s: string) => setParam("search", s);
  const setStatus = (st: string) => setParam("status", st);
  const setSort = (col: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (sp.get("sortBy") === col) {
      sp.set("order", sp.get("order") === "asc" ? "desc" : "asc");
    } else {
      sp.set("sortBy", col);
      sp.set("order", "desc");
    }
    sp.set("page", "1");
    router.push(`${pathname}?${sp.toString()}`);
  };

  return {
    ...query,
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
  };
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionData) => createTransaction(data),
    onSuccess: () => {
      clearTransactionsCache();
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.refetchQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: TransactionStatus;
    }) => updateTransactionStatus(id, { status }),
    onSuccess: () => {
      clearTransactionsCache();
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.refetchQueries({ queryKey: transactionKeys.all });
    },
  });
}
