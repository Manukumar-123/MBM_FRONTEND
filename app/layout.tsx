"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
// app/layout.tsx
import Footer from "./components/Footer";
import Header from "./components/Header";
import BackButton from "./components/BackButton";
import AnimatedBackground from "./components/AnimatedBackground";
import "./globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ add this
import { ThemeProvider } from "./components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient(); // ✅ add this
  const pathname = usePathname();
  const route = pathname?.replace(/\/+$/, "") || "";
  const isAdmin = route.startsWith("/admin");
  const isAuthPage = route === "/login" || route === "/signup";
  const hideSiteChrome = !pathname || isAdmin || isAuthPage;
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <Toaster
            reverseOrder={false}
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: "!bg-white !text-slate-900 border border-slate-200 shadow-xl dark:!bg-[#14131a] dark:!text-white dark:border-white/10",
            }}
          />
          <QueryClientProvider client={queryClient}>
            {" "}
            {/* ✅ wrap with QueryClientProvider */}
            {!hideSiteChrome && <AnimatedBackground />}
            <div className="relative z-10">
              {!hideSiteChrome && <Header />}
              {!isAdmin && pathname && <BackButton />}
              <main>{children}</main>
              {!hideSiteChrome && <Footer />}
            </div>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

