// src/components/ResumoCard.tsx
import { ReactNode } from "react";

interface ResumoCardProps {
  titulo: string;
  valor: string;
  icon?: ReactNode;
  bgColor?: string;
}

export default function ResumoCard({
  titulo,
  valor,
  icon,
  bgColor = "bg-white",
}: ResumoCardProps) {
  return (
    <div
      className={`rounded-xl shadow p-5 flex items-center justify-between ${bgColor}`}
    >
      <div>
        <h3 className="text-sm text-gray-500">{titulo}</h3>
        <p className="text-xl font-bold text-gray-800">{valor}</p>
      </div>
      <div className="text-3xl text-blue-600">{icon}</div>
    </div>
  );
}
