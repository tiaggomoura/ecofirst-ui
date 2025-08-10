import { TransactionStatus } from '@/types/transaction';

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const map: Record<TransactionStatus, string> = {
    PENDENTE: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20',
    PAGO: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20',
    RECEBIDO: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20',
    ATRASADO: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/20',
  };
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${map[status]}`}>
      {status}
    </span>
  );
}
