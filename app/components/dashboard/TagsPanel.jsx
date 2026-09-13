"use client";

import { useMemo, useState } from "react";
import Button from "../ui/Button";
import { genreColor } from "../../lib/genres";

function GenreChip({ name, selected, onToggle }) {
  const [c1, c2] = genreColor(name);
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold border-[1.5px] transition
        active:scale-95 ${selected ? "text-white border-transparent" : "text-gray-400 border-borderline bg-surface hover:border-white/25 hover:text-white"}`}
      style={selected ? { background: `linear-gradient(135deg, ${c1}, ${c2})` } : {}}
    >
      {selected && (
        <span className="w-3.5 h-3.5 rounded-full bg-white/90 grid place-items-center flex-shrink-0">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#06121A" strokeWidth="3.5"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
      )}
      {name}
    </button>
  );
}

export default function TagsPanel({ accountType, allGenres, initialSelectedGenres, initialCustomTags }) {
  const [selected, setSelected] = useState(new Set(initialSelectedGenres));
  const [query, setQuery] = useState("");
  const [customTags, setCustomTags] = useState(initialCustomTags.map((name) => ({ name })));
  const [newCustom, setNewCustom] = useState("");

  const filtered = useMemo(
    () => allGenres.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase())),
    [allGenres, query]
  );

  function handleToggle(name) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function handleAddCustom(e) {
    e.preventDefault();
    const name = newCustom.trim();
    if (!name) return;
    setCustomTags((prev) => [...prev, { name }]);
    setNewCustom("");
  }

  function handleDeleteCustom(name) {
    setCustomTags((prev) => prev.filter((t) => t.name !== name));
  }

  const accountLabel = accountType === "writer" ? "Writer" : "Author";
  const accountSub = accountType === "writer"
    ? "Chosen at signup — categories below are non-fiction categories for writers."
    : "Chosen at signup — genres below are fiction categories for authors.";

  return (
    <div>
      <h1 className="text-[22px] font-bold font-display mb-1">Tags &amp; categories</h1>
      <p className="text-gray-400 text-[13.5px] mb-5">
        Choose the genres that describe your work — used across your profile, search and recommendations.
      </p>

      {/* Account type is fixed at signup — a status readout, not a switcher */}
      <div className="flex items-center gap-3 bg-surface border border-borderline-soft rounded-2xl px-4 py-3 mb-6">
        <span className="w-[26px] h-[26px] rounded-lg flex-shrink-0" style={{ background: "linear-gradient(135deg,#F76B8A,#8B7CF6)" }} />
        <div>
          <div className="text-[13.5px] font-bold">Your account type: {accountLabel}</div>
          <div className="text-[11.5px] text-gray-600 mt-0.5">
            {accountSub} Change your account type from Profile &amp; Social.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold">Genres</h2>
        <span className="text-xs text-gray-600">{selected.size} of {allGenres.length} selected</span>
      </div>

      <div className="relative max-w-[320px] mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search genres..."
          className="w-full bg-surface border border-borderline rounded-lg py-2 pl-9 pr-3 text-[13px] placeholder:text-gray-600"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {filtered.length === 0 && <div className="text-sm text-gray-600 py-2">No matches for that search.</div>}
        {filtered.map((name) => (
          <GenreChip key={name} name={name} selected={selected.has(name)} onToggle={() => handleToggle(name)} />
        ))}
      </div>

      {/* Custom / meta tags — freeform, separate from the fixed genre list above */}
      <div className="flex items-center gap-2 mt-8 mb-1">
        <h2 className="text-sm font-bold">Custom / meta tags</h2>
        <span className="text-xs text-gray-600">{customTags.length} tags</span>
      </div>
      <p className="text-[12.5px] text-gray-600 mb-3">
        Free-form tags for search discoverability — not part of the fixed genre list above.
      </p>
      <form onSubmit={handleAddCustom} className="flex gap-2 mb-3 max-w-[420px]">
        <input
          value={newCustom}
          onChange={(e) => setNewCustom(e.target.value)}
          placeholder="Add a custom tag"
          className="flex-1 bg-surface border border-borderline rounded-lg px-3 py-2 text-[13px]"
        />
        <Button type="submit" shape="rect" variant="secondary" size="sm">Add</Button>
      </form>
      <div className="flex flex-col gap-1.5 max-w-[420px]">
        {customTags.length === 0 && <div className="text-sm text-gray-600">No custom tags yet.</div>}
        {customTags.map((t) => (
          <div key={t.name} className="flex items-center gap-2.5 bg-surface border border-borderline-soft rounded-lg px-3 py-2.5">
            <span className="text-[13px] font-semibold">{t.name}</span>
            <span className="text-[11.5px] text-gray-600 ml-1">SEO tag</span>
            <Button icon danger size="sm" className="ml-auto" onClick={() => handleDeleteCustom(t.name)} aria-label={`Delete ${t.name}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" /></svg>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
