"use client";
import s from "./upload.module.css";

export default function ToggleSwitch({ label, description, value, onChange }) {
  return (
    <div className={s.toggleRow}>
      <div>
        <div className={s.tglLabel}>{label}</div>
        <div className={s.tglDesc}>{description}</div>
      </div>
      <div
        className={`${s.toggleSwitch} ${value ? s.toggleOn : ""}`}
        onClick={() => onChange?.(!value)}
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange?.(!value);
          }
        }}
      >
        <div className={s.knob} />
      </div>
    </div>
  );
}
