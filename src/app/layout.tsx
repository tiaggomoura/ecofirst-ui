// src/app/layout.tsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

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
      <body className="bg-soft text-gray-900 min-h-screen w-screen overflow-x-hidden flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex flex-col w-full min-h-screen">
            <Header />
            <main className="flex-grow p-4 sm:p-6">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
