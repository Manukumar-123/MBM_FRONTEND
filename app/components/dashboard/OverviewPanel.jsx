"use client";

import Link from "next/link";

const QUICK = [
  { id: "works", label: "Upload a new work", href: "/work", icon: <path d="M4 19.5V6a2 2 0 0 1 2-2h13v15H6a2 2 0 1 1 0-4h13" /> },
  { id: "pitch", label: "Upload a pitch video", tab: "pitch", icon: <><rect x="2.5" y="5" width="14" height="14" rx="2" /><path d="m16.5 10 5-3v10l-5-3" /></> },
  { id: "universe", label: "Start a new request", tab: "universe", icon: <path d="M12 2.5l2.6 5.9 6.4.7-4.8 4.4 1.3 6.3L12 16.8 6.5 19.8l1.3-6.3-4.8-4.4 6.4-.7Z" /> },
  { id: "profile", label: "Edit your profile", tab: "profile", icon: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.5-4 5-5.5 7.5-5.5s6 1.5 7.5 5.5" /></> },
];

export default function OverviewPanel({ profile, works, pitchVideos, askRequests, onNavigate }) {
  const stats = [
    { label: "Total works", value: works.length },
    { label: "Published", value: works.filter((w) => w.status === "published").length },
    { label: "Followers", value: profile.stats?.followers ?? 0 },
    { label: "Active requests", value: askRequests.length },
  ];

  return (
    <div>
      <h1 className="text-[22px] font-bold font-display mb-1">
        Welcome back, <span className="bg-gradient-to-r from-[#D6CCFF] via-[#9C8CF7] to-[#4FC3F0] bg-clip-text text-transparent">{profile.name.split(" ")[0]}</span>
      </h1>
      <p className="text-gray-400 text-[13.5px] mb-6">Here's how your work is doing across MeBookMeta.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface border border-borderline-soft rounded-2xl p-4">
            <b className="block font-display text-2xl font-bold">{s.value}</b>
            <span className="text-xs text-gray-400">{s.label}</span>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-bold mb-3.5">Quick actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
        {QUICK.map((q) =>
          q.href ? (
            <Link key={q.id} href={q.href} className="flex flex-col gap-2.5 bg-surface border border-borderline-soft rounded-2xl p-4 hover:border-cyan transition-colors">
              <div className="w-[34px] h-[34px] rounded-[10px] grid place-items-center bg-cyan/10 text-cyan">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{q.icon}</svg>
              </div>
              <span className="text-[13px] font-semibold">{q.label}</span>
            </Link>
          ) : (
            <button key={q.id} onClick={() => onNavigate(q.tab)} className="flex flex-col gap-2.5 bg-surface border border-borderline-soft rounded-2xl p-4 hover:border-cyan transition-colors text-left">
              <div className="w-[34px] h-[34px] rounded-[10px] grid place-items-center bg-cyan/10 text-cyan">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{q.icon}</svg>
              </div>
              <span className="text-[13px] font-semibold">{q.label}</span>
            </button>
          )
        )}
      </div>

      <h2 className="text-sm font-bold mb-3.5">Your works at a glance</h2>
      <div className="bg-surface border border-borderline-soft rounded-2xl overflow-hidden">
        {works.length === 0 && <div className="p-5 text-sm text-gray-500">No works yet — upload your first one to see it here.</div>}
        {works.slice(0, 4).map((w, i) => (
          <div key={w._id} className={`flex items-center gap-3 px-4 py-3 text-sm ${i !== 0 ? "border-t border-borderline-soft" : ""}`}>
            <span className="flex-1 font-medium">{w.title}</span>
            <span className="text-xs text-gray-500 capitalize">{w.status.replace("_", " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
