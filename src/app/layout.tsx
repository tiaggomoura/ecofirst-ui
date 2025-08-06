// src/app/layout.tsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ecofirst UI",
  description: "Controle de finanças pessoais com Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-soft text-gray-900">
        <div className="flex">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
