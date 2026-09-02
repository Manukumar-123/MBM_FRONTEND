"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function TagInput({
  tags,
  onChange,
  placeholder,
  disabled,
}: TagInputProps) {
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
      className={`flex flex-wrap items-center gap-2 w-full min-h-[46px] px-3 py-2 rounded-lg border border-gray-300 dark:border-[#323232] bg-white dark:bg-transparent focus-within:ring-2 focus-within:ring-green-500/50 ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="hover:text-red-500"
            aria-label={`Remove ${tag}`}
          >
            <X size={14} />
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
        className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm py-1"
      />
    </div>
  );
}
