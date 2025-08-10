import { TransactionStatus } from "@/types/transaction";

export function StatusBadgeLight({
  status,
  className = "",
}: {
  status: TransactionStatus;
  className?: string;
}) {
  const map: Record<TransactionStatus, string> = {
    PENDENTE: "bg-amber-100 text-amber-800 border border-amber-200",
    PAGO: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    RECEBIDO: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    ATRASADO: "bg-rose-100 text-rose-800 border border-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${map[status]} ${className}`}
    >
      {status}
    </span>
  );
}
