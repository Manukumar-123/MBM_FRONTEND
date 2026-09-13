"use client";

import { useState } from "react";
import Button from "../ui/Button";

function AddRequestForm({ onAdded, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState(100);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title) return;
    onAdded({ _id: `a${Date.now()}`, title, description, currentSupporters: 0, targetSupporters: Number(target) });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-cyan/25 rounded-2xl p-4 mb-4 flex flex-col gap-2.5">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What are you asking for?"
        className="bg-surface-2 border border-borderline rounded-lg px-3 py-2 text-[13px]" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe it to the community"
        className="bg-surface-2 border border-borderline rounded-lg px-3 py-2 text-[13px] min-h-[64px]" />
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-400">Supporter goal</label>
        <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="w-24 bg-surface-2 border border-borderline rounded-lg px-2 py-1.5 text-[13px]" />
      </div>
      <div className="flex gap-2">
        <button className="bg-gradient-to-r from-cyan to-blue text-[#06121A] font-bold text-xs px-4 py-2 rounded-lg">
          Post request
        </button>
        <button type="button" onClick={onCancel} className="text-xs text-gray-400 hover:text-white px-2">Cancel</button>
      </div>
    </form>
  );
}

function Nodes({ current, target }) {
  const count = 10;
  const filled = Math.min(count, Math.round((current / target) * count));
  return (
    <div className="flex items-center gap-1.5 mb-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className={`w-[9px] h-[9px] rounded-full border-[1.5px] flex-shrink-0 ${i < filled ? "bg-cyan border-cyan shadow-[0_0_6px_1px_rgba(47,211,240,0.6)]" : "border-borderline"}`} />
          {i < count - 1 && <div className="flex-1 h-px bg-borderline mx-1" />}
        </div>
      ))}
    </div>
  );
}

export default function AskUniversePanel({ initialRequests }) {
  const [requests, setRequests] = useState(initialRequests);
  const [adding, setAdding] = useState(false);

  function handleDelete(id) {
    if (!confirm("Delete this request?")) return;
    setRequests((prev) => prev.filter((r) => r._id !== id));
  }

  function handleEdit(request) {
    const title = prompt("Request title", request.title);
    if (!title || title === request.title) return;
    setRequests((prev) => prev.map((r) => (r._id === request._id ? { ...r, title } : r)));
  }

  return (
    <div>
      <h1 className="text-[22px] font-bold font-display mb-1">Ask the Universe</h1>
      <p className="text-gray-400 text-[13.5px] mb-5">Requests you've made for reader support.</p>

      {!adding ? (
        <button onClick={() => setAdding(true)} className="flex items-center justify-center gap-2.5 w-full rounded-2xl p-4 mb-4 font-bold text-[13.5px] text-cyan-100 bg-gradient-to-br from-violet/15 to-cyan/10 border border-cyan/25 hover:border-cyan/50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          Start a new request
        </button>
      ) : (
        <AddRequestForm onCancel={() => setAdding(false)} onAdded={(r) => { setRequests((prev) => [...prev, r]); setAdding(false); }} />
      )}

      {requests.map((r) => (
        <div key={r._id} className="flex gap-3.5 bg-surface border border-borderline-soft rounded-2xl p-4 mb-2.5">
          <div className="w-[70px] h-[70px] rounded-xl bg-gradient-to-br from-violet to-cyan flex-shrink-0 grid place-items-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06121A" strokeWidth="1.8"><path d="M12 2.5l2.6 5.9 6.4.7-4.8 4.4 1.3 6.3L12 16.8 6.5 19.8l1.3-6.3-4.8-4.4 6.4-.7Z" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold mb-0.5">{r.title}</div>
            <div className="text-xs text-gray-400 mb-2.5">{r.description}</div>
            <Nodes current={r.currentSupporters} target={r.targetSupporters} />
            <div className="text-xs text-gray-400">{r.currentSupporters} of {r.targetSupporters} supporters</div>
          </div>
          <div className="flex gap-1.5 self-start">
            <Button icon onClick={() => handleEdit(r)} aria-label="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg></Button>
            <Button icon danger onClick={() => handleDelete(r._id)} aria-label="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0v13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7" /></svg></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
