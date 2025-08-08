// src/components/Sidebar.tsx
"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiPieChart,
  FiCreditCard,
  FiSettings,
  FiPlusCircle,
  FiList,
} from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`bg-blue-900 text-white flex-shrink-0 p-4 ${
        open ? "w-64" : "w-20"
      } h-screen transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-xl font-bold ${!open && "hidden"}`}>Ecofirst</h1>
        <button onClick={() => setOpen(!open)}>≡</button>
      </div>

      <nav className="space-y-4">
        <SidebarItem
          icon={<FiHome />}
          label="Início"
          href="/"
          open={open}
          active={pathname === "/"}
        />
        <SidebarItem
          icon={<FiPlusCircle />}
          label="Nova Transação"
          href="/transactions/new"
          open={open}
          active={pathname === "/transactions/new"}
        />
        <SidebarItem
          icon={<FiList />}
          label="Transações"
          href="/transactions/list"
          open={open}
          active={pathname.startsWith("/transactions/list")}
        />
        <SidebarItem
          icon={<FiCreditCard />}
          label="Cartões"
          href="/cards"
          open={open}
          active={pathname.startsWith("/cards")}
        />
        <SidebarItem
          icon={<FiSettings />}
          label="Configurações"
          href="/settings"
          open={open}
          active={pathname.startsWith("/settings")}
        />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  open,
  active,
}: {
  icon: JSX.Element;
  label: string;
  href: string;
  open: boolean;
  active: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-blue-700 ${
          active ? "bg-blue-800 font-semibold" : ""
        }`}
      >
        {icon}
        {open && <span>{label}</span>}
      </div>
    </Link>
  );
}
