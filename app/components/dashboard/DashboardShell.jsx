"use client";

import { useState } from "react";

const NAV = [
  { id: "overview", label: "Overview", icon: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
  { id: "works", label: "My Works", icon: <path d="M4 19.5V6a2 2 0 0 1 2-2h13v15H6a2 2 0 1 1 0-4h13" /> },
  { id: "tags", label: "Tags & Categories", icon: <><path d="M12.5 3H4v8.5L13.5 21 21 13.5 12.5 3Z" /><circle cx="8.3" cy="7.3" r="1.3" /></> },
  { id: "pitch", label: "Pitch Alley", icon: <><rect x="2.5" y="5" width="14" height="14" rx="2" /><path d="m16.5 10 5-3v10l-5-3" /></>, badgeKey: "pitchPending" },
  { id: "universe", label: "Ask the Universe", icon: <path d="M12 2.5l2.6 5.9 6.4.7-4.8 4.4 1.3 6.3L12 16.8 6.5 19.8l1.3-6.3-4.8-4.4 6.4-.7Z" />, badgeKey: "activeRequests" },
];

const NAV_2 = [
  { id: "subscription", label: "Subscription", icon: <><rect x="2.5" y="5.5" width="19" height="13" rx="2" /><path d="M2.5 10h19" /></> },
  { id: "profile", label: "Profile & Social", icon: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.5-4 5-5.5 7.5-5.5s6 1.5 7.5 5.5" /></> },
];

const TITLES = Object.fromEntries([...NAV, ...NAV_2].map((n) => [n.id, n.label]));

export default function DashboardShell({ profile, badges = {}, panels }) {
  const [active, setActive] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  function goTo(id) {
    setActive(id);
    setMobileNavOpen(false);
  }

  function NavButton({ item, onSelect }) {
    return (
      <button
        onClick={() => onSelect(item.id)}
        className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold w-full text-left
          ${active === item.id ? "text-cyan bg-gradient-to-r from-cyan/10 to-transparent" : "text-gray-400 hover:text-white hover:bg-surface"}`}
      >
        {active === item.id && (
          <span className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-full bg-gradient-to-b from-cyan to-blue shadow-[0_0_8px_1px_rgba(47,211,240,0.5)]" />
        )}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{item.icon}</svg>
        {item.label}
        {item.badgeKey && badges[item.badgeKey] > 0 && (
          <span className="ml-auto text-[10.5px] font-bold bg-violet/20 text-violet px-1.5 py-0.5 rounded-full">
            {badges[item.badgeKey]}
          </span>
        )}
      </button>
    );
  }

  const NavList = ({ onSelect }) => (
    <nav className="flex flex-col gap-0.5 flex-1">
      {NAV.map((item) => <NavButton key={item.id} item={item} onSelect={onSelect} />)}
      <div className="h-px bg-borderline-soft my-3 mx-1.5" />
      {NAV_2.map((item) => <NavButton key={item.id} item={item} onSelect={onSelect} />)}
    </nav>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[232px_1fr] min-h-screen bg-mbg text-white">
      {/* Sidebar — desktop/tablet-landscape only */}
      <aside className="hidden md:flex flex-col border-r border-borderline-soft p-3.5 sticky top-0 h-screen">
        <div className="flex items-center gap-2 text-[17px] font-bold px-2.5 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7FE3F5" strokeWidth="1.8"><path d="M4 5.5c2.2-1 5-1 8 0v13c-3-1-5.8-1-8 0v-13Z" /><path d="M20 5.5c-2.2-1-5-1-8 0v13c3-1 5.8-1 8 0v-13Z" /></svg>
          MeBookMeta
        </div>
        <NavList onSelect={goTo} />
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface border border-borderline-soft">
          <div className="w-[34px] h-[34px] rounded-lg grid place-items-center bg-gradient-to-br from-cyan to-blue text-[#06121A] font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="text-xs font-semibold">{profile.name}</div>
            <div className="text-[11px]" style={{ color: "#7FE3F5" }}>{profile.subscription?.plan === "creator_pro" ? "Creator Pro" : "Free plan"}</div>
          </div>
        </div>
      </aside>

      {/* Mobile/tablet-portrait nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-black/70" aria-label="Close menu" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-mbg border-r border-borderline-soft p-3.5 flex flex-col">
            <div className="flex items-center justify-between px-1.5 mb-6">
              <div className="flex items-center gap-2 text-[16px] font-bold">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7FE3F5" strokeWidth="1.8"><path d="M4 5.5c2.2-1 5-1 8 0v13c-3-1-5.8-1-8 0v-13Z" /><path d="M20 5.5c-2.2-1-5-1-8 0v13c3-1 5.8-1 8 0v-13Z" /></svg>
                MeBookMeta
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="w-8 h-8 grid place-items-center rounded-lg bg-surface border border-borderline-soft text-gray-400" aria-label="Close menu">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <NavList onSelect={goTo} />
          </div>
        </div>
      )}

      {/* Main */}
      <div>
        <div className="flex items-center gap-4 px-4 sm:px-7 py-4 border-b border-borderline-soft sticky top-0 bg-black/90 backdrop-blur z-20">
          <button onClick={() => setMobileNavOpen(true)} className="md:hidden w-9 h-9 grid place-items-center rounded-lg bg-surface border border-borderline-soft text-gray-300 flex-shrink-0" aria-label="Open menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="text-[16px] sm:text-[17px] font-bold mr-auto truncate">{TITLES[active]}</div>
          <div className="relative w-[220px] hidden sm:block">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input type="text" placeholder="Search your works..." className="w-full bg-surface border border-borderline rounded-lg py-2 pl-9 pr-3 text-[13px] placeholder:text-gray-600" />
          </div>
        </div>

        <div className="px-4 sm:px-7 py-6 pb-16 max-w-[980px]">
          {panels[active]}
        </div>
      </div>
    </div>
  );
}
