"use client";

import { useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/auth";
import { buildApiUrl } from "@/lib/api";
import { AUTH_LOGOUT_PATH } from "@/lib/auth-endpoints";

type HeaderProps = {
  toggleSidebar: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch(buildApiUrl(AUTH_LOGOUT_PATH), { method: "POST" });
    } catch {
      // Logout local mesmo sem resposta do backend.
    } finally {
      clearAuthToken();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="bg-blue-600 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none md:hidden"
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">Ecofirst</h1>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md bg-blue-700 px-3 py-1.5 text-sm font-medium transition hover:bg-blue-800"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
