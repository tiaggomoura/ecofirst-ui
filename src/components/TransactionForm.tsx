"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionType } from "@/app/shared-types/transaction-type.enum";

interface TransactionFormProps {
  transactionId?: number;
  initialData?: Partial<TransactionFormData>;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  date: string; // formato yyyy-MM-dd (input type="date")
  type: TransactionType;
  categoryId: number;
  paymentMethodId: number;
}

interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

interface PaymentMethod {
  id: number;
  name: string;
}

export function TransactionForm({
  transactionId,
  initialData,
}: TransactionFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<TransactionFormData>({
    description: initialData?.description || "",
    amount: initialData?.amount || "",
    date: initialData?.date || "", // yyyy-MM-dd
    type: initialData?.type || TransactionType.RECEITA,
    categoryId: initialData?.categoryId || 0,
    paymentMethodId: initialData?.paymentMethodId || 0,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // =========================
  // NOVO: controles de parcelas
  // =========================
  const [repeatCount, setRepeatCount] = useState<number>(1); // 1 = sem recorrência
  const [distributeTotal, setDistributeTotal] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Erro ao buscar categorias:", err));

    fetch(`${apiBaseUrl}/payment-methods`)
      .then((res) => res.json())
      .then(setPaymentMethods)
      .catch((err) =>
        console.error("Erro ao buscar métodos de pagamento:", err),
      );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // NOVO: helpers locais (sem date-fns)
  // =========================

  // addMonths seguro para data vinda de <input type="date"> (yyyy-MM-dd)
  const addMonthsSafe = (dateStr: string, offset: number): Date | null => {
    if (!dateStr) return null;
    // Evita fuso: cria com meia-noite local (ou use "T00:00:00" se preferir)
    const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
    if (!y || !m || !d) return null;
    const base = new Date(y, m - 1, d);
    // JS lida com overflow de meses (e.g., 31 jan + 1 mês => 2 mar ou 29 feb dependendo do ano)
    const copy = new Date(base);
    copy.setMonth(copy.getMonth() + offset);
    return copy;
  };

  const formatBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // =========================
  // NOVO: pré-visualização das parcelas
  // =========================
  const preview = useMemo(() => {
    const count = Math.max(1, Number(repeatCount || 1));
    const amountNumber = Number(parseFloat(form.amount || "0").toFixed(2));
    if (!form.date || !amountNumber || count < 1) return [];

    if (distributeTotal && count > 1) {
      const base = Math.round((amountNumber / count) * 100) / 100; // 2 casas
      const sumRounded = base * count;
      let diff = Math.round((amountNumber - sumRounded) * 100) / 100; // sobra/defasagem

      const arr = Array.from({ length: count }, (_, i) => {
        let v = base;
        // distribui a diferença 1 centavo por parcela
        if (diff !== 0) {
          const step = diff > 0 ? 0.01 : -0.01;
          v = Math.round((v + step) * 100) / 100;
          diff = Math.round((diff - step) * 100) / 100;
        }
        const date = addMonthsSafe(form.date, i);
        return {
          index: i + 1,
          total: count,
          date,
          amount: v,
        };
      });
      return arr;
    }

    // amount já é valor por parcela
    return Array.from({ length: count }, (_, i) => {
      const date = addMonthsSafe(form.date, i);
      return {
        index: i + 1,
        total: count,
        date,
        amount: amountNumber,
      };
    });
  }, [form.amount, form.date, repeatCount, distributeTotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: TransactionFormData & {
      repeatCount?: number;
      distributeTotal?: boolean;
    } = {
      ...form,
      amount: Number(parseFloat(form.amount).toFixed(2)).toString(), // mantém seu padrão atual (string)
      categoryId: Number(form.categoryId),
      paymentMethodId: Number(form.paymentMethodId),
    };

    // =========================
    // NOVO: envia os campos de parcelamento ao backend
    // =========================
    // Apenas na criação (para não recriar série numa edição)
    if (!transactionId) {
      payload.repeatCount = Math.max(1, Number(repeatCount || 1));
      payload.distributeTotal = Boolean(distributeTotal);
    }

    const method = transactionId ? "PUT" : "POST";
    const url = transactionId
      ? `${apiBaseUrl}/transactions/${transactionId}`
      : `${apiBaseUrl}/transactions`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/transactions/list");
      router.refresh();
    } else {
      const error = await res.json().catch(() => ({}));
      console.error("Erro ao salvar transação:", error);
      alert(error.message || "Erro desconhecido ao salvar transação.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Descrição
        </label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Valor (R$)
        </label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Data</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Tipo</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
        >
          <option value={TransactionType.RECEITA}>Receita</option>
          <option value={TransactionType.DESPESA}>Despesa</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Categoria
        </label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
          required
        >
          <option value="">Selecione...</option>
          {categories
            .filter((cat) => cat.type === form.type)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Forma de pagamento
        </label>
        <select
          name="paymentMethodId"
          value={form.paymentMethodId}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
          required
        >
          <option value="">Selecione...</option>
          {paymentMethods.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.name}
            </option>
          ))}
        </select>
      </div>

      {/* =========================
          NOVO: seção de parcelamento (só na criação)
         ========================= */}
      {!transactionId && (
        <div className="rounded-xl border border-gray-200 p-4 space-y-3 text-gray-800">
          <div className="flex items-center justify-between gap-3">
            <label className="font-medium text-gray-800">
              Repetir (parcelas)
            </label>
            <input
              type="number"
              min={1}
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number(e.target.value || 1))}
              className="w-24 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-right"
            />
          </div>

          <label className="flex items-center gap-3 text-gray-800">
            <input
              type="checkbox"
              checked={distributeTotal}
              onChange={(e) => setDistributeTotal(e.target.checked)}
            />
            <span>Distribuir o valor TOTAL entre as parcelas</span>
          </label>

          {/* Pré-visualização */}
          {preview.length > 0 && (
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-sm font-semibold mb-2 text-gray-800">
                Pré-visualização
              </div>
              <ul className="divide-y divide-gray-200">
                {preview.map((p) => (
                  <li
                    key={p.index}
                    className="py-2 flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">
                      Parcela {p.index}/{p.total}
                    </span>
                    <span className="text-gray-900">
                      {p.date
                        ? p.date.toLocaleDateString("pt-BR")
                        : "--/--/----"}{" "}
                      — {formatBRL(p.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg w-full font-semibold"
      >
        {transactionId ? "Atualizar" : "Cadastrar"} Transação
      </button>
    </form>
  );
}
