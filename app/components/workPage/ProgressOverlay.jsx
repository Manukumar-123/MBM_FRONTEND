"use client";
import s from "./upload.module.css";

export default function ProgressOverlay({ progress = 0 }) {
  return (
    <div className={s.progressOverlay}>
      <div className={s.progressText}>Uploading your masterpiece...</div>
      <div className={s.progressBarOuter}>
        <div
          className={s.progressBarInner}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={s.progressPercent}>{progress}%</div>
    </div>
  );
}
