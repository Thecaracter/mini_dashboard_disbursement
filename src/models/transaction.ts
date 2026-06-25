export type Role = "admin" | "operator";

export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED" | "APPROVED" | "REJECTED";

export interface User {
  username: string;
  role: Role;
  exp: number;
}

export interface Transaction {
  id: string;
  sender_name: string;
  account_number: string;
  bank: string;
  amount: number;
  admin_fee: number;
  status: TransactionStatus;
  note?: string;
  created_at: string;
}

export interface TransactionParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TransactionStatus | "";
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
}

export interface CreateTransactionData {
  sender_name: string;
  account_number: string;
  bank: string;
  amount: number;
  note?: string;
  admin_fee?: number;
  status?: TransactionStatus;
}

export interface UpdateTransactionStatusData {
  status: TransactionStatus;
}

export const BANK_LIST = [
  "BCA",
  "BRI",
  "BNI",
  "Mandiri",
  "BSI",
  "CIMB Niaga",
  "Permata",
  "Danamon",
  "BTN",
] as const;

export type Bank = (typeof BANK_LIST)[number];
