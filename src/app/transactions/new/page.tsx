import { TransactionForm } from "@/components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 sm:px-6 lg:px-8 px-4 pt-8 pb-24">
      <div className="w-full max-w-xl space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.01]">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Cadastrar Nova Transação
          </h2>

          <TransactionForm />
        </div>
      </div>
    </div>
  );
}
