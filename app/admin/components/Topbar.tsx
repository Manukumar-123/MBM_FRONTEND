"use client";

import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import Avatar from "./Avatar";

export default function Topbar({
  collapsed,
  title,
  adminName = "Admin",
  onMenuClick,
}: {
  collapsed: boolean;
  title: string;
  adminName?: string;
  onMenuClick?: () => void;
}) {
  return (
    <header
      className={`h-16 fixed top-0 right-0 left-0 ${
        collapsed ? "lg:left-[76px]" : "lg:left-64"
      } z-20 flex items-center justify-between gap-3 px-4 sm:px-6 border-b border-white/[0.06] bg-[#08080b]/80 backdrop-blur transition-all duration-200`}
    >
      <div className="flex items-center gap-2 min-w-0 text-[13px] text-[#8a8a98]">
        <button
          onClick={onMenuClick}
          className="lg:hidden -ml-1 mr-1 p-1 max-md:p-2.5 max-md:-ml-2.5 max-md:mr-0 text-[#9a9aa8] hover:text-white transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="hidden sm:inline">Admin</span>
        <span className="hidden sm:inline text-[#3f3f4a]">/</span>
        <span className="text-white truncate">{title}</span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] w-48 lg:w-64">
          <Search size={15} className="text-[#5f5f6e]" />
          <input
            placeholder="Search creators, works…"
            className="bg-transparent outline-none text-[13px] text-white placeholder-[#5f5f6e] w-full"
          />
        </div>
        <button className="relative text-[#9a9aa8] hover:text-white transition-colors max-md:p-2.5 max-md:-m-1.5" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>
        <button className="flex items-center gap-2 max-md:min-h-10">
          <Avatar name={adminName} size={30} />
          <ChevronDown size={14} className="text-[#8a8a98]" />
        </button>
      </div>
    </header>
  );
}
