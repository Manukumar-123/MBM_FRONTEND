"use client";
import s from "./upload.module.css";
import SectionWrapper from "./SectionWrapper";
import { CATEGORIES, GENRES, AUDIENCES } from "./constants";

export default function CategorySection({
  form,
  updateField,
  genreTags,
  onToggleGenre,
}) {
  return (
    <SectionWrapper
      number="02"
      icon="🏷️"
      iconColor="green"
      title="Category & Genre"
      description="Help readers discover your work"
      delay="0.15s"
    >
      {/* Primary Category */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Primary Category <span className={s.req}>*</span>
        </label>
        <select
          className={s.select}
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Genre Tags */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Genre Tags <span className={s.opt}>(up to 5)</span>
        </label>
        <div className={s.tagSelector}>
          {GENRES.map((genre) => (
            <button
              type="button"
              key={genre}
              className={`${s.tagChip} ${
                genreTags.includes(genre) ? s.tagChipSelected : ""
              }`}
              onClick={() => onToggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Audience + Custom Tags */}
      <div className={s.fieldRow}>
        <div className={s.fieldGroup}>
          <label className={s.label}>Target Audience</label>
          <select
            className={s.select}
            value={form.targetAudience}
            onChange={(e) => updateField("targetAudience", e.target.value)}
          >
            <option value="">Select audience</option>
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>
            Custom Tags <span className={s.opt}>(optional)</span>
          </label>
          <input
            className={s.input}
            placeholder="dystopian, coming-of-age, indie"
            value={form.customTags}
            onChange={(e) => updateField("customTags", e.target.value)}
          />
          <div className={s.hint}>
            Comma-separated for better discoverability
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
