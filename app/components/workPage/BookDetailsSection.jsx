"use client";
import s from "./upload.module.css";
import SectionWrapper from "./SectionWrapper";
import { LANGUAGES, EDITIONS } from "./constants";

export default function BookDetailsSection({ form, updateField }) {
  return (
    <SectionWrapper
      number="01"
      icon="📖"
      iconColor="gold"
      title="Book Details"
      description="The essentials — title, author, and description"
      delay="0.1s"
    >
      {/* Title */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Book Title <span className={s.req}>*</span>
        </label>
        <input
          className={s.input}
          placeholder="Enter the title of your book"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      {/* Subtitle */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Subtitle <span className={s.opt}>(optional)</span>
        </label>
        <input
          className={s.input}
          placeholder="A tagline or subtitle for your book"
          value={form.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
        />
      </div>

      {/* Description */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Description / Synopsis <span className={s.req}>*</span>
        </label>
        <textarea
          className={s.textarea}
          placeholder="Write a compelling description that draws readers in. What is your book about? Why should someone read it?"
          maxLength={2000}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <div className={s.charCount}>{form.description.length} / 2,000</div>
      </div>

      {/* Author + Co-authors */}
      <div className={s.fieldRow}>
        <div className={s.fieldGroup}>
          <label className={s.label}>
            Author / Pen Name <span className={s.req}>*</span>
          </label>
          <input
            className={s.input}
            placeholder="As it appears on the book"
            value={form.author}
            onChange={(e) => updateField("author", e.target.value)}
          />
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>
            Co-Authors <span className={s.opt}>(optional)</span>
          </label>
          <input
            className={s.input}
            placeholder="Separate names with commas"
            value={form.coAuthors}
            onChange={(e) => updateField("coAuthors", e.target.value)}
          />
        </div>
      </div>

      {/* Language, Pages, Date */}
      <div className={s.fieldRow3}>
        <div className={s.fieldGroup}>
          <label className={s.label}>
            Language <span className={s.req}>*</span>
          </label>
          <select
            className={s.select}
            value={form.language}
            onChange={(e) => updateField("language", e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>Page Count</label>
          <input
            className={s.input}
            type="number"
            placeholder="e.g. 320"
            min="1"
            value={form.pageCount}
            onChange={(e) => updateField("pageCount", e.target.value)}
          />
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>Publication Date</label>
          <input
            className={s.input}
            type="date"
            value={form.publicationDate}
            onChange={(e) => updateField("publicationDate", e.target.value)}
          />
        </div>
      </div>

      {/* ISBN + Edition */}
      <div className={s.fieldRow}>
        <div className={s.fieldGroup}>
          <label className={s.label}>
            ISBN <span className={s.opt}>(optional)</span>
          </label>
          <input
            className={s.input}
            placeholder="978-3-16-148410-0"
            value={form.isbn}
            onChange={(e) => updateField("isbn", e.target.value)}
          />
          <div className={s.hint}>
            International Standard Book Number, if assigned
          </div>
        </div>
        <div className={s.fieldGroup}>
          <label className={s.label}>Edition</label>
          <select
            className={s.select}
            value={form.edition}
            onChange={(e) => updateField("edition", e.target.value)}
          >
            {EDITIONS.map((ed) => (
              <option key={ed}>{ed}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Publisher */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Publisher <span className={s.opt}>(optional)</span>
        </label>
        <input
          className={s.input}
          placeholder="Publishing house or self-published"
          value={form.publisher}
          onChange={(e) => updateField("publisher", e.target.value)}
        />
      </div>
    </SectionWrapper>
  );
}
