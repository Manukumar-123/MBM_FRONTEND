"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";

const STATUS_STYLES = {
  published: "bg-teal/15 text-teal",
  in_review: "bg-amber/15 text-amber",
  draft: "bg-white/10 text-gray-400",
};

function WorkRow({ work, onChanged }) {
  function handleRemoveTag(tag) {
    const nextTags = work.tags.filter((t) => t !== tag);
    onChanged({ ...work, tags: nextTags });
  }

  function handleDelete() {
    if (!confirm(`Delete "${work.title}"? This cannot be undone.`)) return;
    onChanged(null, work._id);
  }

  function handleEditTitle() {
    const title = prompt("Work title", work.title);
    if (!title || title === work.title) return;
    onChanged({ ...work, title });
  }

  return (
    <div className="flex gap-4 bg-surface border border-borderline-soft hover:border-cyan/30 rounded-2xl p-4 mb-2.5 transition-colors">
      <div className="flex gap-1.5 flex-shrink-0">
        <div className="w-[52px] h-[72px] rounded-md bg-gradient-to-br from-violet to-blue" style={work.coverUrl ? { backgroundImage: `url(${work.coverUrl})`, backgroundSize: "cover" } : {}} />
        <div className="w-[52px] h-[72px] rounded-md bg-gradient-to-br from-[#5B4FA6] to-[#221C4D]" style={work.backCoverUrl ? { backgroundImage: `url(${work.backCoverUrl})`, backgroundSize: "cover" } : {}} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[15px] font-bold">{work.title}</span>
          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[work.status]}`}>
            {work.status.replace("_", " ")}
          </span>
        </div>
        <div className="text-xs text-gray-400 mb-2">{work.category || "Uncategorized"} {work.subtitle && `· ${work.subtitle}`}</div>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {(work.tags || []).length === 0 && <span className="text-[11.5px] text-gray-600">No tags yet</span>}
          {(work.tags || []).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1.5 bg-surface-2 border border-borderline-soft rounded-full pl-2.5 pr-1.5 py-0.5 text-[11.5px] text-gray-400">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="w-3.5 h-3.5 grid place-items-center text-gray-600 hover:text-danger" aria-label={`Remove ${tag}`}>✕</button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3.5 text-xs text-gray-500">
          <span>₹{work.price?.toFixed(2) ?? "0.00"}</span>
          <span>{work.license}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <Button icon onClick={handleEditTitle} aria-label="Edit work">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        </Button>
        <Button icon danger onClick={handleDelete} aria-label="Delete work">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" /></svg>
        </Button>
      </div>
    </div>
  );
}

export default function WorksPanel({ initialWorks }) {
  const [works, setWorks] = useState(initialWorks);

  function handleChanged(updated, deletedId) {
    if (deletedId) {
      setWorks((prev) => prev.filter((w) => w._id !== deletedId));
      return;
    }
    setWorks((prev) => prev.map((w) => (w._id === updated._id ? updated : w)));
  }

  return (
    <div>
      <h1 className="text-[22px] font-bold font-display mb-1">My works</h1>
      <p className="text-gray-400 text-[13.5px] mb-5">Manage your books — covers, tags, pricing and QR codes.</p>

      <Link
        href="/work"
        className="flex items-center justify-center gap-2.5 rounded-2xl p-4 mb-4 font-bold text-[13.5px] text-cyan-100
          bg-gradient-to-br from-violet/15 to-cyan/10 border border-cyan/25 hover:border-cyan/50 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
        Upload a new work
      </Link>

      {works.map((w) => (
        <WorkRow key={w._id} work={w} onChanged={handleChanged} />
      ))}
    </div>
  );
}
