export type TransactionType = "RECEITA" | "DESPESA";
export type TransactionStatus = "PENDENTE" | "PAGO" | "RECEBIDO" | "ATRASADO";

export interface TransactionDTO {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO
  type: TransactionType;
  status: TransactionStatus;
  categoryName: string;
  paymentMethodName: string;
  installmentNumber: number | null;
  installmentTotal: number | null;
}
