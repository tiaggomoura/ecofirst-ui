"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  label: string; // ex: "Agosto de 2025"
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

export function MonthNavLight({
  label,
  onPrev,
  onNext,
  className = "",
}: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Botão circular – mês anterior */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Mês anterior"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full
                   border border-gray-200 bg-white text-gray-700 shadow-sm
                   hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Pill com label do mês + chevron à direita (próximo mês) */}
      <div
        className="inline-flex items-center gap-2 rounded-full border border-gray-200
                   bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm"
      >
        <span className="font-medium">{label}</span>
        <button
          type="button"
          onClick={onNext}
          aria-label="Próximo mês"
          className="inline-flex h-6 w-6 items-center justify-center rounded-full
                     border border-gray-200 bg-white text-gray-600 hover:bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
