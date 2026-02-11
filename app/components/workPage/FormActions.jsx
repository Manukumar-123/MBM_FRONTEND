"use client";
import s from "./upload.module.css";

export default function FormActions({
  uploading,
  draftSaved,
  onSaveDraft,
  onBack,
}) {
  return (
    <div className={s.actionBar}>
      <button
        type="button"
        className={`${s.btn} ${s.btnGhost}`}
        onClick={onBack}
      >
        ← Back
      </button>
      <div className={s.btnGroup}>
        <button
          type="button"
          className={`${s.btn} ${s.btnSecondary} ${
            draftSaved ? s.btnSaved : ""
          }`}
          onClick={onSaveDraft}
        >
          {draftSaved ? "✓ Saved" : "Save Draft"}
        </button>
        <button
          type="submit"
          className={`${s.btn} ${s.btnPrimary}`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit for Review →"}
        </button>
      </div>
    </div>
  );
}
