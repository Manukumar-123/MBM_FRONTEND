"use client";

import { useState, useCallback } from "react";
import s from "./upload.module.css";
import { submitBook, saveDraft } from "./api";
import { INITIAL_FORM_STATE } from "./constants";

// ── Layout Components ──
import HeroSection from "./HeroSection";
import Stepper from "./Stepper";
import ErrorList from "./ErrorList";
import FormActions from "./FormActions";
import ProgressOverlay from "./ProgressOverlay";
import SuccessModal from "./SuccessModal";

// ── Section Components ──
import BookDetailsSection from "./BookDetailsSection";
import CategorySection from "./CategorySection";
import CoverMediaSection from "./CoverMediaSection";
import ManuscriptSection from "./ManuscriptSection";
import CopyrightSection from "./CopyrightSection";
import PricingSection from "./PricingSection";
import AgreementsSection from "./AgreementsSection";

export default function UploadPage() {
  // ─── Form State ───
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [genreTags, setGenreTags] = useState([]);
  const [files, setFiles] = useState({
    frontCover: null,
    backCover: null,
    qrCode: null,
    manuscript: null,
    samplePdf: null,
  });
  const [previews, setPreviews] = useState({
    frontCover: null,
    backCover: null,
    qrCode: null,
  });

  // ─── UI State ───
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // ─── Handlers ───
  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleGenre = useCallback((genre) => {
    setGenreTags((prev) => {
      if (prev.includes(genre)) return prev.filter((g) => g !== genre);
      if (prev.length >= 5) return prev; // max 5
      return [...prev, genre];
    });
  }, []);

  const handleFileChange = useCallback((field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, [field]: file }));

    // Generate image preview for cover/qr fields
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => ({ ...prev, [field]: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeFile = useCallback((field) => {
    setFiles((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: null }));
  }, []);

  // ─── Build FormData ───
  const buildFormData = useCallback(() => {
    const fd = new FormData();

    // Text fields
    Object.entries(form).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        fd.append(key, String(val));
      }
    });

    // Array fields as JSON strings
    fd.append("genreTags", JSON.stringify(genreTags));

    if (form.customTags) {
      fd.append(
        "customTags",
        JSON.stringify(
          form.customTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      );
    }
    if (form.coAuthors) {
      fd.append(
        "coAuthors",
        JSON.stringify(
          form.coAuthors
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      );
    }

    // Files
    Object.entries(files).forEach(([key, file]) => {
      if (file) fd.append(key, file);
    });

    return fd;
  }, [form, genreTags, files]);

  // ─── Validation ───
  const validate = () => {
    const errs = [];
    if (!form.title.trim()) errs.push("Book title is required");
    if (!form.description.trim()) errs.push("Description is required");
    if (!form.author.trim()) errs.push("Author name is required");
    if (!form.category) errs.push("Category is required");
    if (!files.frontCover) errs.push("Front cover image is required");
    if (!files.manuscript) errs.push("Manuscript PDF is required");
    if (!form.rightsConfirmed) errs.push("You must confirm publishing rights");
    if (!form.termsAccepted) errs.push("You must accept the terms of service");
    if (form.price === "") errs.push("Price is required (set 0 for free)");
    return errs;
  };

  // ─── Submit ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fd = buildFormData();
      await submitBook(fd, (percent) => setUploadProgress(percent));
      setUploading(false);
      setShowSuccess(true);
    } catch (err) {
      setUploading(false);
      const msg = err.response?.data?.errors || [
        err.response?.data?.message || "Upload failed. Please try again.",
      ];
      setErrors(Array.isArray(msg) ? msg : [msg]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ─── Save Draft ───
  const handleDraft = async () => {
    try {
      const fd = buildFormData();
      await saveDraft(fd);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2500);
    } catch {
      setErrors(["Failed to save draft. Please try again."]);
    }
  };

  // ─── Close Success ───
  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = "/";
  };

  return (
    <>
      {/* Background orbs */}
      <div className={`${s.ambientOrb} ${s.orb1}`} />
      <div className={`${s.ambientOrb} ${s.orb2}`} />

      {/* Navigation */}

      <div className={s.pageWrapper}>
        {/* Hero */}
        <HeroSection />

        {/* Progress stepper */}
        <Stepper activeStep={0} />

        {/* Validation errors */}
        <ErrorList errors={errors} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Section 1 — Book Details */}
          <BookDetailsSection form={form} updateField={updateField} />

          {/* Section 2 — Category & Genre */}
          <CategorySection
            form={form}
            updateField={updateField}
            genreTags={genreTags}
            onToggleGenre={toggleGenre}
          />

          {/* Section 3 — Cover Art & Media */}
          <CoverMediaSection
            previews={previews}
            onFileChange={handleFileChange}
          />

          {/* Section 4 — Manuscript Upload */}
          <ManuscriptSection
            files={files}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />

          {/* Section 5 — Copyright & Licensing */}
          <CopyrightSection form={form} updateField={updateField} />

          {/* Section 6 — Pricing & Distribution */}
          <PricingSection form={form} updateField={updateField} />

          {/* Section 7 — Agreements */}
          <AgreementsSection form={form} updateField={updateField} />

          {/* Form Actions */}
          <FormActions
            uploading={uploading}
            draftSaved={draftSaved}
            onSaveDraft={handleDraft}
            onBack={() => window.history.back()}
          />
        </form>
      </div>

      {/* Upload progress overlay */}
      {uploading && <ProgressOverlay progress={uploadProgress} />}

      {/* Success modal */}
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}
    </>
  );
}
