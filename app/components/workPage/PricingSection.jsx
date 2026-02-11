"use client";
import s from "./upload.module.css";
import SectionWrapper from "./SectionWrapper";
import ToggleSwitch from "./ToggleSwitch";
import { DISTRIBUTION_TOGGLES } from "./constants";

export default function PricingSection({ form, updateField }) {
  return (
    <SectionWrapper
      number="06"
      icon="💰"
      iconColor="gold"
      title="Pricing & Distribution"
      description="Set your price and control availability"
      delay="0.35s"
    >
      {/* Price */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Price <span className={s.req}>*</span>
        </label>
        <div className={s.priceRow}>
          <span className={s.priceSymbol}>₹</span>
          <input
            className={`${s.input} ${s.priceInput}`}
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
          />
        </div>
        <div className={s.hint}>Set ₹0 for free distribution</div>
      </div>

      {/* Distribution Toggles */}
      <div className={s.fieldGroup} style={{ marginTop: 24 }}>
        {DISTRIBUTION_TOGGLES.map((toggle) => (
          <ToggleSwitch
            key={toggle.key}
            label={toggle.label}
            description={toggle.desc}
            value={form[toggle.key]}
            onChange={(val) => updateField(toggle.key, val)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
