"use client";
import s from "./upload.module.css";
import SectionWrapper from "./SectionWrapper";
import FileUploadZone from "./FileUploadZone";

export default function CoverMediaSection({ previews, onFileChange }) {
  return (
    <SectionWrapper
      number="03"
      icon="🎨"
      iconColor="blue"
      title="Cover Art & Media"
      description="The face of your work — make it count"
      delay="0.2s"
    >
      {/* Book Covers */}
      <div className={s.fieldGroup}>
        <label className={s.label}>Book Covers</label>
        <div className={s.coverGrid}>
          <FileUploadZone
            id="frontCover"
            icon="📕"
            badge="Front Cover"
            title="Upload Front Cover"
            subtitle="Drag & drop or click to browse"
            specs={["JPG, PNG, WEBP", "Max 10MB", "1600×2400"]}
            accept="image/*"
            preview={previews.frontCover}
            onChange={(e) => onFileChange("frontCover", e)}
          />
          <FileUploadZone
            id="backCover"
            icon="📗"
            badge="Back Cover"
            title="Upload Back Cover"
            subtitle="Drag & drop or click to browse"
            specs={["JPG, PNG, WEBP", "Max 10MB", "1600×2400"]}
            accept="image/*"
            preview={previews.backCover}
            onChange={(e) => onFileChange("backCover", e)}
          />
        </div>
      </div>

      {/* QR Code */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          QR Code <span className={s.opt}>(optional)</span>
        </label>
        <FileUploadZone
          id="qrCode"
          icon="📱"
          title="Upload QR Sales Code"
          subtitle="Link to store, preview, or landing page"
          specs={["PNG, SVG", "Max 2MB"]}
          accept="image/*"
          small
          preview={previews.qrCode}
          onChange={(e) => onFileChange("qrCode", e)}
          style={{ maxWidth: 360 }}
        />
        <div className={s.hint}>
          Displayed on your work&apos;s listing for instant mobile access
        </div>
      </div>
    </SectionWrapper>
  );
}
