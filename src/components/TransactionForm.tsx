"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionType } from "@/app/shared-types/transaction-type.enum";

interface TransactionFormProps {
  transactionId?: number;
  initialData?: Partial<TransactionFormData>;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  date: string;
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
    date: initialData?.date || "",
    type: initialData?.type || TransactionType.RECEITA,
    categoryId: initialData?.categoryId || 0,
    paymentMethodId: initialData?.paymentMethodId || 0,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  useEffect(() => {
    fetch(`${apiBaseUrl}/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Erro ao buscar categorias:", err));

    fetch(`${apiBaseUrl}/payment-methods`)
      .then((res) => res.json())
      .then(setPaymentMethods)
      .catch((err) =>
        console.error("Erro ao buscar métodos de pagamento:", err)
      );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(parseFloat(form.amount).toFixed(2)),
      categoryId: Number(form.categoryId),
      paymentMethodId: Number(form.paymentMethodId),
    };

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
      router.push("/transactions");
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

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg w-full font-semibold"
      >
        {transactionId ? "Atualizar" : "Cadastrar"} Transação
      </button>
    </form>
  );
}
