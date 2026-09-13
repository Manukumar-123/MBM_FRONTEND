"use client";

import { useState } from "react";
import Button from "../ui/Button";

const PLATFORM_ICONS = {
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></>,
  x: <path d="M4 4l16 16M20 4 4 20" />,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="3" /><path d="m10 9 5 3-5 3Z" /></>,
  website: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
};

export default function ProfileSocialPanel({ profile, socialLinks: initialLinks }) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [links, setLinks] = useState(initialLinks);
  const [newPlatform, setNewPlatform] = useState("website");
  const [newUrl, setNewUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
  }

  function handleAvatarRemove() {
    setAvatarUrl("");
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleAddLink(e) {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setLinks((prev) => [...prev, { _id: `s${Date.now()}`, platform: newPlatform, url: newUrl.trim() }]);
    setNewUrl("");
  }

  function handleRemoveLink(id) {
    setLinks((prev) => prev.filter((l) => l._id !== id));
  }

  return (
    <div>
      <h1 className="text-[22px] font-bold font-display mb-1">Profile &amp; social</h1>
      <p className="text-gray-400 text-[13.5px] mb-6">This is what readers see on your public profile.</p>

      <div className="flex items-center gap-4.5 mb-7">
        <div className="relative w-[84px] h-[84px] group">
          <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-cyan to-blue grid place-items-center overflow-hidden">
            {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-[#06121A]">{initials}</span>}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="w-[30px] h-[30px] rounded-full bg-white/15 hover:bg-white/28 grid place-items-center cursor-pointer text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h3l2-3h6l2 3h3v13H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            <button onClick={handleAvatarRemove} className="w-[30px] h-[30px] rounded-full bg-white/15 hover:bg-danger grid place-items-center text-white" aria-label="Remove photo">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" /></svg>
            </button>
          </div>
        </div>
        <div>
          <div className="text-sm font-bold mb-0.5">Profile photo</div>
          <div className="text-xs text-gray-600">JPG or PNG, square, at least 400×400px</div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Display name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface border border-borderline rounded-lg px-3.5 py-2.5 text-[13.5px]" />
      </div>
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-surface border border-borderline rounded-lg px-3.5 py-2.5 text-[13.5px] min-h-[76px]" />
      </div>

      <h2 className="text-sm font-bold mb-3">Social links</h2>
      <div className="flex flex-col gap-2 mb-3">
        {links.map((l) => (
          <div key={l._id} className="flex items-center gap-2.5 bg-surface border border-borderline-soft rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-[9px] grid place-items-center bg-surface-2 text-cyan flex-shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{PLATFORM_ICONS[l.platform] || PLATFORM_ICONS.website}</svg>
            </div>
            <span className="flex-1 text-[13px] text-gray-400 truncate">{l.url}</span>
            <button onClick={() => handleRemoveLink(l._id)} className="w-[26px] h-[26px] grid place-items-center rounded-full bg-surface-2 border border-borderline-soft text-gray-500 hover:text-danger hover:border-danger/40" aria-label="Remove link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        {links.length === 0 && <div className="text-sm text-gray-600">No social links yet.</div>}
      </div>

      <form onSubmit={handleAddLink} className="flex gap-2">
        <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="bg-surface border border-borderline rounded-lg px-2.5 text-[13px]">
          <option value="website">Website</option>
          <option value="instagram">Instagram</option>
          <option value="x">X / Twitter</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
          <option value="goodreads">Goodreads</option>
        </select>
        <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Paste a link" className="flex-1 bg-surface border border-borderline rounded-lg px-3 py-2 text-[13px]" />
        <button className="bg-surface border border-borderline rounded-lg px-3.5 text-xs font-bold hover:border-cyan hover:text-cyan">Add</button>
      </form>

      <Button shape="rect" onClick={handleSave} className="mt-7">
        {saved ? "Saved!" : "Save changes"}
      </Button>
    </div>
  );
}
