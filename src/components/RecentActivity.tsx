"use client";

import { formatBRL } from "@/utils/currency";
import { TransactionDTO } from "@/types/transaction";
import { ArrowRight } from "lucide-react";
import { StatusBadgeLight } from "./StatusBadgeLight";

type Props = {
  items: TransactionDTO[];
  title?: string;
  hrefAll?: string; // link "Ver transação"
};

function AmountPill({
  value,
  type,
}: {
  value: number;
  type: "RECEITA" | "DESPESA";
}) {
  const positive = type === "RECEITA";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
        positive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-rose-50 text-rose-700 border border-rose-200"
      }`}
    >
      {positive ? "+" : "-"}&nbsp;{formatBRL(value)}
    </span>
  );
}

export function RecentActivity({
  items,
  title = "Atividade recente",
  hrefAll = "/transactions",
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        <a
          href={hrefAll}
          className="group inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          Ver transação{" "}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200">
        {items.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-12 sm:items-center"
          >
            {/* Col 1 – ícone + descrição + data */}
            <div className="sm:col-span-5 flex items-start gap-3">
              <div className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{t.description}</div>
                <div className="text-xs text-gray-500">
                  {new Date(t.date).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>

            {/* Col 2 – pill de valor + categoria + status */}
            <div className="sm:col-span-4 flex flex-col gap-1">
              <AmountPill value={Number(t.amount)} type={t.type} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{t.categoryName}</span>
                <StatusBadgeLight status={t.status} />
              </div>
            </div>

            {/* Col 3 – valor alinhado à direita (resumo) */}
            <div className="sm:col-span-3 flex sm:justify-end">
              <div className="text-sm font-semibold text-gray-900">
                {t.type === "DESPESA" ? "-" : "+"} {formatBRL(Number(t.amount))}
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="px-4 py-6 text-sm text-gray-500">
            Nenhuma transação encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
