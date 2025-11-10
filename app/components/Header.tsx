"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

type Profile = {
  id: number;
  name: string;
  image: string;
};

const profiles: Profile[] = [
  { id: 1, name: "John Doe", image: "https://picsum.photos/id/237/200/300" },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 3,
    name: "Michael Brown",
    image: "https://picsum.photos/200/300/?blur=2",
  },
  { id: 4, name: "Lisa Johnson", image: "https://picsum.photos/200/300/?blur" },

  { id: 5, name: "John Doe 2", image: "https://picsum.photos/id/237/200/300" },
  {
    id: 6,
    name: "Jane Smith 2",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 7,
    name: "Michael Brown 2",
    image: "https://picsum.photos/200/300/?blur=2",
  },
  {
    id: 8,
    name: "Lisa Johnson 2",
    image: "https://picsum.photos/200/300/?blur",
  },

  { id: 9, name: "John Doe 3", image: "https://picsum.photos/id/237/200/300" },
  {
    id: 10,
    name: "Jane Smith 3",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 11,
    name: "Michael Brown 3",
    image: "https://picsum.photos/200/300/?blur=2",
  },
  {
    id: 12,
    name: "Lisa Johnson 3",
    image: "https://picsum.photos/200/300/?blur",
  },

  { id: 13, name: "John Doe 4", image: "https://picsum.photos/id/237/200/300" },
  {
    id: 14,
    name: "Jane Smith 4",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 15,
    name: "Michael Brown 4",
    image: "https://picsum.photos/200/300/?blur=2",
  },
  {
    id: 16,
    name: "Lisa Johnson 4",
    image: "https://picsum.photos/200/300/?blur",
  },

  { id: 17, name: "John Doe 5", image: "https://picsum.photos/id/237/200/300" },
  {
    id: 18,
    name: "Jane Smith 5",
    image: "https://picsum.photos/200/300?grayscale",
  },
  {
    id: 19,
    name: "Michael Brown 5",
    image: "https://picsum.photos/200/300/?blur=2",
  },
  {
    id: 20,
    name: "Lisa Johnson 5",
    image: "https://picsum.photos/200/300/?blur",
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
      p.name.toLowerCase().includes(query.toLowerCase())
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
        }
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
        <div className="text-white font-bold text-2xl">M_B_META</div>

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
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
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
