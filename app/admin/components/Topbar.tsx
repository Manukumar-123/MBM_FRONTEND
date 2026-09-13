"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import Avatar from "./Avatar";

export default function Topbar({
  collapsed,
  title,
  adminName = "Admin",
}: {
  collapsed: boolean;
  title: string;
  adminName?: string;
}) {
  return (
    <header
      className={`h-16 fixed top-0 right-0 ${
        collapsed ? "left-[76px]" : "left-64"
      } z-20 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#08080b]/80 backdrop-blur transition-all duration-200`}
    >
      <div className="flex items-center gap-2 text-[13px] text-[#8a8a98]">
        <span>Admin</span>
        <span className="text-[#3f3f4a]">/</span>
        <span className="text-white">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] w-64">
          <Search size={15} className="text-[#5f5f6e]" />
          <input
            placeholder="Search creators, works…"
            className="bg-transparent outline-none text-[13px] text-white placeholder-[#5f5f6e] w-full"
          />
        </div>
        <button className="relative text-[#9a9aa8] hover:text-white transition-colors" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>
        <button className="flex items-center gap-2">
          <Avatar name={adminName} size={30} />
          <ChevronDown size={14} className="text-[#8a8a98]" />
        </button>
      </div>
    </header>
  );
}
