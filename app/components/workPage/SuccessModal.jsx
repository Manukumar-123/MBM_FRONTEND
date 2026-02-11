"use client";
import s from "./upload.module.css";

export default function SuccessModal({ onClose }) {
  return (
    <div className={s.modalOverlay}>
      <div className={s.modalCard}>
        <div className={s.modalIcon}>✨</div>
        <div className={s.modalTitle}>Submitted Successfully</div>
        <div className={s.modalText}>
          Your manuscript is now under review. Our editorial team will get back
          to you within 2–3 business days. We&apos;ll send an email
          notification once your book is approved and live on the platform.
        </div>
        <button
          className={`${s.btn} ${s.btnPrimary}`}
          onClick={onClose}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
