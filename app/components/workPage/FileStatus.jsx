"use client";
import s from "./upload.module.css";

export default function FileStatus({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className={s.pdfStatus}>
      <span>✅</span>
      <div>
        <div className={s.pdfName}>{file.name}</div>
        <div className={s.pdfSize}>
          {(file.size / 1048576).toFixed(2)} MB
        </div>
      </div>
      <button type="button" className={s.removeBtn} onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
