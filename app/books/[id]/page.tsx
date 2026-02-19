"use client";

import { useState, useEffect, type FC } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, BookOpen, CheckCircle, X } from "lucide-react";
import {
  getBookById,
  deleteBook,
  getFileUrl,
  type IBook,
} from "../../../api/api";
import StatusBadge from "./../../components/workPage/StatusBadge";
import DeleteConfirmModal from "../../components/workPage/deleteConfirmModel";
import { useParams } from "next/navigation";

const COPYRIGHT_LABELS: Record<string, string> = {
  standard: "All Rights Reserved",
  "cc-by": "CC BY",
  "cc-by-nc": "CC BY-NC",
  "cc-by-sa": "CC BY-SA",
  "cc-by-nc-nd": "CC BY-NC-ND",
  "public-domain": "Public Domain",
};

interface Props {
  bookId: string;
}

const fmtDate = (d?: string | null): string => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const fmtBytes = (bytes?: number): string => {
  if (!bytes) return "—";
  const mb = bytes / 1048576;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
};

const MetaItem: FC<{ label: string; value: string | number | undefined }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[0.7rem] font-mono text-ink-muted uppercase tracking-wider">
      {label}
    </span>
    <span className="text-sm text-ink">{value || "—"}</span>
  </div>
);

const Toggle: FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div
    className={`text-sm px-3.5 py-2.5 rounded-lg border transition-colors
    ${
      active
        ? "text-success border-success/30 bg-success/[0.08]"
        : "text-ink-muted border-line bg-elevated"
    }`}
  >
    {active ? "✓" : "✗"} {label}
  </div>
);

const BookDetailPage: FC<Props> = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<IBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    (async () => {
      try {
        const res = await getBookById(bookId);

        setBook(res.data);
        setLoading(false);
      } catch (err: unknown) {
        setLoading(false);
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Failed to load book",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [bookId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBook(bookId);
      router.push("/books");
    } catch {
      alert("Failed to delete book");
      setDeleting(false);
    }
  };

  /* ── Loading / Error ── */
  if (loading) {
    return (
      <>
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[300px] gap-4 text-ink-dim">
          <div className="w-10 h-10 border-3 border-line border-t-gold rounded-full animate-spin-slow" />
          <p>Loading book details…</p>
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
          <p className="text-lg text-ink">{error || "Book not found"}</p>
          <button
            onClick={() => router.push("/books")}
            className="px-6 py-3 bg-gradient-to-br from-gold-dim to-gold text-deep rounded-sm font-body text-sm font-semibold"
          >
            ← Back to Books
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-info/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <span
            className="text-ink-dim cursor-pointer hover:text-gold transition-colors"
            onClick={() => router.push("/books")}
          >
            Your Works
          </span>
          <span className="text-ink-muted">/</span>
          <span className="text-ink font-medium">{book.title}</span>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <button
            onClick={() => router.push("/books")}
            className="px-6 py-3 bg-elevated border border-line rounded-sm text-ink font-body text-sm font-medium hover:bg-surface transition-all"
          >
            ← Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/books/${bookId}/edit`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-gold-dim to-gold text-deep rounded-sm font-body text-sm font-semibold hover:shadow-gold-glow hover:-translate-y-0.5 transition-all"
            >
              <Pencil className="w-4 h-4" /> Edit Book
            </button>
            <button
              onClick={() => setDeleteModal(true)}
              className="px-6 py-3 bg-danger/15 border border-danger/30 rounded-sm text-danger font-body text-sm font-semibold hover:bg-danger/25 transition-all"
            >
              Delete
            </button>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-12 mb-16">
          {/* Left: Cover */}
          <div className="flex flex-col gap-4 max-w-[320px] mx-auto md:mx-0">
            <div className="rounded-card overflow-hidden border border-line bg-card">
              {book.frontCover ? (
                <img
                  src={getFileUrl(book.frontCover)!}
                  alt={book.title}
                  className="w-full block"
                />
              ) : (
                <div className="w-full aspect-[2/3] flex items-center justify-center bg-elevated text-ink-muted text-sm">
                  No Cover
                </div>
              )}
            </div>
            {book.backCover && (
              <div className="border border-line rounded-lg overflow-hidden bg-card text-center">
                <img
                  src={getFileUrl(book.backCover)!}
                  alt="Back cover"
                  className="w-full h-20 object-cover"
                />
                <span className="block text-[0.7rem] text-ink-muted font-mono py-1.5">
                  Back Cover
                </span>
              </div>
            )}
            {book.qrCode && (
              <div className="border border-line rounded-lg overflow-hidden bg-card text-center">
                <img
                  src={getFileUrl(book.qrCode)!}
                  alt="QR Code"
                  className="w-full h-20 object-cover"
                />
                <span className="block text-[0.7rem] text-ink-muted font-mono py-1.5">
                  QR Code
                </span>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="min-w-0">
            {/* Status row */}
            <div className="flex items-center gap-2.5 mb-3">
              <StatusBadge status={book.status} />
              {book.edition && book.edition !== "1st Edition" && (
                <span className="text-[0.7rem] font-mono text-info bg-info/10 px-2.5 py-1 rounded">
                  {book.edition}
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl font-semibold text-ink leading-[1.15] tracking-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-lg text-ink-dim italic mt-1.5">
                {book.subtitle}
              </p>
            )}
            <p className="text-base text-ink-dim mt-3">
              by <strong className="text-ink">{book.author}</strong>
              {book.coAuthors && book.coAuthors.length > 0 && (
                <span className="text-ink-muted text-sm">
                  {" "}
                  with {book.coAuthors.join(", ")}
                </span>
              )}
            </p>

            {/* Price row */}
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <span className="font-serif text-2xl font-bold text-gold">
                {book.price === 0 ? "Free" : `₹${book.price}`}
              </span>
              <span className="text-[0.72rem] font-mono text-gold-dim bg-gold-glow px-2.5 py-1 rounded">
                {book.category}
              </span>
              {book.language && (
                <span className="text-[0.72rem] font-mono text-ink-dim bg-elevated px-2.5 py-1 rounded border border-line">
                  {book.language.toUpperCase()}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-7 pt-6 border-t border-line">
              <h3 className="font-serif text-lg font-semibold text-gold-dim tracking-wide mb-3">
                Description
              </h3>
              <p className="text-sm text-ink-dim leading-7 whitespace-pre-wrap">
                {book.description}
              </p>
            </div>

            {/* Genre tags */}
            {book.genreTags && book.genreTags.length > 0 && (
              <div className="mt-7 pt-6 border-t border-line">
                <h3 className="font-serif text-lg font-semibold text-gold-dim tracking-wide mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.genreTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-ink bg-elevated border border-line px-3 py-1.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom tags */}
            {book.customTags && book.customTags.length > 0 && (
              <div className="mt-7 pt-6 border-t border-line">
                <h3 className="font-serif text-lg font-semibold text-gold-dim tracking-wide mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.customTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-ink bg-elevated border border-line px-3 py-1.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-7 pt-6 border-t border-line">
              <h3 className="font-serif text-lg font-semibold text-gold-dim tracking-wide mb-3">
                Details
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                <MetaItem label="Pages" value={book.pageCount} />
                <MetaItem label="ISBN" value={book.isbn} />
                <MetaItem label="Edition" value={book.edition} />
                <MetaItem label="Publisher" value={book.publisher} />
                <MetaItem label="Audience" value={book.targetAudience} />
                <MetaItem
                  label="Published"
                  value={fmtDate(book.publicationDate)}
                />
                <MetaItem
                  label="Manuscript"
                  value={fmtBytes(book.manuscriptSize)}
                />
                <MetaItem label="Uploaded" value={fmtDate(book.createdAt)} />
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-7 pt-6 border-t border-line">
              <h3 className="font-serif text-lg font-semibold text-gold-dim tracking-wide mb-3">
                Copyright & Licensing
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                <MetaItem
                  label="License"
                  value={COPYRIGHT_LABELS[book.copyrightType ?? "standard"]}
                />
                <MetaItem label="Year" value={book.copyrightYear} />
                <MetaItem label="Holder" value={book.copyrightHolder} />
              </div>
            </div>

            {/* Distribution */}
            <div className="mt-7 pt-6 border-t border-line">
              <h3 className="font-serif text-lg font-semibold text-gold-dim tracking-wide mb-3">
                Distribution
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2.5">
                <Toggle label="Download Allowed" active={book.allowDownload} />
                <Toggle label="Preview Enabled" active={book.allowPreview} />
                <Toggle label="Exclusive" active={book.isExclusive} />
                <Toggle label="Pre-order" active={book.preOrderEnabled} />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-7 pt-6 border-t border-line">
              <h3 className="font-serif text-lg font-semibold text-gold-dim tracking-wide mb-3">
                Statistics
              </h3>
              <div className="flex gap-5">
                {[
                  { num: book.viewCount ?? 0, label: "Views" },
                  { num: book.downloadCount ?? 0, label: "Downloads" },
                ].map(({ num, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center px-7 py-4 bg-elevated border border-line rounded-sm"
                  >
                    <span className="font-serif text-3xl font-bold text-gold">
                      {num}
                    </span>
                    <span className="text-[0.72rem] font-mono text-ink-muted uppercase tracking-wider mt-1">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection reason */}
            {book.status === "rejected" && book.rejectionReason && (
              <div className="mt-7 pt-6 border-t border-line">
                <div className="px-5 py-4 bg-danger/10 border border-danger/25 rounded-sm text-danger text-sm leading-relaxed">
                  <strong className="block mb-1">Rejection Reason:</strong>
                  {book.rejectionReason}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteModal && (
        <DeleteConfirmModal
          bookTitle={book.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(false)}
          deleting={deleting}
        />
      )}
    </>
  );
};

export default BookDetailPage;
