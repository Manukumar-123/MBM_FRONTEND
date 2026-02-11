"use client";
import s from "./upload.module.css";

const STEPS = ["Details", "Media", "Rights", "Publish"];

export default function Stepper({ activeStep = 0 }) {
  return (
    <div className={s.stepper}>
      {STEPS.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && <div className={s.stepConnector} />}
          <div className={`${s.step} ${i <= activeStep ? s.stepActive : ""}`}>
            <div className={s.stepNum}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className={s.stepText}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
