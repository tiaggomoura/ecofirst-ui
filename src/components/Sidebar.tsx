"use client";

import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { menuItems } from "@/app/shared-types/menu-item";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* MOBILE SIDEBAR */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-blue-800 text-white w-64 h-screen fixed z-40 top-0 left-0 md:hidden"
      >
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="h-full p-4 space-y-4">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 hover:text-blue-300 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </motion.aside>

      {/* DESKTOP SIDEBAR (sem animação) */}
      <aside className="bg-blue-800 text-white w-64 h-screen hidden md:block">
        <nav className="h-full p-4 space-y-4">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 hover:text-blue-300 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
