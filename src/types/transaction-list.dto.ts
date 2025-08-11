import { TransactionDTO } from "./transaction";

export interface TransactionListResponseDTO {
  items: TransactionDTO[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
