"use client";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
} from "recharts";
import { formatBRL } from "@/utils/currency";

export type CashPoint = {
  day: number;
  receita: number;
  despesa: number;
  saldo: number;
};

export function CashflowChart({ data }: { data: CashPoint[] }) {
  return (
    <div className="h-56 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-medium text-gray-700">
        Cashflow diário
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#4b5563" }} />
          <YAxis
            tick={{ fontSize: 12, fill: "#4b5563" }}
            tickFormatter={(v) => formatBRL(v).replace("R$", "")}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              color: "#111827",
            }}
            formatter={(value: number | string) => formatBRL(value as number)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="receita"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="despesa"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="saldo"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
