"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const currentPath = usePathname();
  const pathname = currentPath?.replace(/\/+$/, "") || "";
  const editWorkMatch = pathname.match(/^\/books\/([^/]+)\/edit$/);

  const isInnerPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/profile/") ||
    pathname === "/searchAll" ||
    pathname.startsWith("/work/pitch-alley") ||
    pathname.startsWith("/work/ask-universe") ||
    pathname === "/workList" ||
    pathname === "/book" ||
    pathname.startsWith("/book/") ||
    Boolean(editWorkMatch);

  if (!isInnerPage) return null;

  const handleBack = () => {
    if (editWorkMatch) {
      router.push(`/books/${editWorkMatch[1]}`);
      return;
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="fixed left-4 top-24 z-40 rounded-sm border border-line bg-elevated px-6 py-3 font-body text-sm font-medium text-ink shadow-md transition-all hover:bg-surface md:left-6"
    >
      ← Back
    </button>
  );
}
