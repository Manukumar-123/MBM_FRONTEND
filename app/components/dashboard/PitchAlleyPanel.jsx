"use client";

import { useState } from "react";
import Button from "../ui/Button";

const STATUS_LABEL = { live: "Live", under_review: "Under review" };
const STATUS_STYLE = { live: "bg-teal text-[#06231C]", under_review: "bg-amber text-[#1A1206]" };

function AddVideoForm({ onAdded, onCancel }) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !videoUrl) return;
    onAdded({ _id: `p${Date.now()}`, title, videoUrl, status: "under_review", views: 0 });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-cyan/25 rounded-2xl p-4 mb-4 flex flex-col gap-2.5">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pitch title — what are you describing?"
        className="bg-surface-2 border border-borderline rounded-lg px-3 py-2 text-[13px]" />
      <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL (from /api/upload, or paste a hosted link)"
        className="bg-surface-2 border border-borderline rounded-lg px-3 py-2 text-[13px]" />
      <div className="flex gap-2">
        <button className="bg-gradient-to-r from-cyan to-blue text-[#06121A] font-bold text-xs px-4 py-2 rounded-lg">
          Publish pitch
        </button>
        <button type="button" onClick={onCancel} className="text-xs text-gray-400 hover:text-white px-2">Cancel</button>
      </div>
    </form>
  );
}

export default function PitchAlleyPanel({ initialVideos }) {
  const [videos, setVideos] = useState(initialVideos);
  const [adding, setAdding] = useState(false);

  function handleDelete(id) {
    if (!confirm("Delete this pitch video?")) return;
    setVideos((prev) => prev.filter((v) => v._id !== id));
  }

  function handleEditTitle(video) {
    const title = prompt("Pitch title", video.title);
    if (!title || title === video.title) return;
    setVideos((prev) => prev.map((v) => (v._id === video._id ? { ...v, title } : v)));
  }

  return (
    <div>
      <h1 className="text-[22px] font-bold font-display mb-1">Pitch Alley</h1>
      <p className="text-gray-400 text-[13.5px] mb-5">Video pitches you've shared with the community.</p>

      {adding && (
        <AddVideoForm
          onCancel={() => setAdding(false)}
          onAdded={(v) => { setVideos((prev) => [...prev, v]); setAdding(false); }}
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {!adding && (
          <button onClick={() => setAdding(true)} className="aspect-video rounded-2xl bg-gradient-to-br from-violet to-blue text-white flex flex-col items-center justify-center gap-2 hover:brightness-110 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            <span className="text-xs font-bold">Upload pitch video</span>
          </button>
        )}

        {videos.map((v) => (
          <div key={v._id} className="bg-surface border border-borderline-soft hover:border-cyan/30 rounded-2xl overflow-hidden transition-colors">
            <div className="aspect-video bg-gradient-to-br from-[#3A2F5A] to-[#1A1613] relative grid place-items-center">
              <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[v.status]}`}>{STATUS_LABEL[v.status]}</span>
              <div className="w-9 h-9 rounded-full bg-black/40 border border-white/25 grid place-items-center text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <div className="p-3">
              <div className="text-[13px] font-bold mb-1 truncate">{v.title}</div>
              <div className="flex items-center text-[11.5px] text-gray-600">
                {v.views ?? 0} views
                <div className="ml-auto flex gap-1">
                  <Button icon onClick={() => handleEditTitle(v)} aria-label="Edit"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg></Button>
                  <Button icon danger onClick={() => handleDelete(v._id)} aria-label="Delete"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" /></svg></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
