"use client";

import {
  useState,
  useEffect,
  useCallback,
  type FC,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, Pencil, Trash2, BookOpen } from "lucide-react";
import {
  getBooks,
  deleteBook,
  getFileUrl,
  IPagination,
  IBook,
} from "../../../api/api";
import { CATEGORIES } from "./constants";
import StatusBadge from "./StatusBadge";
import DeleteConfirmModal from "./deleteConfirmModel";

const STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First" },
  { value: "title", label: "Title A–Z" },
  { value: "price", label: "Price" },
  { value: "viewCount", label: "Most Viewed" },
];

const fmtDate = (d?: string): string => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const BookListPage: FC = () => {
  const router = useRouter();

  const [books, setBooks] = useState<IBook[]>([]);
  const [pagination, setPagination] = useState<Partial<IPagination>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [page, setPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<IBook | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page,
        limit: 12,
        sortBy,
        order: sortBy === "title" ? "asc" : "desc",
      };
      if (search) params.search = search;
      if (status) params.status = status;
      if (category) params.category = category;

      const res = await getBooks(params as never);
      setBooks(res.data ?? []);
      setPagination(res.pagination ?? {});
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category, sortBy]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  useEffect(() => {
    setPage(1);
  }, [search, status, category, sortBy]);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBook(deleteTarget._id);
      setDeleteTarget(null);
      fetchBooks();
    } catch {
      alert("Failed to delete book");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Ambient orbs */}
      <div className="fixed  top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-info/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* ── Header ── */}
        <div className="flex mt-20 items-start justify-between mb-8 gap-5 flex-wrap">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-ink tracking-tight">
              Your Works
            </h1>
            <p className="text-sm text-ink-dim mt-1.5">
              Manage your uploaded books — view, edit, or remove works from your
              catalogue.
            </p>
          </div>
          <button
            onClick={() => router.push("/work")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-gold-dim to-gold text-deep rounded-sm font-body text-sm font-semibold hover:shadow-gold-glow hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Upload New Work
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="flex gap-3 mb-7 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, author, description…"
              value={searchInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchInput(e.target.value)
              }
              className="w-full py-3 pl-10 pr-4 bg-elevated border border-line rounded-sm text-ink font-body text-sm outline-none focus:border-gold-dim placeholder:text-ink-muted transition-colors"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-3 px-4 bg-elevated border border-line rounded-sm text-ink font-body text-sm outline-none focus:border-gold-dim cursor-pointer min-w-[150px]"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-3 px-4 bg-elevated border border-line rounded-sm text-ink font-body text-sm outline-none focus:border-gold-dim cursor-pointer min-w-[150px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-3 px-4 bg-elevated border border-line rounded-sm text-ink font-body text-sm outline-none focus:border-gold-dim cursor-pointer min-w-[150px]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-ink-dim">
            <div className="w-10 h-10 border-3 border-line border-t-gold rounded-full animate-spin-slow" />
            <p>Loading your works…</p>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
            <BookOpen className="w-12 h-12 text-ink-muted" strokeWidth={1.5} />
            <p className="text-lg text-ink">No books found</p>
            <span className="text-sm text-ink-dim">
              Try adjusting your filters or upload a new work.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 mb-10">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-card border border-line rounded-card overflow-hidden transition-all duration-300 hover:border-line-light hover:shadow-card-hover hover:-translate-y-0.5 group"
              >
                {/* Cover */}
                <div
                  className="relative aspect-[3/2] bg-deep cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/books/${book._id}`)}
                >
                  {book.frontCover ? (
                    <img
                      src={
                        process.env.NEXT_PUBLIC_API_BASE_URL + book.frontCover!
                      }
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-elevated">
                      <BookOpen
                        className="w-8 h-8 text-ink-muted"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={book.status} />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-serif text-lg font-semibold text-ink leading-snug cursor-pointer hover:text-gold transition-colors line-clamp-2"
                    onClick={() => router.push(`/books/${book._id}`)}
                  >
                    {book.title}
                  </h3>
                  <p className="text-sm text-ink-dim mt-1">by {book.author}</p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <span className="text-[0.72rem] font-mono text-gold-dim bg-gold-glow px-2 py-0.5 rounded">
                      {book.category}
                    </span>
                    <span className="text-sm font-semibold text-gold">
                      {book.price === 0 ? "Free" : `₹${book.price}`}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted mt-1.5">
                    {fmtDate(book.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 px-4 pb-4">
                  {[
                    {
                      icon: Eye,
                      title: "View",
                      onClick: () => router.push(`/books/${book._id}`),
                      danger: false,
                    },
                    {
                      icon: Pencil,
                      title: "Edit",
                      onClick: () => router.push(`/books/${book._id}/edit`),
                      danger: false,
                    },
                    {
                      icon: Trash2,
                      title: "Delete",
                      onClick: () => setDeleteTarget(book),
                      danger: true,
                    },
                  ].map(({ icon: Icon, title, onClick, danger }) => (
                    <button
                      key={title}
                      title={title}
                      onClick={onClick}
                      className={`w-9 h-9 flex items-center justify-center bg-elevated border border-line rounded-lg text-ink-dim transition-all
                        ${
                          danger
                            ? "hover:text-danger hover:border-danger/40 hover:bg-danger/10"
                            : "hover:text-gold hover:border-gold-dim hover:bg-surface"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {(pagination.pages ?? 0) > 1 && (
          <div className="flex items-center justify-center gap-5 my-5 mb-10">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2.5 bg-elevated border border-line rounded-sm text-ink font-body text-sm hover:border-gold-dim hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-sm text-ink-dim font-mono">
              Page {pagination.page} of {pagination.pages} · {pagination.total}{" "}
              works
            </span>
            <button
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2.5 bg-elevated border border-line rounded-sm text-ink font-body text-sm hover:border-gold-dim hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          bookTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
};

export default BookListPage;
