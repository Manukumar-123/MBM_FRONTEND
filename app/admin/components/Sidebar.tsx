"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Megaphone,
  Sparkles,
  Users,
  CreditCard,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import useAdminAuthStore from "../../store/adminAuthStore";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; count?: number };
type NavSection = { group: string | null; items: NavItem[] };

const NAV: NavSection[] = [
  // { group: null, items: [{ href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard }] },
  {
    group: "Content",
    items: [
      // { href: "/admin/works", label: "Works", icon: BookOpen },
      { href: "/admin/category", label: "Categories & tags", icon: Tags },
      { href: "/admin/subcategory", label: "Subcategories", icon: Tags },
      // { href: "/admin/pitch-alley", label: "Pitch Alley", icon: Megaphone },
      // { href: "/admin/ask-the-universe", label: "Ask the Universe", icon: Sparkles },
    ],
  },
  // { group: "People", items: [{ href: "/admin/creators", label: "Creators", icon: Users }] },
  // { group: "Commerce", items: [{ href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard }] },
  // {
  //   group: "Trust & safety",
  //   items: [{ href: "/admin/moderation", label: "Reports queue", icon: ShieldAlert }],
  // },
  { group: null, items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
];

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAdminToken } = useAdminAuthStore();

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 ${
        collapsed ? "w-[76px]" : "w-64"
      } bg-[#0c0c11] border-r border-white/[0.06] flex flex-col z-30 transition-all duration-200`}
    >
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500" />
            <span className="text-white font-medium text-[15px] tracking-tight">MeBookMeta</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-[#8a8a98] hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV.map((section, i) => (
          <div key={i} className="mb-4">
            {section.group && !collapsed && (
              <div className="px-3 mb-1.5 text-[11.5px] text-[#5f5f6e]">{section.group}</div>
            )}
            {section.group && <div className="mx-3 mb-2 border-t border-white/[0.05]" />}
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, count }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors relative ${
                      active
                        ? "text-white bg-white/[0.06]"
                        : "text-[#9a9aa8] hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-gradient-to-b from-cyan-400 to-violet-500" />
                    )}
                    <Icon size={17} className={active ? "text-cyan-300" : ""} />
                    {!collapsed && <span className="flex-1 text-left">{label}</span>}
                    {!collapsed && count ? (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-rose-400/15 text-rose-300">
                        {count}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#9a9aa8] hover:text-rose-300 hover:bg-rose-400/[0.06] transition-colors"
        >
          <LogOut size={17} />
          {!collapsed && "Log out"}
        </button>
      </div>
    </aside>
  );
}
