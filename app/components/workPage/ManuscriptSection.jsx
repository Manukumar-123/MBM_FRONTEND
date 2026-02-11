"use client";
import SectionWrapper from "./SectionWrapper";
import FileUploadZone from "./FileUploadZone";
import FileStatus from "./FileStatus";
import s from "./upload.module.css";

export default function ManuscriptSection({
  files,
  onFileChange,
  onRemoveFile,
}) {
  return (
    <SectionWrapper
      number="04"
      icon="📄"
      iconColor="red"
      title="Manuscript Upload"
      description="The heart of your work — your book file"
      delay="0.25s"
    >
      {/* Main PDF */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Book PDF <span className={s.req}>*</span>
        </label>
        <FileUploadZone
          id="manuscript"
          icon="📋"
          title="Upload Manuscript (PDF)"
          subtitle="Drag & drop or click — print-ready preferred"
          specs={["PDF only", "Max 500MB"]}
          accept=".pdf"
          onChange={(e) => onFileChange("manuscript", e)}
        />
        <FileStatus
          file={files.manuscript}
          onRemove={() => onRemoveFile("manuscript")}
        />
      </div>

      {/* Sample PDF */}
      <div className={s.fieldGroup}>
        <label className={s.label}>
          Preview / Sample <span className={s.opt}>(optional)</span>
        </label>
        <FileUploadZone
          id="samplePdf"
          icon="👁️"
          title="Upload Sample Pages"
          subtitle="First chapter or selected preview pages"
          specs={["PDF", "Max 50MB"]}
          accept=".pdf"
          small
          onChange={(e) => onFileChange("samplePdf", e)}
        />
        <FileStatus
          file={files.samplePdf}
          onRemove={() => onRemoveFile("samplePdf")}
        />
      </div>
    </SectionWrapper>
  );
}
