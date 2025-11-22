/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { formatBRL } from "@/utils/currency";
import { TransactionDTO } from "@/types/transaction";
import { StatusBadgeLight } from "./StatusBadgeLight";
import {
  settleTransaction,
  cancelTransaction,
} from "@/services/transactionsApi";
import { toast } from "sonner";

type Props = {
  items: TransactionDTO[];
  title?: string;
  hrefAll?: string;
  /** Chamado após resolver/cancelar para o pai recarregar a lista */
  onChanged?: () => void;
};

function AmountPill({
  value,
  type,
}: {
  value: number;
  type: "RECEITA" | "DESPESA";
}) {
  const isIncome = type === "RECEITA";
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
        ${
          isIncome
            ? "bg-emerald-50 text-emerald-700"
            : "bg-rose-50 text-rose-700"
        }`}
      title={isIncome ? "Receita" : "Despesa"}
    >
      {isIncome ? "+" : "-"} {formatBRL(value)}
    </span>
  );
}

/* ============================
   Dialog de confirmação (local)
   ============================ */
function ConfirmDialogCmp({
  open,
  title = "Confirmar ação",
  description = "Deseja prosseguir?",
  confirmText = "Sim",
  cancelText = "Não",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-[61] w-[92%] max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================
   Menu de ações (local)
   ============================ */
function ActionMenuCmp({
  disabledResolve,
  disabledCancel,
  onResolve,
  onCancel,
  onView,
}: {
  disabledResolve?: boolean;
  disabledCancel?: boolean;
  onResolve: () => void;
  onCancel: () => void;
  onView: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Ações"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
        onClick={() => setOpen((v) => !v)}
        title="Ações"
      >
        <ArrowRight className="h-4 w-4 text-gray-600" />
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onResolve();
            }}
            disabled={disabledResolve}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✅ <span>Resolver</span>
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onCancel();
            }}
            disabled={disabledCancel}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🛑 <span>Cancelar</span>
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onView();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 transition hover:bg-gray-50"
          >
            👁️ <span>Visualizar</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================
   Linha com ações
   ============================ */
function RecentActivityItemRow({
  t,
  onChanged,
}: {
  t: TransactionDTO;
  onChanged?: () => void;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<null | "resolve" | "cancel">(null);
  const [loading, setLoading] = useState(false);

  const isSettled = t.status === "PAGO" || t.status === "RECEBIDO";
  const isCanceled = t.status === "CANCELADO";

  async function doResolve() {
    try {
      setLoading(true);
      await settleTransaction(t.id);
      toast.success("Transação resolvida com sucesso!");
      onChanged?.();
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao resolver transação.");
    } finally {
      setLoading(false);
    }
  }
  async function doCancel() {
    try {
      setLoading(true);
      await cancelTransaction(t.id); // endpoint no back em breve
      toast.success("Transação cancelada com sucesso!");
      onChanged?.();
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao cancelar transação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-12 sm:items-center">
      {/* Col 1 – menu + descrição + data */}
      <div className="sm:col-span-5 flex items-start gap-3">
        <ActionMenuCmp
          disabledResolve={isSettled || isCanceled || loading}
          disabledCancel={isCanceled || loading}
          onResolve={() => setConfirm("resolve")}
          onCancel={() => setConfirm("cancel")}
          onView={() => router.push(`/transactions/edit/${t.id}`)}
        />
        <div>
          <div className="font-medium text-gray-900">{t.description}</div>
          <div className="text-xs text-gray-500">
            {new Date(t.date).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </div>

      {/* Col 2 – pill + categoria + status */}
      <div className="sm:col-span-4 flex flex-col gap-1">
        <AmountPill value={Number(t.amount)} type={t.type} />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            {t?.category?.name ?? (t as any)?.categoryName ?? "Sem categoria"}
          </span>
          <StatusBadgeLight status={t.status} />
        </div>
      </div>

      {/* Col 3 – valor à direita */}
      <div className="sm:col-span-3 flex sm:justify-end">
        <div className="text-sm font-semibold text-gray-900">
          {t.type === "DESPESA" ? "-" : "+"} {formatBRL(Number(t.amount))}
        </div>
      </div>

      {/* Confirmações */}
      <ConfirmDialogCmp
        open={confirm === "resolve"}
        title="Resolver transação"
        description="Deseja prosseguir?"
        onConfirm={() => {
          setConfirm(null);
          doResolve();
        }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialogCmp
        open={confirm === "cancel"}
        title="Cancelar transação"
        description="Deseja prosseguir?"
        onConfirm={() => {
          setConfirm(null);
          doCancel();
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

/* ============================
   Componente principal
   ============================ */
export function RecentActivity({
  items,
  title = "Atividade recente",
  hrefAll = "/transactions",
  onChanged,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        <a
          href={hrefAll}
          className="text-xs font-medium text-emerald-700 hover:underline"
        >
          Ver todas
        </a>
      </div>

      <div className="divide-y divide-gray-200">
        {items.map((t) => (
          <RecentActivityItemRow key={t.id} t={t} onChanged={onChanged} />
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
