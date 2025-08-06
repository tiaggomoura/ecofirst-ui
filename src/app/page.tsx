// src/app/page.tsx
"use client";

import ResumoCard from "@/components/ResumoCard";
import {
  FiDollarSign,
  FiArrowDownCircle,
  FiArrowUpCircle,
} from "react-icons/fi";

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <ResumoCard
        titulo="Saldo disponível"
        valor="R$ 4.750,00"
        icon={<FiDollarSign />}
        bgColor="bg-green-100"
      />
      <ResumoCard
        titulo="Receitas no mês"
        valor="R$ 9.500,00"
        icon={<FiArrowUpCircle />}
        bgColor="bg-blue-100"
      />
      <ResumoCard
        titulo="Despesas no mês"
        valor="R$ 4.750,00"
        icon={<FiArrowDownCircle />}
        bgColor="bg-red-100"
      />
    </div>
  );
}
