"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TagInput({ tags, onChange, placeholder, disabled }: TagInputProps) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setValue("");
      return;
    }
    onChange([...tags, trimmed]);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !value && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 w-full min-h-[46px] px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] focus-within:border-cyan-400/40 ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-[12.5px] font-medium border border-cyan-400/20"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="hover:text-rose-400"
            aria-label={`Remove ${tag}`}
          >
            <X size={13} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ""}
        disabled={disabled}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-white placeholder-[#5f5f6e] text-[13px] py-1"
      />
    </div>
  );
}
