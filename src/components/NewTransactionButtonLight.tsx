"use client";

import { Plus } from "lucide-react";

type Props = {
  onClick: () => void;
  className?: string;
};

export function NewTransactionButtonLight({ onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-xl
                  bg-indigo-600 px-4 text-sm font-semibold text-white
                  shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2
                  focus:ring-indigo-500 ${className}`}
    >
      <Plus className="h-4 w-4" />
      Nova transação
    </button>
  );
}
