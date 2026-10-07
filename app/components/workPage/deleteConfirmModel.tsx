"use client";

import type { FC } from "react";
import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  bookTitle: string;
  itemType?: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  bookTitle,
  itemType = "Book",
  onConfirm,
  onCancel,
  deleting,
}) => (
  <div
    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
    onClick={onCancel}
  >
    <div
      className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.35)] animate-fade-in dark:border-white/10 dark:bg-[#14131a] dark:text-white sm:p-10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-5">
        <Trash2 className="w-8 h-8 text-danger" />
      </div>

      <h3 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white mb-3">
        Delete {itemType}
      </h3>
      <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed mb-7">
        Are you sure you want to delete{" "}<strong className="text-amber-700 dark:text-amber-300">{bookTitle}</strong>? This action cannot
        be undone.{itemType === "Book" ? " All files and data will be permanently removed." : ""}
      </p>

      <div className="flex gap-3 justify-center">
        <button
          type="button"
          disabled={deleting}
          onClick={onCancel}
          className="px-6 py-3 rounded-lg border border-slate-300 bg-slate-100 text-slate-800 text-sm font-medium hover:bg-slate-200 dark:border-white/10 dark:bg-white/[0.06] dark:text-gray-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={onConfirm}
          className="px-6 py-3 bg-danger/15 border border-danger/30 rounded-sm text-danger font-body text-sm font-semibold hover:bg-danger/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting…" : "Delete Permanently"}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;
