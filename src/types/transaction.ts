export type TransactionType = "RECEITA" | "DESPESA";
export type TransactionStatus = "PENDENTE" | "PAGO" | "RECEBIDO" | "ATRASADO";

export interface TransactionDTO {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO
  type: TransactionType;
  status: TransactionStatus;
  categoryId: number;
  paymentMethodId: number;
  seriesId: string | null;
  installmentNumber: number | null;
  installmentTotal: number | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  category: CategoryDTO;
  paymentMethod: PaymentMethodDTO;
}

export interface CategoryDTO {
  id: number;
  name: string;
  type: TransactionType;
}

export interface PaymentMethodDTO {
  id: number;
  name: string;
}
