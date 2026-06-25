import apiClient from "./axios";
import type {
  CreateTransactionData,
  PaginatedTransactions,
  Transaction,
  TransactionParams,
  UpdateTransactionStatusData,
} from "@/models/transaction";

let allTransactionsCache: Transaction[] | null = null;
let cacheTimestamp = 0;
let lastSortKey = "";
const CACHE_DURATION = 5 * 60 * 1000;

export function clearTransactionsCache() {
  allTransactionsCache = null;
  cacheTimestamp = 0;
  lastSortKey = "";
}

export async function fetchTransactions(
  params: TransactionParams
): Promise<PaginatedTransactions> {
  const { page = 1, limit = 10, search, status, sortBy, order } = params;

  const now = Date.now();
  const sortKey = `${sortBy || ""}:${order || "desc"}`;

  if (sortKey !== lastSortKey) {
    allTransactionsCache = null;
    cacheTimestamp = 0;
    lastSortKey = sortKey;
  }
  
  if (!allTransactionsCache || now - cacheTimestamp > CACHE_DURATION) {
    const queryParams = new URLSearchParams();
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (order) queryParams.append("order", order);
    
    const response = await apiClient.get<Transaction[]>(
      `/transactions?${queryParams.toString()}`
    );
    allTransactionsCache = response.data;
    cacheTimestamp = now;
  }

  let filtered = allTransactionsCache;

  if (search) {
    filtered = filtered.filter((tx) =>
      tx.sender_name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status) {
    filtered = filtered.filter((tx) => tx.status === status);
  }

  const total = filtered.length;
  const startIdx = (page - 1) * limit;
  const paginatedData = filtered.slice(startIdx, startIdx + limit);

  return {
    data: paginatedData,
    total,
  };
}

export async function fetchTransaction(id: string): Promise<Transaction> {
  const response = await apiClient.get<Transaction>(`/transactions/${id}`);
  return response.data;
}

export async function createTransaction(
  data: CreateTransactionData
): Promise<Transaction> {
  const response = await apiClient.post<Transaction>("/transactions", data);
  return response.data;
}

export async function updateTransactionStatus(
  id: string,
  data: UpdateTransactionStatusData
): Promise<Transaction> {
  const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
  return response.data;
}
