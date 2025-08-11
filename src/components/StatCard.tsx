import { motion } from "framer-motion";

type Props = {
  title: string;
  value: string;
  hint?: string;
  className?: string;
};

export function StatCard({ title, value, hint, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        // LIGHT THEME
        "rounded-2xl border border-gray-200 bg-white",
        "shadow-sm hover:shadow-md transition-shadow",
        "p-4 md:p-5",
        className ?? "",
      ].join(" ")}
    >
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-[22px] md:text-2xl font-semibold text-gray-900 tracking-tight">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </motion.div>
  );
}
