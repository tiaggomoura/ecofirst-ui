/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionDTO } from "@/types/transaction";
import { TransactionListResponseDTO } from "@/types/transaction-list.dto";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function fetchMonthlyTransactions(
  fromISO: string,
  toISO: string
): Promise<TransactionListResponseDTO> {
  const url = new URL(`${API_BASE}/transactions/recent-activity`);
  url.searchParams.set("from", fromISO);
  url.searchParams.set("to", toISO);
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "20");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar transações do mês");

  const body = await res.json();

  // Aceita tanto { items, total, ... } quanto um array bruto (fallback)
  const itemsRaw: any[] = Array.isArray(body)
    ? body
    : Array.isArray(body?.items)
    ? body.items
    : [];

  // Normalização mínima:
  const items: TransactionDTO[] = itemsRaw.map((t: any) => ({
    ...t,
    // amount como number (mantendo 1 casa/2 casas se vier string inteira)
    amount:
      typeof t.amount === "string" ? Number(t.amount) : Number(t.amount ?? 0),
    // compatibilidade com código atual:
    categoryName: t?.category?.name ?? null,
    paymentMethodName: t?.paymentMethod?.name ?? null,
  }));

  return {
    items,
    total: Number(body?.total ?? items.length),
    totalPages: Number(body?.totalPages ?? 1),
    currentPage: Number(body?.currentPage ?? 1),
    pageSize: Number(body?.pageSize ?? items.length),
  };
}
