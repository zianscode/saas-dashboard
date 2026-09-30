import {
  LayoutDashboard,
  Package,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Menu",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "#", isActive: true },
      { label: "Material", icon: Package, href: "#" },
      { label: "Proyek", icon: FolderKanban, href: "#" },
      { label: "Laporan", icon: BarChart3, href: "#" },
    ],
  },
  {
    label: "Manajemen",
    items: [
      { label: "Tim", icon: Users, href: "#" },
      { label: "Pengaturan", icon: Settings, href: "#" },
    ],
  },
];

export const SIDEBAR_FOOTER_ITEMS = [
  { label: "Keluar", icon: LogOut, href: "#" },
];
