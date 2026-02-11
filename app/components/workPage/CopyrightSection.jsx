"use client";
import s from "./upload.module.css";
import SectionWrapper from "./SectionWrapper";
import { COPYRIGHT_OPTIONS } from "./constants";

const BADGE_CLASSES = {
  standard: s.badgeStandard,
  cc: s.badgeCc,
  public: s.badgePublic,
};

export default function CopyrightSection({ form, updateField }) {
  return (
    <SectionWrapper
      number="05"
      icon="⚖️"
      iconColor="purple"
      title="Copyright & Licensing"
      description="Protect and define usage of your work"
      delay="0.3s"
    >
      {/* License Type */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          License Type <span className={s.req}>*</span>
        </label>
        <div className={s.copyrightGrid}>
          {COPYRIGHT_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className={`${s.copyrightOption} ${
                form.copyrightType === opt.value ? s.copyrightSelected : ""
              }`}
              onClick={() => updateField("copyrightType", opt.value)}
            >
              <div
                className={`${s.checkDot} ${
                  form.copyrightType === opt.value ? s.checkDotActive : ""
                }`}
              >
                {form.copyrightType === opt.value && "✓"}
              </div>
              <div
                className={`${s.coBadge} ${BADGE_CLASSES[opt.badgeType]}`}
              >
                {opt.badge}
              </div>
              <div className={s.coTitle}>{opt.title}</div>
              <div className={s.coDesc}>{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright Year + Holder */}
      <div className={s.fieldRow}>
        <div className={s.fieldGroup}>
          <label className={s.label}>Copyright Year</label>
          <input
            className={s.input}
            type="number"
            value={form.copyrightYear}
            min="1900"
            max="2100"
            style={{ maxWidth: 180 }}
            onChange={(e) => updateField("copyrightYear", e.target.value)}
          />
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>Copyright Holder</label>
          <input
            className={s.input}
            placeholder="Defaults to author name"
            value={form.copyrightHolder}
            onChange={(e) => updateField("copyrightHolder", e.target.value)}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
