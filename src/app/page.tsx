"use client";

import { MonthNavLight } from "@/components/MonthNavLight";
import { NewTransactionButtonLight } from "@/components/NewTransactionButtonLight";
import { RecentActivity } from "@/components/RecentActivity";
import { StatCard } from "@/components/StatCard";
import { CashflowChart, CashPoint } from "@/components/charts/CashflowChart";
import { ExpensesByCategoryChart } from "@/components/charts/ExpensesByCategoryChart";
import { IncomeByCategoryChart } from "@/components/charts/IncomeByCategoryChart";
import { fetchMonthlyTransactions } from "@/services/transactionsApi";
import { TransactionDTO } from "@/types/transaction";
import { formatBRL } from "@/utils/currency";
import { addMonths, endOfMonth, startOfMonth } from "@/utils/date";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function MonthlyDashboardPage() {
  // Montagem no cliente (evita mismatch de SSR)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Inicializa o mês atual APÓS montar
  const [cursor, setCursor] = useState<Date | null>(null);
  useEffect(() => {
    if (!mounted) return;
    setCursor(startOfMonth(new Date()));
  }, [mounted]);

  const [items, setItems] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datas do filtro (seguras quando cursor é null)
  const fromISO = useMemo(
    () => (cursor ? startOfMonth(cursor).toISOString() : ""),
    [cursor]
  );
  const toISO = useMemo(
    () => (cursor ? endOfMonth(cursor).toISOString() : ""),
    [cursor]
  );

  // Fetch mensal (roda só quando já há cursor e datas)
  useEffect(() => {
    if (!cursor || !fromISO || !toISO) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMonthlyTransactions(fromISO, toISO);
        if (alive) setItems(data);
      } catch (e: unknown) {
        if (alive) {
          const message =
            typeof e === "object" && e !== null && "message" in e
              ? String((e as { message?: unknown }).message)
              : "Erro ao buscar dados";
          setError(message);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [cursor, fromISO, toISO]);

  // Agregações SEMPRE chamadas (não condicionais)
  const {
    totalIncome,
    totalExpense,
    net,
    pendingValue,
    overdueValue,
    expensesByCat,
    incomeByCat,
    cashSeries,
  } = useMemo(() => {
    const list: TransactionDTO[] = Array.isArray(items) ? items : [];

    const incomes = list.filter((i) => i.type === "RECEITA");
    const expenses = list.filter((i) => i.type === "DESPESA");

    const sum = (arr: TransactionDTO[]) =>
      arr.reduce((acc, t) => acc + Number(t.amount ?? 0), 0);

    const totalIncome = sum(incomes);
    const totalExpense = sum(expenses);
    const net = totalIncome - totalExpense;

    const pendingValue = sum(list.filter((i) => i.status === "PENDENTE"));
    const overdueValue = sum(list.filter((i) => i.status === "ATRASADO"));

    const byCategory = (arr: TransactionDTO[]) => {
      const map = new Map<string, number>();
      for (const t of arr) {
        const key = t.categoryName || "Sem categoria";
        map.set(key, (map.get(key) ?? 0) + Number(t.amount ?? 0));
      }
      return Array.from(map.entries()).map(([name, value]) => ({
        name,
        value,
      }));
    };

    const expensesByCat = byCategory(expenses);
    const incomeByCat = byCategory(incomes);

    const daysInMonth = cursor ? endOfMonth(cursor).getDate() : 30;
    const cashSeries: CashPoint[] = Array.from(
      { length: daysInMonth },
      (_, i) => {
        const day = i + 1;

        if (!cursor) return { day, receita: 0, despesa: 0, saldo: 0 };

        const dateKey = new Date(cursor.getFullYear(), cursor.getMonth(), day)
          .toISOString()
          .slice(0, 10);

        const ofDay = list.filter(
          (t) => (t.date ?? "").slice(0, 10) === dateKey
        );
        const inc = sum(ofDay.filter((t) => t.type === "RECEITA"));
        const exp = sum(ofDay.filter((t) => t.type === "DESPESA"));
        return { day, receita: inc, despesa: exp, saldo: inc - exp };
      }
    );

    return {
      totalIncome,
      totalExpense,
      net,
      pendingValue,
      overdueValue,
      expensesByCat,
      incomeByCat,
      cashSeries,
    };
  }, [items, cursor]);

  // Label do mês segura (string vazia enquanto não houver cursor)
  const monthLabel = useMemo(
    () =>
      cursor
        ? cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
        : "",
    [cursor]
  );

  const goPrev = () => setCursor((d) => (d ? addMonths(d, -1) : d));
  const goNext = () => setCursor((d) => (d ? addMonths(d, 1) : d));

  const newTransaction = () => {
    if (!cursor) return;
    const params = new URLSearchParams({
      month: cursor.toISOString().slice(0, 7),
    });
    window.location.href = `/transactions/new?${params.toString()}`;
  };

  // ===== Render =====
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <MonthNavLight
          label={monthLabel || ""}
          onPrev={goPrev}
          onNext={goNext}
        />

        <NewTransactionButtonLight onClick={newTransaction} />
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {/* Skeletons enquanto !mounted ou !cursor */}
      {!mounted || !cursor ? (
        <>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-zinc-800/40 bg-zinc-900/40 animate-pulse"
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-72 rounded-2xl border border-zinc-800/40 bg-zinc-900/40 animate-pulse" />
            <div className="h-72 rounded-2xl border border-zinc-800/40 bg-zinc-900/40 animate-pulse" />
          </div>
          <div className="mt-6 h-72 rounded-2xl border border-zinc-800/40 bg-zinc-900/40 animate-pulse" />
        </>
      ) : (
        <>
          {/* Cards */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Saldo do mês"
              value={formatBRL(net)}
              hint="Receitas - Despesas"
            />
            <StatCard
              title="Receitas"
              value={formatBRL(totalIncome)}
              hint="Total de entradas"
            />
            <StatCard
              title="Despesas"
              value={formatBRL(totalExpense)}
              hint="Total de saídas"
            />
            <StatCard
              title="Pendentes / Atrasadas"
              value={`${formatBRL(pendingValue)} · ${formatBRL(overdueValue)}`}
              hint="Pendentes · Atrasadas"
            />
          </div>

          {/* Gráficos */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ExpensesByCategoryChart data={expensesByCat} />
            <IncomeByCategoryChart data={incomeByCat} />
          </div>

          <div className="mt-6">
            <CashflowChart data={cashSeries} />
          </div>

          {/* Lista de atividade */}
          <div className="mt-6">
            <RecentActivity items={items} />
          </div>
        </>
      )}
    </div>
  );
}
