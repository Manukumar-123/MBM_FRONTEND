"use client";
import { useEffect, useState } from "react";
import s from "./upload.module.css";
import SectionWrapper from "./SectionWrapper";
import { AUDIENCES } from "./constants";
import useAuthStore from "@/app/store/authStore";
import { getSubcategories } from "../../../api/api";

export default function CategorySection({
  form,
  updateField,
  genreTags,
  onToggleGenre,
  onTagOptionsLoaded,
}) {
  const role = useAuthStore((state) => state.user?.role);
  const isAuthor = role === "author";
  const isWriter = role === "writer";
  const tagLabel = isAuthor ? "Author Tags" : isWriter ? "Writer Tags" : "Other Tags";

  const [tagOptions, setTagOptions] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Tags come from the admin-managed subcategories, matched to the "Author"/"Auther"/"Writer" category for those roles.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingTags(true);
      try {
        const res = await getSubcategories();
        const all = res?.data || [];
        const filtered = all.filter((sub) => {
          const categoryName = (
            typeof sub.category === "string" ? "" : sub.category?.name || ""
          ).toLowerCase();
          const isAuthorCategory =
            categoryName === "author" || categoryName === "auther";

          if (isAuthor) return isAuthorCategory;
          if (isWriter) return categoryName === "writer";
          return !isAuthorCategory && categoryName !== "writer";
        });

        const names = filtered.map((sub) => sub.name);
        if (!cancelled) {
          setTagOptions(names);
          // Drop any previously-saved tags that no longer exist (e.g. from before the tag source changed).
          onTagOptionsLoaded?.(names);
        }
      } catch {
        if (!cancelled) setTagOptions([]);
      } finally {
        if (!cancelled) setLoadingTags(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthor, isWriter, onTagOptionsLoaded]);

  // Category was already chosen at signup (via role) — derive it silently instead of asking again.
  useEffect(() => {
    updateField("category", isAuthor ? "Author" : isWriter ? "Writer" : "Other Creators");
  }, [isAuthor, isWriter, updateField]);

  return (
    <SectionWrapper
      number="02"
      icon="🏷️"
      iconColor="green"
      title="Tags"
      description="Help readers discover your work"
      delay="0.15s"
    >
      {/* Genre / Role Tags */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          {tagLabel} <span className={s.opt}>(up to 5)</span>
        </label>
        <div className={s.tagSelector}>
          {loadingTags && <div className={s.hint}>Loading tags…</div>}
          {!loadingTags && tagOptions.length === 0 && (
            <div className={s.hint}>No tags available yet.</div>
          )}
          {tagOptions.map((genre) => (
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
