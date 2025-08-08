// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white text-center text-sm py-3 w-full">
      Ecofirst © {new Date().getFullYear()} — Todos os direitos reservados.
    </footer>
  );
}
