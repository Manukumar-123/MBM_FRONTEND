"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Tags, LogOut } from "lucide-react";
import useAdminAuthStore from "../../store/adminAuthStore";

const navItems = [
  { href: "/admin/category", label: "Category", icon: LayoutGrid },
  { href: "/admin/subcategory", label: "Subcategory", icon: Tags },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAdminToken } = useAdminAuthStore();

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-[#2a2a2a] flex flex-col z-20">
      <div className="px-6 py-5 text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#2a2a2a]">
        Admin Panel
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1c1c1c]"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="m-3 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
