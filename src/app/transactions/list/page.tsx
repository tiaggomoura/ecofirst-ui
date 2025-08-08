"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TransactionType } from "@/app/shared-types/transaction-type.enum";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryName: string;
  paymentMethodName: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (description) params.append("description", description);
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    params.append("page", String(page));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions/paginated?${params}`
    );
    const data = await res.json();

    setTransactions(data.items || []);
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => {
    fetchTransactions();
  }, [type, description, from, to, page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente deletar esta transação?")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) fetchTransactions();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transações</h2>

      {/* Filtros */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded p-2 text-gray-800 bg-white w-full"
        >
          <option value="">Todos os tipos</option>
          <option value="RECEITA">Receita</option>
          <option value="DESPESA">Despesa</option>
        </select>

        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 text-gray-800 rounded p-2 w-full"
        />

        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border border-gray-300 text-gray-800 rounded p-2 w-full"
        />

        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border border-gray-300 text-gray-800 rounded p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition w-full md:w-auto"
        >
          Filtrar
        </button>
      </form>

      {/* Tabela Responsiva */}

      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-sm text-left border-collapse table-auto">
          <thead className="bg-gray-100 font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Categoria</th>
              <th className="px-4 py-2">Pagamento</th>
              <th className="px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-800">{t.description}</td>
                  <td className="px-4 py-2 text-gray-800">{t.type}</td>
                  <td className="px-4 py-2 text-gray-800">R$ {t.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-800">{t.categoryName}</td>
                  <td className="px-4 py-2 text-gray-800">{t.paymentMethodName}</td>
                  <td className="px-4 py-2 text-center space-x-2 flex justify-center">
                    <Link
                      href={`/transactions/${t.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
