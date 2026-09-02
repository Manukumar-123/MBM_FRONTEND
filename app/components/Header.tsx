"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { Sun, Moon, User as UserIcon, LogOut } from "lucide-react";
import useAuthStore from "../store/authStore";

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
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, accessToken, clearAccessToken, clearUser } = useAuthStore();

  useEffect(() => setMounted(true), []);

  // Close the account dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
  };

  const handleLogout = () => {
    clearAccessToken();
    clearUser();
    setAvatarOpen(false);
    router.replace("/login");
  };

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
      className={`fixed z-1000 w-full top-0 z-50 transition-all backdrop-blur-md bg-white/80 dark:bg-black/30 ${
        isScrolled ? "bg-white/95 dark:bg-black/70 shadow-lg " : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:py-6 relative">
        <Link href="/" className="text-gray-900 dark:text-white font-bold text-2xl">
          MeBookMeta
        </Link>

        {/* Search bar */}
        <div className="relative w-64 hidden md:block">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2 rounded-full border-2 border-gray-300 dark:border-[#323232] text-gray-900 dark:text-white bg-white/50 dark:bg-transparent placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
          {filteredProfiles.length > 0 && (
            <div
              ref={resultRef}
              className="absolute mt-2 w-full bg-white dark:bg-black border-2 text-gray-900 dark:text-white border-gray-200 dark:border-[#323232] rounded-2xl shadow-lg p-2 z-50"
            >
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <span className="text-gray-900 dark:text-white">
                    {profile.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="hidden md:flex gap-6 text-gray-900 dark:text-white font-medium">
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

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full border border-gray-300 dark:border-[#323232] text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {/* Account avatar */}
        {accessToken && user && (
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarOpen((prev) => !prev)}
              className="w-9 h-9 md:w-10 md:h-10 cursor-pointer rounded-full flex items-center justify-center bg-green-500 text-white font-semibold text-sm border-2 border-white/50 dark:border-black/50 hover:opacity-90 transition"
              aria-label="Account menu"
              aria-expanded={avatarOpen}
            >
              {getInitials(user.name)}
            </button>

            {avatarOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-[#323232] rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-[#222]">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name || "Unnamed User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.identifier}
                  </p>
                </div>
                <Link
                  href={`/profile/${user._id}`}
                  onClick={() => setAvatarOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                >
                  <UserIcon size={16} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile menu toggle */}
        <div className="md:hidden text-gray-900 dark:text-white">☰</div>
      </div>
    </header>
  );
}
