import {
  HomeIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

export const menuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Nova Trasação",
    href: "/transactions/new",
    icon: PlusCircleIcon,
  },
  {
    label: "Ver Trasações",
    href: "/transactions/list",
    icon: ListBulletIcon,
  },
  {
    label: "Configurações",
    href: "#",
    icon: Cog6ToothIcon,
  },
];
