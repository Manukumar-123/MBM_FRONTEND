import { ReactNode } from "react";

type Tone = "cyan" | "violet" | "emerald" | "amber" | "rose" | "slate";

const TONES: Record<Tone, string> = {
  cyan: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
  violet: "bg-violet-400/10 text-violet-300 border-violet-400/20",
  emerald: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  amber: "bg-amber-300/10 text-amber-300 border-amber-300/20",
  rose: "bg-rose-400/10 text-rose-300 border-rose-400/20",
  slate: "bg-white/5 text-[#9a9aa8] border-white/10",
};

/** Maps a status string to a tone. Extend as new statuses are introduced. */
export function statusTone(status: string): Tone {
  const map: Record<string, Tone> = {
    Verified: "emerald",
    Published: "emerald",
    Active: "emerald",
    Pending: "amber",
    Draft: "slate",
    Suspended: "rose",
    Flagged: "rose",
    Rejected: "rose",
  };
  return map[status] ?? "slate";
}

export default function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
