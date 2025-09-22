"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    // GSAP entrance animation
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed w-full top-0 z-50 transition-all backdrop-blur-md bg-black/30  ${
        isScrolled ? "bg-black/70 shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:py-6">
        <div className="text-white font-bold text-2xl">M_B_META</div>
        <nav className="hidden md:flex gap-6 text-white font-medium">
          <Link href="/">For creators</Link>
          <Link href="/">For fans</Link>
          <Link href="/">Partners</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact Us</Link>
        </nav>
        <button className="hidden md:block bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition">
          Join the Beta
        </button>
        {/* Mobile menu toggle */}
        <div className="md:hidden text-white">☰</div>
      </div>
    </header>
  );
}
