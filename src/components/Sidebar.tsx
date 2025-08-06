// src/components/Sidebar.tsx
"use client";

import { JSX, useState } from "react";
import { FiHome, FiPieChart, FiCreditCard, FiSettings } from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`bg-blue-900 text-white h-screen p-4 ${
        open ? "w-64" : "w-20"
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-xl font-bold ${!open && "hidden"}`}>Ecofirst</h1>
        <button onClick={() => setOpen(!open)}>≡</button>
      </div>
      <nav className="space-y-4">
        <SidebarItem icon={<FiHome />} label="Início" open={open} />
        <SidebarItem icon={<FiPieChart />} label="Despesas" open={open} />
        <SidebarItem icon={<FiCreditCard />} label="Cartões" open={open} />
        <SidebarItem icon={<FiSettings />} label="Configurações" open={open} />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  open,
}: {
  icon: JSX.Element;
  label: string;
  open: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-blue-700 rounded cursor-pointer">
      {icon}
      {open && <span>{label}</span>}
    </div>
  );
}
