"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAdminAuthStore from "../store/adminAuthStore";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminToken } = useAdminAuthStore();
  const [checked, setChecked] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && !adminToken) {
      router.replace("/admin/login");
      return;
    }
    setChecked(true);
  }, [isLoginPage, adminToken, router]);

  if (isLoginPage) return <>{children}</>;

  if (!adminToken || !checked) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 md:ml-64">{children}</main>
    </div>
  );
}
