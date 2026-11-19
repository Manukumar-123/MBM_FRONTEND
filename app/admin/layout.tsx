"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAdminAuthStore from "../store/adminAuthStore";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Overview",
  "/admin/works": "Works",
  "/admin/category": "Categories & tags",
  "/admin/subcategory": "Categories & tags",
  "/admin/pitch-alley": "Pitch Alley",
  "/admin/ask-the-universe": "Ask the Universe",
  "/admin/creators": "Creators",
  "/admin/subscriptions": "Subscriptions",
  "/admin/moderation": "Reports queue",
  "/admin/settings": "Settings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminToken, hasHydrated } = useAdminAuthStore();
  const [checked, setChecked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Wait for the persisted token to load from localStorage before deciding
    // to redirect, otherwise every hard reload bounces straight to login.
    if (!hasHydrated) return;

    if (!isLoginPage && !adminToken) {
      router.replace("/admin/login");
      return;
    }
    setChecked(true);
  }, [isLoginPage, adminToken, hasHydrated, router]);

  // Close the mobile drawer on navigation and when growing to the lg breakpoint.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (isLoginPage) return <>{children}</>;

  if (!hasHydrated || !adminToken || !checked) return null;

  return (
    <div className="min-h-screen bg-[#08080b] overflow-x-clip">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Topbar
        collapsed={collapsed}
        title={TITLES[pathname] ?? ""}
        onMenuClick={() => setMobileOpen(true)}
      />
      <main
        className={`${collapsed ? "lg:ml-[76px]" : "lg:ml-64"} pt-16 transition-all duration-200`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] min-w-0">{children}</div>
      </main>
    </div>
  );
}
