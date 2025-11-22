// app/layout.tsx
import { Toaster } from "sonner";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

export const metadata = {
  title: "EcoFirst app",
  description: "Economize seu tempo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AppLayout>{children}</AppLayout>
         <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
