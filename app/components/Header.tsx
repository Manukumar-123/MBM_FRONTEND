"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useTheme } from "next-themes";
import {
  Bell,
  BookOpen,
  Loader2,
  LogOut,
  Menu,
  Moon,
  PenLine,
  Search,
  Settings,
  Sun,
  Upload,
  User as UserIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { getFileUrl, searchGlobally, type IGlobalSearchResults } from "@/api/api";
import useAuthStore from "../store/authStore";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IGlobalSearchResults>({ creators: [], books: [], videos: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) setAvatarOpen(false);
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches("input, textarea, select, [contenteditable='true']");
      if (event.key === "/" && !isTyping && searchRef.current?.offsetParent) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setAvatarOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  };

  const handleLogout = () => {
    clearAccessToken();
    clearUser();
    setAvatarOpen(false);
    setMobileMenuOpen(false);
    router.replace("/login");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

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
  const profileHref = user?._id ? `/profile/${user._id}` : "/login";
  const avatarUrl = user?.avatarUrl ? getFileUrl(user.avatarUrl) : null;
  const closeMenus = () => {
    setAvatarOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header ref={headerRef} className={`site-header-shell${isScrolled ? " is-scrolled" : ""}`}>
      <div className="site-header-wrap">
        <Link href="/" className="site-header-logo" aria-label="MeBookMeta home">
          <span className="site-header-mark" aria-hidden="true" />
          MeBookMeta
        </Link>

        <div className="site-header-search" ref={searchRef} role="search">
          <Search size={17} className="site-header-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="search"
            role="combobox"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); }}
            placeholder="Search creators, works, tags"
            aria-label="Search MeBookMeta"
            aria-expanded={searchOpen && query.trim().length >= 2}
            aria-controls="site-header-search-results"
            autoComplete="off"
            spellCheck={false}
          />
          {searchLoading ? (
            <Loader2 size={16} className="site-header-search-clear animate-spin" aria-label="Searching" />
          ) : query ? (
            <button type="button" className="site-header-search-clear" aria-label="Clear search" onClick={() => { setQuery(""); setSearchOpen(false); }}>
              <X size={15} />
            </button>
          ) : <kbd>/</kbd>}

          {searchOpen && query.trim().length >= 2 && (
            <div className="site-header-search-results" id="site-header-search-results" role="listbox" aria-label="Search suggestions">
              {searchLoading && <p className="site-header-search-state">Searching…</p>}
              {!searchLoading && !hasSearchResults && <p className="site-header-search-state">No matching creators or content.</p>}
              {searchResults.creators.length > 0 && <section><p className="site-header-search-heading">Creators</p>{searchResults.creators.map((creator) => <button role="option" aria-selected="false" key={creator._id} onClick={() => { setSearchOpen(false); router.push(`/profile/${creator._id}`); }}><span>{creator.name || "Creator"}</span><small>{creator.role || "Creator"}</small></button>)}</section>}
              {searchResults.books.length > 0 && <section><p className="site-header-search-heading">Works</p>{searchResults.books.map((book) => <button role="option" aria-selected="false" key={book._id} onClick={() => { setSearchOpen(false); router.push(`/books/${book._id}`); }}><span>{book.title}</span><small>by {book.author}</small></button>)}</section>}
              {searchResults.videos.length > 0 && <section><p className="site-header-search-heading">Videos</p>{searchResults.videos.map((video) => <button role="option" aria-selected="false" key={video._id} onClick={() => { setSearchOpen(false); router.push(`/profile/${video.userId}`); }}><span>{video.title}</span><small>Creator video</small></button>)}</section>}
            </div>
          )}
        </div>

        <nav className="site-header-nav" aria-label="Main navigation">
          <Link href="/">About</Link>
          <Link href="/">Contact us</Link>
        </nav>

        <div className="site-header-actions">
          {mounted && (
            <button type="button" className="site-header-icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme" title="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {accessToken && user ? (
            <>
              {(user.role === "author" || user.role === "writer") && (
                <Link href="/work" className="site-header-upload"><Upload size={15} /><span>Upload work</span></Link>
              )}
              <button type="button" className="site-header-icon-btn site-header-notifications" aria-label="Notifications" title="Notifications" onClick={() => toast("Notifications are not available yet.")}>
                <Bell size={17} />
              </button>
              <div className="site-header-account" ref={avatarRef}>
                <button type="button" className="site-header-avatar" onClick={() => setAvatarOpen((open) => !open)} aria-label="Account menu" aria-haspopup="menu" aria-expanded={avatarOpen}>
                  {avatarUrl ? <Image src={avatarUrl} alt="" width={40} height={40} unoptimized /> : getInitials(user.name)}
                </button>
                {avatarOpen && (
                  <div className="site-header-menu" role="menu">
                    <div className="site-header-menu-user">
                      <div className="site-header-menu-avatar">{avatarUrl ? <Image src={avatarUrl} alt="" width={40} height={40} unoptimized /> : getInitials(user.name)}</div>
                      <div className="site-header-menu-identity"><strong>{user.name || "Unnamed User"}</strong><small>{user.identifier}</small><span>{user.role || "Member"}</span></div>
                    </div>
                    <Link href={profileHref} role="menuitem" onClick={closeMenus}><UserIcon size={17} />My profile</Link>
                    <Link href={`${profileHref}?tab=works`} role="menuitem" onClick={closeMenus}><BookOpen size={17} />My works</Link>
                    <Link href={`${profileHref}?tab=posts`} role="menuitem" onClick={closeMenus}><PenLine size={17} />My posts</Link>
                    <Link href="/settings" role="menuitem" onClick={closeMenus}><Settings size={17} />Settings</Link>
                    <hr />
                    <button type="button" role="menuitem" className="is-danger" onClick={handleLogout}><LogOut size={17} />Log out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="site-header-auth-actions">
              <Link href="/login" className="site-header-login">Login</Link>
              <Link href="/signup" className="site-header-signup">Sign up</Link>
            </div>
          )}

          <button type="button" className="site-header-mobile-toggle" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="site-header-mobile-menu">
            <Link href="/" onClick={closeMenus}>About</Link>
            <Link href="/" onClick={closeMenus}>Contact us</Link>
            {accessToken && user ? (
              <>
                <Link href={profileHref} onClick={closeMenus}>My profile</Link>
                <Link href={`${profileHref}?tab=works`} onClick={closeMenus}>My works</Link>
                <Link href={`${profileHref}?tab=posts`} onClick={closeMenus}>My posts</Link>
                <Link href="/settings" onClick={closeMenus}>Settings</Link>
                {(user.role === "author" || user.role === "writer") && <Link href="/work" onClick={closeMenus}>Upload work</Link>}
                <button type="button" className="is-danger" onClick={handleLogout}><LogOut size={16} />Log out</button>
              </>
            ) : (
              <div className="site-header-mobile-auth"><Link href="/login" onClick={closeMenus}>Login</Link><Link href="/signup" onClick={closeMenus}>Sign up</Link></div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
