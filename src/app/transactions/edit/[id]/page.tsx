"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TransactionFormData,
  TransactionForm,
} from "@/components/TransactionForm";

export default function EditTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Partial<TransactionFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    if (!id) return;

    const fetchTransaction = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/transactions/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Erro desconhecido ao buscar transação.",
          );
        }

        setData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Erro inesperado.");
        } else {
          setError("Erro inesperado.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  if (loading) {
    return <div className="p-4 text-gray-600">Carregando transação...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-4 text-red-600">
        Erro: {error || "Transação não encontrada"}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 sm:px-6 lg:px-8 px-4 pt-8 pb-24">
      <div className="w-full max-w-xl space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.01]">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Editar Transação
          </h2>

          <TransactionForm transactionId={Number(id)} initialData={data} />
        </div>
      </div>
    </div>
  );
}
