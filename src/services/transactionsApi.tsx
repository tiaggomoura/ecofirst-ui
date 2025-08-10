import { TransactionDTO } from "@/types/transaction";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function fetchMonthlyTransactions(fromISO: string, toISO: string) {
  const url = new URL(`${API_BASE}/transactions`);
  url.searchParams.set("from", fromISO);
  url.searchParams.set("to", toISO);
  url.searchParams.set("page", "1");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar transações do mês");

  // O backend retorna um ARRAY puro
  const body = await res.json();

  if (!Array.isArray(body)) {
    throw new Error("Contrato inválido: esperado array de TransactionDTO");
  }

  // Opcional: validação leve de campos críticos
  return body as TransactionDTO[];
}
