"use client";

import type { FC } from "react";
import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  bookTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  bookTitle,
  onConfirm,
  onCancel,
  deleting,
}) => (
  <div
    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
    onClick={onCancel}
  >
    <div
      className="bg-card border border-line rounded-card p-10 max-w-[440px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-5">
        <Trash2 className="w-8 h-8 text-danger" />
      </div>

      <h3 className="font-serif text-2xl font-semibold text-ink mb-3">
        Delete Book
      </h3>
      <p className="text-sm text-ink-dim leading-relaxed mb-7">
        Are you sure you want to delete{" "}
        <strong className="text-gold">{bookTitle}</strong>? This action cannot
        be undone. All files and data will be permanently removed.
      </p>

      <div className="flex gap-3 justify-center">
        <button
          type="button"
          disabled={deleting}
          onClick={onCancel}
          className="px-6 py-3 bg-elevated border border-line rounded-sm text-ink font-body text-sm font-medium hover:bg-surface hover:border-line-light transition-all disabled:opacity-50"
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
