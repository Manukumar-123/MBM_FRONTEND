"use client";

import type { FC } from "react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<
  string,
  { label: string; text: string; bg: string; border: string; dot: string }
> = {
  draft: {
    label: "Draft",
    text: "text-ink-muted",
    bg: "bg-ink-muted/10",
    border: "border-ink-muted/30",
    dot: "bg-ink-muted",
  },
  pending_review: {
    label: "Pending Review",
    text: "text-gold",
    bg: "bg-gold-glow",
    border: "border-gold/30",
    dot: "bg-gold",
  },
  approved: {
    label: "Approved",
    text: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    dot: "bg-success",
  },
  rejected: {
    label: "Rejected",
    text: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    dot: "bg-danger",
  },
  archived: {
    label: "Archived",
    text: "text-ink-dim",
    bg: "bg-ink-dim/10",
    border: "border-ink-dim/30",
    dot: "bg-ink-dim",
  },
};

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const info = STATUS_MAP[status] ?? STATUS_MAP.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider font-mono border ${info.text} ${info.bg} ${info.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${info.dot}`} />
      {info.label}
    </span>
  );
};

export default StatusBadge;
