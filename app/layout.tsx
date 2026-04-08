"use client";

import { Toaster } from "react-hot-toast";
// app/layout.tsx
import Footer from "./components/Footer";
import Header from "./components/Header";
import AnimatedBackground from "./components/AnimatedBackground";
import "./globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ add this

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient(); // ✅ add this
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Toaster
          reverseOrder={false}
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <QueryClientProvider client={queryClient}>
          {" "}
          {/* ✅ wrap with QueryClientProvider */}
          <AnimatedBackground />
          <div className="relative z-10">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
