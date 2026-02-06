"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

type Profile = {
  id: number;
  name: string;
};

const profiles: Profile[] = [
  {
    id: 1,
    name: "Author / Writer / Publisher",
  },
  {
    id: 2,
    name: "Performance Art Creatives",
  },
  {
    id: 3,
    name: "Music, Recording & Production",
  },
  { id: 4, name: "Television, Film & News Media" },

  { id: 5, name: "Print, Internet, Streaming & Publishing" },
  {
    id: 6,
    name: "	Visual Art Creatives",
  },
];

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);

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

  // Search filtering
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredProfiles([]);
      return;
    }

    const results = profiles.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredProfiles(results);

    if (results.length > 0 && resultRef.current) {
      gsap.fromTo(
        resultRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power3.out",
        },
      );
    }
  }, [query]);

  return (
    <header
      ref={headerRef}
      className={`fixed z-1000 w-full top-0 z-50 transition-all backdrop-blur-md bg-black/30 ${
        isScrolled ? "bg-black/70 shadow-lg " : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:py-6 relative">
        <div className="text-white font-bold text-2xl">MeBookMeta</div>

        {/* Search bar */}
        <div className="relative w-64 hidden md:block">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2 rounded-full border-2 border-[#323232] text-white focus:outline-none"
          />
          {filteredProfiles.length > 0 && (
            <div
              ref={resultRef}
              className="absolute mt-2 w-full bg-black border-2 text-white border-[#323232] rounded-2xl shadow-lg p-2 z-50"
            >
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  <span className="text-white">{profile.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="hidden md:flex gap-6 text-white font-medium">
          <Link href="/">For creators</Link>
          <Link href="/">For fans</Link>
          <Link href="/">Partners</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact Us</Link>
        </nav>

        <Link
          href="/payment"
          className="hidden md:block bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition"
        >
          Join the Beta
        </Link>

        {/* Mobile menu toggle */}
        <div className="md:hidden text-white">☰</div>
      </div>
    </header>
  );
}
