"use client";
type HeaderProps = {
  toggleSidebar: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <button
        onClick={toggleSidebar}
        className="text-white focus:outline-none md:hidden"
      >
        ☰
      </button>
      <h1 className="text-lg font-semibold">Ecofirst</h1>
    </header>
  );
}
