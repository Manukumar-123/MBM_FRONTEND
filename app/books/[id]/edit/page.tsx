"use client";

import {
  useState,
  useEffect,
  useCallback,
  type FC,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import {
  getBookById,
  updateBook,
  getFileUrl as buildFileUrl,
  type IBook,
} from "../../../../api/api";
import Stepper from "@/app/components/workPage/Stepper";
import ErrorList from "@/app/components/workPage/ErrorList";
import BookDetailsSection from "@/app/components/workPage/BookDetailsSection";
import CategorySection from "@/app/components/workPage/CategorySection";
import CoverMediaSection from "@/app/components/workPage/CoverMediaSection";
import ManuscriptSection from "@/app/components/workPage/ManuscriptSection";
import CopyrightSection from "@/app/components/workPage/CopyrightSection";
import PricingSection from "@/app/components/workPage/PricingSection";
import AgreementsSection from "@/app/components/workPage/AgreementsSection";
import ProgressOverlay from "@/app/components/workPage/ProgressOverlay";
import SuccessModal from "@/app/components/workPage/SuccessModal";

// ── Reuse existing upload components ──

interface FormState {
  title: string;
  subtitle: string;
  description: string;
  author: string;
  coAuthors: string;
  language: string;
  pageCount: string | number;
  publicationDate: string;
  isbn: string;
  edition: string;
  publisher: string;
  category: string;
  targetAudience: string;
  customTags: string;
  copyrightType: string;
  copyrightYear: number;
  copyrightHolder: string;
  price: string | number;
  currency: string;
  allowDownload: boolean;
  allowPreview: boolean;
  isExclusive: boolean;
  preOrderEnabled: boolean;
  rightsConfirmed: boolean;
  termsAccepted: boolean;
  emailOptIn: boolean;
  [key: string]: unknown;
}

interface FilesState {
  frontCover: File | null;
  backCover: File | null;
  qrCode: File | null;
  manuscript: File | null;
  samplePdf: File | null;
  [key: string]: File | null;
}

interface PreviewsState {
  frontCover: string | null;
  backCover: string | null;
  qrCode: string | null;
  [key: string]: string | null;
}

const EditBookPage: FC = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  // ─── Loading states ───
  const [pageLoading, setPageLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [originalBook, setOriginalBook] = useState<IBook | null>(null);

  // ─── Form State (mirrors UploadPage) ───
  const [form, setForm] = useState<FormState>({
    title: "",
    subtitle: "",
    description: "",
    author: "",
    coAuthors: "",
    language: "en",
    pageCount: "",
    publicationDate: "",
    isbn: "",
    edition: "1st Edition",
    publisher: "",
    category: "",
    targetAudience: "",
    customTags: "",
    copyrightType: "standard",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: "",
    price: "",
    currency: "INR",
    allowDownload: true,
    allowPreview: true,
    isExclusive: false,
    preOrderEnabled: false,
    rightsConfirmed: false,
    termsAccepted: false,
    emailOptIn: false,
  });

  const [genreTags, setGenreTags] = useState<string[]>([]);
  const [files, setFiles] = useState<FilesState>({
    frontCover: null,
    backCover: null,
    qrCode: null,
    manuscript: null,
    samplePdf: null,
  });
  const [previews, setPreviews] = useState<PreviewsState>({
    frontCover: null,
    backCover: null,
    qrCode: null,
  });

  // ─── UI State ───
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // ─── Fetch existing book data → populate form ───
  useEffect(() => {
    if (!bookId) return;
    (async () => {
      try {
        const res = await getBookById(bookId);
        const book = res.data;
        setOriginalBook(book);

        setForm({
          title: book.title || "",
          subtitle: book.subtitle || "",
          description: book.description || "",
          author: book.author || "",
          coAuthors: book.coAuthors?.join(", ") || "",
          language: book.language || "en",
          pageCount: book.pageCount ?? "",
          publicationDate: book.publicationDate
            ? new Date(book.publicationDate).toISOString().split("T")[0]
            : "",
          isbn: book.isbn || "",
          edition: book.edition || "1st Edition",
          publisher: book.publisher || "",
          category: book.category || "",
          targetAudience: book.targetAudience || "",
          customTags: book.customTags?.join(", ") || "",
          copyrightType: book.copyrightType || "standard",
          copyrightYear: book.copyrightYear || new Date().getFullYear(),
          copyrightHolder: book.copyrightHolder || "",
          price: book.price ?? "",
          currency: book.currency || "INR",
          allowDownload: book.allowDownload ?? true,
          allowPreview: book.allowPreview ?? true,
          isExclusive: book.isExclusive ?? false,
          preOrderEnabled: book.preOrderEnabled ?? false,
          rightsConfirmed: book.rightsConfirmed ?? false,
          termsAccepted: book.termsAccepted ?? false,
          emailOptIn: book.emailOptIn ?? false,
        });

        setGenreTags(book.genreTags || []);

        setPreviews({
          frontCover: book.frontCover ? buildFileUrl(book.frontCover) : null,
          backCover: book.backCover ? buildFileUrl(book.backCover) : null,
          qrCode: book.qrCode ? buildFileUrl(book.qrCode) : null,
        });
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setLoadError(e.response?.data?.message || "Failed to load book");
      } finally {
        setPageLoading(false);
      }
    })();
  }, [bookId]);

  // ─── Handlers (same pattern as UploadPage) ───
  const updateField = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleGenre = useCallback((genre: string) => {
    setGenreTags((prev) => {
      if (prev.includes(genre)) return prev.filter((g) => g !== genre);
      if (prev.length >= 5) return prev;
      return [...prev, genre];
    });
  }, []);

  const handleFileChange = useCallback(
    (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFiles((prev) => ({ ...prev, [field]: file }));

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreviews((prev) => ({
            ...prev,
            [field]: ev.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const removeFile = useCallback(
    (field: string) => {
      setFiles((prev) => ({ ...prev, [field]: null }));

      // Revert to original server preview if available
      const original = originalBook?.[field as keyof IBook] as
        | string
        | null
        | undefined;
      if (original) {
        setPreviews((prev) => ({ ...prev, [field]: buildFileUrl(original) }));
      } else {
        setPreviews((prev) => ({ ...prev, [field]: null }));
      }
    },
    [originalBook],
  );

  // ─── Build FormData ───
  const buildFormData = useCallback((): FormData => {
    const fd = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        fd.append(key, String(val));
      }
    });

    fd.append("genreTags", JSON.stringify(genreTags));

    if (form.customTags) {
      fd.append(
        "customTags",
        JSON.stringify(
          form.customTags
            .split(",")
            .map((t: string) => t.trim())
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
            .map((t: string) => t.trim())
            .filter(Boolean),
        ),
      );
    }

    // Only new files
    Object.entries(files).forEach(([key, file]) => {
      if (file) fd.append(key, file);
    });

    return fd;
  }, [form, genreTags, files]);

  // ─── Validation ───
  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.title?.trim()) errs.push("Book title is required");
    if (!form.description?.trim()) errs.push("Description is required");
    if (!form.author?.trim()) errs.push("Author name is required");
    if (!form.category) errs.push("Category is required");
    if (!files.frontCover && !originalBook?.frontCover)
      errs.push("Front cover image is required");
    if (!files.manuscript && !originalBook?.manuscript)
      errs.push("Manuscript PDF is required");
    if (!form.rightsConfirmed) errs.push("You must confirm publishing rights");
    if (!form.termsAccepted) errs.push("You must accept the terms of service");
    if (form.price === "") errs.push("Price is required (set 0 for free)");
    return errs;
  };

  // ─── Submit ───
  const handleSubmit = async (e: FormEvent) => {
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
      await updateBook(bookId, fd, (percent: number) =>
        setUploadProgress(percent),
      );
      setUploading(false);
      setShowSuccess(true);
    } catch (err: unknown) {
      setUploading(false);
      const e = err as {
        response?: { data?: { errors?: string[]; message?: string } };
      };
      const msg = e.response?.data?.errors || [
        e.response?.data?.message || "Update failed. Please try again.",
      ];
      setErrors(Array.isArray(msg) ? msg : [msg]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push(`/books/${bookId}`);
  };

  // ─── Loading / Error ───
  if (pageLoading) {
    return (
      <>
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[300px] gap-4 text-ink-dim">
          <div className="w-10 h-10 border-3 border-line border-t-gold rounded-full animate-spin-slow" />
          <p>Loading book data…</p>
        </div>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
          <p className="text-lg text-ink">{loadError}</p>
          <button
            onClick={() => router.push("/workList")}
            className="px-6 py-3 bg-gradient-to-br from-gold-dim to-gold text-deep rounded-sm font-body text-sm font-semibold"
          >
            ← Back to Works
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Ambient orbs */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-info/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <span
            className="text-ink-dim cursor-pointer hover:text-gold transition-colors"
            onClick={() => router.push("/workList")}
          >
            Your Works
          </span>
          <span className="text-ink-muted">/</span>
          <span
            className="text-ink-dim cursor-pointer hover:text-gold transition-colors"
            onClick={() => router.push(`/books/${bookId}`)}
          >
            {originalBook?.title}
          </span>
          <span className="text-ink-muted">/</span>
          <span className="text-ink font-medium">Edit</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-8 mt-20">
          <div className="inline-block font-mono text-[0.68rem] tracking-[0.2em] text-gold bg-gold-glow px-4 py-1.5 rounded-full border border-gold/20 mb-4">
            EDITING
          </div>
          <h1 className="font-serif text-4xl font-semibold text-ink tracking-tight">
            Edit Your Work
          </h1>
          <p className="text-sm text-ink-dim mt-2">
            Update the details below. Only changed files will be re-uploaded.
          </p>
        </div>

        <Stepper activeStep={0} />
        <ErrorList errors={errors} />

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <BookDetailsSection form={form} updateField={updateField} />

          <CategorySection
            form={form}
            updateField={updateField}
            genreTags={genreTags}
            onToggleGenre={toggleGenre}
          />

          <CoverMediaSection
            previews={previews}
            onFileChange={handleFileChange}
          />

          <ManuscriptSection
            files={files}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />

          {/* Existing file info */}
          {!files.manuscript && originalBook?.manuscript && (
            <div className="flex items-center gap-2.5 px-5 py-3.5 bg-success/[0.08] border border-success/20 rounded-sm text-success text-sm max-w-[800px] mx-auto -mt-3 mb-6">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Manuscript already uploaded. Upload a new file only if you want to
              replace it.
            </div>
          )}

          <CopyrightSection form={form} updateField={updateField} />
          <PricingSection form={form} updateField={updateField} />
          <AgreementsSection form={form} updateField={updateField} />

          {/* ── Actions ── */}
          <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-line max-w-[800px] mx-auto mb-16">
            <button
              type="button"
              onClick={() => router.push(`/books/${bookId}`)}
              className="px-6 py-3 bg-elevated border border-line rounded-sm text-ink font-body text-sm font-medium hover:bg-surface hover:border-line-light transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-8 py-3 bg-gradient-to-br from-gold-dim to-gold text-deep rounded-sm font-body text-sm font-semibold hover:shadow-gold-glow hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {uploading ? "Updating…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {uploading && <ProgressOverlay progress={uploadProgress} />}
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}
    </>
  );
};

export default EditBookPage;
