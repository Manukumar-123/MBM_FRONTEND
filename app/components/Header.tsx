"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { Sun, Moon, User as UserIcon, LogOut, Search } from "lucide-react";
import useAuthStore from "../store/authStore";
import { searchGlobally, IGlobalSearchResults } from "@/api/api";

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IGlobalSearchResults>({ creators: [], books: [], videos: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, accessToken, clearAccessToken, clearUser } = useAuthStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setSearchResults({ creators: [], books: [], videos: [] });
      setSearchLoading(false);
      return;
    }
    setSearchResults({ creators: [], books: [], videos: [] });
    setSearchLoading(true);
    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const results = await searchGlobally(term);
        if (active) setSearchResults(results);
      } catch {
        if (active) setSearchResults({ creators: [], books: [], videos: [] });
      } finally {
        if (active) setSearchLoading(false);
      }
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    // GSAP entrance animation (fromTo keeps the header visible by default even
    // if this tween gets interrupted, instead of getting stuck at opacity 0)
    let tween: gsap.core.Tween | undefined;
    if (headerRef.current) {
      tween = gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          overwrite: "auto",
          clearProps: "opacity,transform",
        },
      );
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tween?.kill();
    };
  }, []);

  const hasSearchResults = searchResults.creators.length + searchResults.books.length + searchResults.videos.length > 0;

  return (
    <header
      ref={headerRef}
      className={`fixed w-full top-0 z-50 transition-all backdrop-blur-md bg-white/80 dark:bg-black/30 ${
        isScrolled ? "bg-white/95 dark:bg-black/70 shadow-lg " : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:py-6 relative">
        <Link href="/" className="text-gray-900 dark:text-white font-bold text-2xl">
          MeBookMeta
        </Link>

        {/* Search bar */}
        <div className="relative w-64 hidden md:block" ref={searchRef}>
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => { if (e.key === "Escape") setSearchOpen(false); }}
            placeholder="Search creators and works"
            aria-label="Search creators and works"
            className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-300 dark:border-[#323232] text-gray-900 dark:text-white bg-white/50 dark:bg-transparent placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
          {searchOpen && query.trim().length >= 2 && (
            <div className="absolute mt-2 w-80 right-0 max-h-[70vh] overflow-y-auto bg-white dark:bg-black border text-gray-900 dark:text-white border-gray-200 dark:border-[#323232] rounded-2xl shadow-lg p-2 z-50">
              {searchLoading && <p className="p-3 text-sm text-gray-500">Searching…</p>}
              {!searchLoading && !hasSearchResults && <p className="p-3 text-sm text-gray-500">No matching creators or content.</p>}
              {searchResults.creators.length > 0 && <section><p className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Creators</p>{searchResults.creators.map((creator) => <button key={creator._id} onClick={() => { setSearchOpen(false); router.push(`/profile/${creator._id}`); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><span className="block text-sm font-medium">{creator.name || "Creator"}</span><span className="text-xs text-gray-500 capitalize">{creator.role || "Creator"}</span></button>)}</section>}
              {searchResults.books.length > 0 && <section><p className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Works</p>{searchResults.books.map((book) => <button key={book._id} onClick={() => { setSearchOpen(false); router.push(`/books/${book._id}`); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><span className="block text-sm font-medium">{book.title}</span><span className="text-xs text-gray-500">by {book.author}</span></button>)}</section>}
              {searchResults.videos.length > 0 && <section><p className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Videos</p>{searchResults.videos.map((video) => <button key={video._id} onClick={() => { setSearchOpen(false); router.push(`/profile/${video.userId}`); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><span className="block text-sm font-medium">{video.title}</span><span className="text-xs text-gray-500">Creator video</span></button>)}</section>}
            </div>
          )}
        </div>

        <nav className="hidden md:flex gap-6 text-gray-900 dark:text-white font-medium">
          {/* <Link href="/">For creators</Link>
          <Link href="/">For fans</Link>
          <Link href="/">Partners</Link> */}
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
     {/* Account / Auth */}
{accessToken && user ? (
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
) : (
  <div className="hidden md:flex items-center gap-3">
    <Link
      href="/login"
      className="px-4 py-2 rounded-full border border-gray-300 dark:border-[#323232] text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition font-medium"
    >
      Login
    </Link>

    <Link
      href="/signup"
      className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-80 transition"
    >
      Sign Up
    </Link>
  </div>
)}

        {/* Mobile menu toggle */}
        <div className="md:hidden text-gray-900 dark:text-white">☰</div>
      </div>
    </header>
  );
}
