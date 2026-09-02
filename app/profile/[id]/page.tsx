"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BadgeCheck,
  BookOpen,
  Calendar,
  Eye,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Upload,
  User as UserIcon,
  VenetianMask,
} from "lucide-react";

import useAuthStore from "../../store/authStore";
import {
  getBooks,
  deleteBook,
  getFileUrl,
  getAuthorById,
  type IBook,
  type IAuthorProfile,
} from "../../../api/api";
import StatusBadge from "../../components/workPage/StatusBadge";
import DeleteConfirmModal from "../../components/workPage/deleteConfirmModel";

type Tab = "overview" | "works";

const ROLE_META: Record<
  string,
  { label: string; description: string; badge: string }
> = {
  author: {
    label: "Author",
    description: "Full publishing access — upload, edit and manage books.",
    badge:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  writer: {
    label: "Writer",
    description: "Full publishing access — upload, edit and manage books.",
    badge:
      "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  user: {
    label: "Reader",
    description: "Browse and enjoy books from our creators.",
    badge: "bg-gray-500/15 text-gray-600 dark:text-gray-300 border-gray-500/30",
  },
};

const fmtDate = (d?: string): string => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
};

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const profileId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const { user, accessToken, clearAccessToken, clearUser } = useAuthStore();

  const isOwnProfile = !!user?._id && user._id === profileId;
  const isAuthor = user?.role === "author" || user?.role === "writer";
  const roleInfo = ROLE_META[user?.role ?? "user"] ?? ROLE_META.user;

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [books, setBooks] = useState<IBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<IBook | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Redirect unauthenticated visitors to login
  useEffect(() => {
    if (!accessToken || !user) {
      router.replace("/login");
    }
  }, [accessToken, user, router]);

  const fetchMyWorks = useCallback(async () => {
    if (!isOwnProfile || !isAuthor || !user?.name) return;
    setBooksLoading(true);
    try {
      const res = await getBooks({
        author: user.name,
        limit: "50",
        sortBy: "createdAt",
        order: "desc",
      } as never);
      setBooks(res.data ?? []);
      setTotal(res.pagination?.total ?? res.data?.length ?? 0);
    } catch {
      setBooks([]);
    } finally {
      setBooksLoading(false);
    }
  }, [isOwnProfile, isAuthor, user?.name]);

  useEffect(() => {
    fetchMyWorks();
  }, [fetchMyWorks]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBook(deleteTarget._id);
      setDeleteTarget(null);
      fetchMyWorks();
    } catch {
      alert("Failed to delete book");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    clearAccessToken();
    clearUser();
    router.replace("/login");
  };

  if (!accessToken || !user) return null;

  if (!isOwnProfile) {
    return <PublicProfileView id={profileId} />;
  }

  const stats = {
    total,
    published: books.filter((b) => b.status === "approved").length,
    pending: books.filter((b) => b.status === "pending_review").length,
    drafts: books.filter((b) => b.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Top Navigation Bar */}
      <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            MeBookMeta
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded text-sm transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Cover */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 sticky top-20">
              {/* Avatar */}
              <div className="flex justify-center -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 bg-gray-700 dark:bg-gray-700 text-white text-3xl font-bold shadow-lg">
                  {getInitials(user.name)}
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-1">
                  {user.name || "Unnamed User"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${roleInfo.badge}`}
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {roleInfo.label}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  {roleInfo.description}
                </p>
              </div>

              {/* Author quick actions */}
              {isAuthor && (
                <div className="space-y-2 mb-6">
                  <Link
                    href="/work"
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 rounded transition"
                  >
                    <Upload className="w-4 h-4" />
                    Upload New Work
                  </Link>
                  <Link
                    href="/workList"
                    className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-[#cccccc] text-gray-900 dark:text-black hover:bg-gray-300 dark:hover:bg-gray-200 font-semibold py-2 rounded transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    Manage My Works
                  </Link>
                </div>
              )}

              {/* Personal Info */}
              <div className="space-y-4 text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                {[
                  {
                    icon: user.identifier?.includes("@") ? Mail : Phone,
                    label: "Contact",
                    value: user.identifier || "—",
                  },
                  {
                    icon: Calendar,
                    label: "Date of Birth",
                    value: fmtDate(user.dob),
                  },
                  {
                    icon: VenetianMask,
                    label: "Gender",
                    value: user.gender
                      ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                      : "—",
                  },
                  { icon: UserIcon, label: "Account Type", value: roleInfo.label },
                ].map((info, idx) => (
                  <div className="flex items-start gap-3 mt-4" key={idx}>
                    <info.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs uppercase font-semibold mb-1">
                        {info.label}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white break-all">
                        {info.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
              {(["overview", ...(isAuthor ? (["works"] as Tab[]) : [])] as Tab[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-semibold rounded-t transition ${
                      activeTab === tab
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {tab === "overview" ? "Overview" : "My Works"}
                  </button>
                ),
              )}
            </div>

            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats */}
                {isAuthor ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Total Works", value: stats.total },
                      { label: "Published", value: stats.published },
                      { label: "In Review", value: stats.pending },
                      { label: "Drafts", value: stats.drafts },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center"
                      >
                        <div className="text-2xl font-bold">{s.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-gray-600 dark:text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      Become an Author
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      Reader accounts can browse and enjoy books. Author and
                      writer accounts unlock publishing tools like uploading
                      manuscripts, managing works and tracking sales. Contact
                      support to upgrade your account.
                    </p>
                  </div>
                )}

                <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold mb-4">Account Details</h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">Name</dt>
                      <dd className="font-medium">{user.name || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">
                        Contact
                      </dt>
                      <dd className="font-medium">{user.identifier || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">
                        Date of Birth
                      </dt>
                      <dd className="font-medium">{fmtDate(user.dob)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">
                        Gender
                      </dt>
                      <dd className="font-medium">{user.gender || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 dark:text-gray-400">
                        Account Type
                      </dt>
                      <dd className="font-medium">{roleInfo.label}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === "works" && isAuthor && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">My Works</h3>
                  <Link
                    href="/work"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded text-sm font-semibold transition"
                  >
                    <Plus className="w-4 h-4" />
                    Upload New Work
                  </Link>
                </div>

                {booksLoading ? (
                  <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-gray-500 dark:text-gray-400">
                    <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-amber-500 rounded-full animate-spin" />
                    Loading your works…
                  </div>
                ) : books.length === 0 ? (
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-3" />
                    <p className="mb-4 text-sm">No Work Samples Yet</p>
                    <Link
                      href="/work"
                      className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-white text-sm transition"
                    >
                      Add Work Sample
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {books.map((book) => (
                      <div
                        key={book._id}
                        className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex gap-3 p-3"
                      >
                        <div className="w-16 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                          {book.frontCover && (
                            <img
                              src={getFileUrl(book.frontCover) ?? undefined}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm truncate">
                              {book.title}
                            </h4>
                          </div>
                          <div className="mt-1">
                            <StatusBadge status={book.status} />
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {fmtDate(book.createdAt)}
                          </div>
                          <div className="flex items-center gap-3 mt-3 text-gray-500 dark:text-gray-400">
                            <Link
                              href={`/books/${book._id}`}
                              className="hover:text-gray-900 dark:hover:text-white"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/books/${book._id}/edit`}
                              className="hover:text-gray-900 dark:hover:text-white"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(book)}
                              className="hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          bookTitle={deleteTarget.title}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      <div className="h-20"></div>
    </div>
  );
}

/**
 * Read-only view shown when visiting someone else's profile (e.g. clicked from search/carousel).
 */
function PublicProfileView({ id }: { id: string }) {
  const [profile, setProfile] = useState<IAuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getAuthorById(id)
      .then((res) => {
        if (!cancelled) setProfile(res.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-gray-500 dark:text-gray-400">
        Loading profile…
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white dark:bg-black text-gray-900 dark:text-white">
        <p className="text-lg font-semibold">Profile not found</p>
        <Link href="/" className="text-sm text-amber-500 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const { user: author, books, bookCount } = profile;
  const roleInfo = ROLE_META[author.role ?? "user"] ?? ROLE_META.user;
  const totalViews = books.reduce((sum, b) => sum + (b.viewCount ?? 0), 0);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            MeBookMeta
          </Link>
        </div>
      </div>

      <div className="relative h-56 overflow-hidden bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 sticky top-20">
              <div className="flex justify-center -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 bg-gray-700 dark:bg-gray-700 text-white text-3xl font-bold shadow-lg">
                  {getInitials(author.name)}
                </div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-1">
                  {author.name || "Unnamed User"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${roleInfo.badge}`}
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {roleInfo.label}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  {roleInfo.description}
                </p>
              </div>

              <div className="space-y-4 text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                {[
                  {
                    icon: Calendar,
                    label: "Member Since",
                    value: fmtDate(author.createdAt),
                  },
                  {
                    icon: VenetianMask,
                    label: "Gender",
                    value: author.gender
                      ? author.gender.charAt(0).toUpperCase() +
                        author.gender.slice(1)
                      : "—",
                  },
                  { icon: UserIcon, label: "Account Type", value: roleInfo.label },
                ].map((info, idx) => (
                  <div className="flex items-start gap-3 mt-4" key={idx}>
                    <info.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs uppercase font-semibold mb-1">
                        {info.label}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white break-all">
                        {info.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Published Works", value: bookCount },
                { label: "Total Views", value: totalViews },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-lg mb-4">Published Works</h3>

            {books.length === 0 ? (
              <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">No published works yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {books.map((book) => (
                  <Link
                    key={book._id}
                    href={`/books/${book._id}`}
                    className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex gap-3 p-3 hover:border-gray-400 dark:hover:border-gray-600 transition"
                  >
                    <div className="w-16 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                      {book.frontCover && (
                        <img
                          src={getFileUrl(book.frontCover) ?? undefined}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {book.title}
                      </h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {book.category}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-gray-500 dark:text-gray-400 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {book.viewCount ?? 0}
                        </span>
                        <span>{fmtDate(book.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}
