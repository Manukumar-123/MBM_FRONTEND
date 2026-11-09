"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  BookOpen,
  Copy,
  Eye,
  MessageCircle,
  Pencil,
  Plus,
  QrCode,
  Sparkles,
  Trash2,
  UserPlus,
  Video,
  X,
} from "lucide-react";

import useAuthStore from "../../store/authStore";
import {
  getBooks,
  deleteBook,
  getFileUrl,
  getAuthorById,
  getMyCreativeVideos,
  deleteCreativeVideo,
  viewCreativeVideo,
  type IBook,
  type IAuthorProfile,
  type ICreativeVideo,
} from "../../../api/api";
import StatusBadge from "../../components/workPage/StatusBadge";
import DeleteConfirmModal from "../../components/workPage/deleteConfirmModel";
import CommunityPostsPanel from "../../components/CommunityPostsPanel";

type Tab = "works" | "posts" | "pitchAlley" | "askUniverse" | "about";

const parseProfileTab = (value: string | null): Tab =>
  value === "posts" || value === "pitchAlley" || value === "askUniverse" || value === "about" ? value : "works";

const ROLE_META: Record<
  string,
  { label: string; description: string; chip: string; dot: string }
> = {
  author: {
    label: "Author",
    description: "Full publishing access — upload, edit and manage books.",
    chip: "bg-amber-400/10 text-amber-700 dark:text-amber-300 border-amber-400/30",
    dot: "bg-amber-400",
  },
  writer: {
    label: "Writer",
    description: "Full publishing access — upload, edit and manage books.",
    chip: "bg-violet-400/10 text-violet-700 dark:text-violet-300 border-violet-400/30",
    dot: "bg-violet-400",
  },
  user: {
    label: "Reader",
    description: "Browse and enjoy books from our creators.",
    chip: "bg-slate-400/10 text-slate-700 dark:text-slate-300 border-slate-400/30",
    dot: "bg-slate-400",
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

const formatCount = (n?: number) => {
  const val = n ?? 0;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return String(val);
};

/* ---------------------------------------------------------------------- */
/* Shared building blocks                                                  */
/* ---------------------------------------------------------------------- */

function GradientButton({
  href,
  onClick,
  children,
  icon: Icon,
  variant = "solid",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ElementType;
  variant?: "solid" | "outline";
}) {
  const classes =
    variant === "solid"
      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/10"
      : "bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10";
  const base = `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${classes}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={base}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center px-4">
      <span className="text-lg font-bold text-white">{value}</span>
      <span className="text-xs text-gray-500 mt-0.5">{label}</span>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="bg-white/[0.03] rounded-2xl p-10 border border-white/10 text-center">
      <div className="w-14 h-14 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
        <Icon className="w-6 h-6 text-cyan-300" />
      </div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">{description}</p>
      {actionLabel && actionHref && (
        <GradientButton href={actionHref} icon={Plus}>
          {actionLabel}
        </GradientButton>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Creative videos — Pitch Alley / Ask the Universe                        */
/* ---------------------------------------------------------------------- */

function VideoGrid({
  videos,
  onDelete,
  deletingId,
  trackViews = false,
}: {
  videos: ICreativeVideo[];
  onDelete?: (id: string) => void;
  deletingId?: string | null;
  trackViews?: boolean;
}) {
  const countedRef = React.useRef<Set<string>>(new Set());
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  const handlePlay = (id: string) => {
    if (!trackViews || countedRef.current.has(id)) return;
    countedRef.current.add(id);
    viewCreativeVideo(id)
      .then((res) => setViewCounts((prev) => ({ ...prev, [id]: res.data.views })))
      .catch(() => countedRef.current.delete(id));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {videos.map((v) => (
        <div
          key={v._id}
          className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
        >
          <video
            src={getFileUrl(v.videoUrl) ?? undefined}
            controls
            onPlay={() => handlePlay(v._id)}
            className="w-full aspect-video bg-black"
          />
          <div className="p-3 flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{v.title}</h4>
              {v.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{v.description}</p>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Eye className="w-3.5 h-3.5" />
                {viewCounts[v._id] ?? v.views ?? 0} views
              </div>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(v._id)}
                disabled={deletingId === v._id}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-red-500/20 hover:text-red-400 border border-white/10 transition flex-shrink-0"
                aria-label="Delete video"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MyVideoSection({
  section,
  title,
  uploadHref,
  uploadLabel,
  emptyTitle,
  emptyDescription,
}: {
  section: "pitch_alley" | "ask_universe";
  title: string;
  uploadHref: string;
  uploadLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const [videos, setVideos] = useState<ICreativeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyCreativeVideos(section);
      setVideos(res.data ?? []);
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    setDeletingId(id);
    try {
      await deleteCreativeVideo(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert("Failed to delete video");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <GradientButton href={uploadHref} icon={Plus}>
          {uploadLabel}
        </GradientButton>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-gray-500">
          <div className="w-8 h-8 border-2 border-white/10 border-t-cyan-400 rounded-full animate-spin" />
          Loading…
        </div>
      ) : videos.length === 0 ? (
        <EmptyState
          icon={Video}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={uploadLabel}
          actionHref={uploadHref}
        />
      ) : (
        <VideoGrid videos={videos} onDelete={handleDelete} deletingId={deletingId} />
      )}
    </div>
  );
}

function ShareQrModal({
  name,
  profileUrl,
  onClose,
}: {
  name: string;
  profileUrl: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  // Renders the QR client-side via a public QR image endpoint — swap for a
  // bundled QR library (e.g. qrcode.react) if you'd rather not depend on it.
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(
    profileUrl,
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-semibold text-lg mb-1">Share Profile</h3>
        <p className="text-sm text-gray-500 mb-5">
          Scan to open {name || "this creator"}&apos;s MeBookMeta profile.
        </p>

        <div className="flex justify-center mb-5">
          <div className="p-3 bg-white rounded-2xl">
            <img src={qrSrc} alt="Profile QR code" width={200} height={200} />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-4 py-2">
          <span className="flex-1 text-xs text-gray-400 truncate">{profileUrl}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Own profile                                                             */
/* ---------------------------------------------------------------------- */

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const profileId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const tabParam = searchParams.get("tab");
  const { user, accessToken, hasHydrated } = useAuthStore();

  const isOwnProfile = !!user?._id && user._id === profileId;
  const isAuthor = user?.role === "author" || user?.role === "writer";
  const roleInfo = ROLE_META[user?.role ?? "user"] ?? ROLE_META.user;

  const [activeTab, setActiveTab] = useState<Tab>(() => parseProfileTab(tabParam));

  useEffect(() => {
    setActiveTab(parseProfileTab(tabParam));
  }, [tabParam]);

  const [books, setBooks] = useState<IBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<IBook | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    // Wait for the persisted store to hydrate — otherwise a reload sees accessToken/user
    // as null for a moment and incorrectly bounces a logged-in user to /login.
    if (!hasHydrated) return;
    if (!accessToken || !user) {
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, user, router]);

  const fetchMyWorks = useCallback(async () => {
    if (!isOwnProfile || !isAuthor || !user?.name) return;
    setBooksLoading(true);
    try {
      const res = await getBooks({
        // "mine" reliably matches by account id; author is kept as a fallback
        // for older books submitted before ownership tracking existed.
        mine: "true",
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

  if (!hasHydrated || !accessToken || !user) return null;

  if (!isOwnProfile) {
    return <PublicProfileView id={profileId} />;
  }

  const stats = {
    total,
    published: books.filter((b) => b.status === "approved").length,
    pending: books.filter((b) => b.status === "pending_review").length,
    drafts: books.filter((b) => b.status === "draft").length,
  };

  const followers = 0;
  const following = 0;

  const tabs: { key: Tab; label: string; hint?: string }[] = [
    { key: "works", label: "Works" },
    { key: "posts", label: "Posts" },
    { key: "pitchAlley", label: "Pitch Alley", hint: "Pitch ideas" },
    { key: "askUniverse", label: "Ask the Universe", hint: "Ask the community" },
    { key: "about", label: "About" },
  ];

  return (
    <div className="profile-page min-h-screen bg-[#050507] text-white">
      {/* Top Navigation Bar */}
      {/* <div className="bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent"
          >
            MeBookMeta
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQr(true)}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition"
              title="Share profile"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <Link
              href="/settings"
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-4 py-2 rounded-full text-sm transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div> */}

      {/* Cover */}
      <div className="profile-banner relative h-56 overflow-hidden bg-gradient-to-r from-white via-slate-100 to-white dark:from-cyan-950 dark:via-[#0a0a12] dark:to-violet-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.15),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.15),transparent_45%)]" />
        <div className="absolute inset-0 bg-white/10 dark:bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="profile-layout max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="profile-card bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 sticky top-20">
              {/* Avatar */}
              <div className="profile-avatar-wrap flex justify-center -mt-16 mb-4">
                <div className="p-[3px] rounded-full bg-gradient-to-tr from-cyan-400 via-violet-400 to-blue-500 shadow-lg shadow-cyan-500/20">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center bg-[#0a0a0f] text-white text-3xl font-bold">
                    {user.avatarUrl ? (
                      <img src={getFileUrl(user.avatarUrl) || user.avatarUrl} alt={`${user.name || "User"} profile`} className="h-full w-full rounded-full object-cover" />
                    ) : getInitials(user.name)}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="profile-card-heading text-center mb-5">
                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-violet-700 to-cyan-700 dark:from-white dark:via-violet-200 dark:to-cyan-300 bg-clip-text text-transparent">
                  {user.name || "Unnamed User"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.chip}`}
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {roleInfo.label}
                </span>
                <p className="profile-bio text-sm text-gray-500 mt-3">{user.bio || roleInfo.description}</p>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center divide-x divide-white/10 py-4 border-y border-white/10 mb-5">
                <StatBlock label="Works" value={formatCount(total)} />
                <StatBlock label="Followers" value={formatCount(followers)} />
                <StatBlock label="Following" value={formatCount(following)} />
              </div>

              <div className="mb-4">
                <GradientButton href="/settings" icon={Pencil}>
                  Edit Profile
                </GradientButton>
              </div>

              <div className="profile-joined border-t border-white/10 pt-4 text-sm text-gray-500">
                Joined {user.createdAt ? fmtDate(user.createdAt) : "MeBookMeta"}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="profile-tabs flex gap-2 mb-6 border-b border-white/10 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative rounded-t-lg px-4 py-3 text-sm font-semibold whitespace-nowrap transition ${
                    activeTab === tab.key
                      ? "bg-violet-100 text-gray-900 dark:bg-white/10 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}{tab.hint && <small>{tab.hint}</small>}
                  {activeTab === tab.key && (
                    <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {activeTab === "about" && (
              <div className="profile-panel">
                <section className="profile-surface rounded-2xl p-6">
                  <h2 className="text-xl font-bold">About</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{user.bio || roleInfo.description}</p>
                  <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <dt className="text-gray-500">Account type</dt>
                      <dd className="mt-1 font-medium">{roleInfo.label}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Member since</dt>
                      <dd className="mt-1 font-medium">{user.createdAt ? fmtDate(user.createdAt) : "MeBookMeta"}</dd>
                    </div>
                    {user.craft && <div><dt className="text-gray-500">Craft</dt><dd className="mt-1 font-medium">{user.craft}</dd></div>}
                    {user.location && <div><dt className="text-gray-500">Location</dt><dd className="mt-1 font-medium">{user.location}</dd></div>}
                  </dl>
                  {!!user.socialLinks?.length && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {user.socialLinks.map((social, index) => (
                        <a key={`${social.platform}-${index}`} href={social.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:border-cyan-300/50">
                          {social.platform === "x" ? "X / Twitter" : social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
            {activeTab === "works" && isAuthor && (
              <div className="profile-panel">
                <section className="profile-surface profile-setup rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">Set up your profile</h2>
                      <p className="mt-1 text-sm text-gray-400">Your creator space is ready. Add a work to start building your shelf.</p>
                    </div>
                    <Link href="/settings" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">Edit profile</Link>
                  </div>
                  <div className="profile-progress mt-5"><span style={{ width: books.length ? "100%" : "66%" }} /></div>
                  <div className="profile-checklist mt-3">
                    <div className="profile-check is-done"><span>✓</span>Create your account</div>
                    <div className="profile-check is-done"><span>✓</span>Choose your account type</div>
                    <div className={`profile-check ${books.length ? "is-done" : ""}`}><span>{books.length ? "✓" : ""}</span>Upload your first work</div>
                  </div>
                </section>

                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-2xl font-bold">Works</h2>
                  <GradientButton href="/work" icon={Plus}>
                    Upload new work
                  </GradientButton>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Works", value: stats.total },
                    { label: "Published", value: stats.published },
                    { label: "In review", value: stats.pending },
                    { label: "Drafts", value: stats.drafts },
                  ].map((stat) => (
                    <div key={stat.label} className="profile-surface rounded-2xl p-4 text-center">
                      <div className="text-xl font-bold">{stat.value}</div>
                      <div className="mt-1 text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {booksLoading ? (
                  <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-gray-500">
                    <div className="w-8 h-8 border-2 border-white/10 border-t-cyan-400 rounded-full animate-spin" />
                    Loading your works…
                  </div>
                ) : books.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No Work Samples Yet"
                    description="Once you publish, your books will show up here."
                    actionLabel="Add Work Sample"
                    actionHref="/work"
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {books.map((book) => (
                      <div
                        key={book._id}
                        className="profile-work-card bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex gap-3 p-3 hover:border-white/20 transition"
                      >
                        <div className="profile-work-cover w-16 h-20 flex-shrink-0 bg-white/[0.05] rounded-lg overflow-hidden">
                          {book.frontCover && (
                            <img
                              src={getFileUrl(book.frontCover) ?? undefined}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{book.title}</h4>
                          <div className="mt-1">
                            <StatusBadge status={book.status} />
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {fmtDate(book.createdAt)}
                          </div>
                          <div className="flex items-center gap-3 mt-3 text-gray-500">
                            <Link
                              href={`/books/${book._id}`}
                              className="hover:text-white transition"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/books/${book._id}/edit`}
                              className="hover:text-white transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(book)}
                              className="hover:text-red-400 transition"
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

            {activeTab === "works" && !isAuthor && (
              <div className="profile-panel">
                <EmptyState
                  icon={BookOpen}
                  title="Works are for creators"
                  description="Reader accounts can browse and enjoy books. Author and writer accounts can publish works and share them here."
                />
              </div>
            )}

            {activeTab === "posts" && (
              <div className="profile-panel"><CommunityPostsPanel userId={user._id} canCreate compact /></div>
            )}

            {activeTab === "pitchAlley" && isAuthor && (
              <div className="profile-panel"><MyVideoSection
                section="pitch_alley"
                title="Pitch Alley"
                uploadHref="/work/pitch-alley"
                uploadLabel="Upload Pitch"
                emptyTitle="No Pitches Yet"
                emptyDescription="Record a short video pitching your book to readers and publishers browsing Pitch Alley."
              /></div>
            )}

            {activeTab === "pitchAlley" && !isAuthor && (
              <div className="profile-panel"><EmptyState icon={Video} title="Pitch Alley" description="Pitch videos are available to author and writer accounts." /></div>
            )}

            {activeTab === "askUniverse" && isAuthor && (
              <div className="profile-panel"><MyVideoSection
                section="ask_universe"
                title="Ask the Universe"
                uploadHref="/work/ask-universe"
                uploadLabel="Post a Video"
                emptyTitle="Nothing Posted Yet"
                emptyDescription="Ask the community a question about your work, your genre, or your next project."
              /></div>
            )}

            {activeTab === "askUniverse" && !isAuthor && (
              <div className="profile-panel"><EmptyState icon={Sparkles} title="Ask the Universe" description="Ask the Universe videos are available to author and writer accounts." /></div>
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

      {showQr && typeof window !== "undefined" && (
        <ShareQrModal
          name={user.name || "Your"}
          profileUrl={`${window.location.origin}/profile/${user._id}`}
          onClose={() => setShowQr(false)}
        />
      )}

      <div className="h-20"></div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Public profile view (Instagram/Twitter-style)                           */
/* ---------------------------------------------------------------------- */

function PublicProfileView({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<IAuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<"works" | "posts" | "pitchAlley" | "askUniverse" | "about">(() => {
    const tab = searchParams.get("tab");
    return tab === "posts" || tab === "pitchAlley" || tab === "askUniverse" || tab === "about" ? tab : "works";
  });
  // TODO: replace with a real follow-state call once the API supports it.
  const [isFollowing, setIsFollowing] = useState(false);
  const [showQr, setShowQr] = useState(false);

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
      <div className="profile-page min-h-screen flex items-center justify-center bg-[#050507] text-gray-500">
        <div className="w-8 h-8 border-2 border-white/10 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="profile-page min-h-screen flex flex-col items-center justify-center gap-3 bg-[#050507] text-white">
        <p className="text-lg font-semibold">Profile not found</p>
      </div>
    );
  }

  const { user: author, books, bookCount } = profile;
  const roleInfo = ROLE_META[author.role ?? "user"] ?? ROLE_META.user;
  const followers = 0;
  const following = 0;

  return (
    <div className="profile-page min-h-screen bg-[#050507] text-white">
      {/* <div className="bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent"
          >
            MeBookMeta
          </Link>
        </div>
      </div> */}

      <div className="profile-banner relative h-56 overflow-hidden bg-gradient-to-r from-white via-slate-100 to-white dark:from-cyan-950 dark:via-[#0a0a12] dark:to-violet-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.15),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.15),transparent_45%)]" />
        <div className="absolute inset-0 bg-white/10 dark:bg-black/40" />
      </div>

      <div className="profile-layout max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="profile-card bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 sticky top-20">
              <div className="profile-avatar-wrap flex justify-center -mt-16 mb-4">
                <div className="p-[3px] rounded-full bg-gradient-to-tr from-cyan-400 via-violet-400 to-blue-500 shadow-lg shadow-cyan-500/20">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center bg-[#0a0a0f] text-white text-3xl font-bold">
                    {author.avatarUrl ? (
                      <img src={getFileUrl(author.avatarUrl) || author.avatarUrl} alt={`${author.name || "Creator"} profile`} className="h-full w-full rounded-full object-cover" />
                    ) : getInitials(author.name)}
                  </div>
                </div>
              </div>

              <div className="profile-card-heading text-center mb-5">
                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-violet-700 to-cyan-700 dark:from-white dark:via-violet-200 dark:to-cyan-300 bg-clip-text text-transparent">
                  {author.name || "Unnamed User"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.chip}`}
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {roleInfo.label}
                </span>
                <p className="profile-bio text-sm text-gray-500 mt-3">{author.bio || roleInfo.description}</p>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center divide-x divide-white/10 py-4 border-y border-white/10 mb-5">
                <StatBlock label="Works" value={formatCount(bookCount)} />
                <StatBlock label="Followers" value={formatCount(followers)} />
                <StatBlock label="Following" value={formatCount(following)} />
              </div>

              {/* Message / Follow */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <GradientButton
                  onClick={() => setIsFollowing((f) => !f)}
                  icon={isFollowing ? BadgeCheck : UserPlus}
                  variant={isFollowing ? "outline" : "solid"}
                >
                  {isFollowing ? "Following" : "Follow"}
                </GradientButton>
                {/* TODO: point at the real messaging route once it exists */}
                <GradientButton href={`/messages/${author._id ?? id}`} icon={MessageCircle} variant="outline">
                  Message
                </GradientButton>
              </div>
              <button
                onClick={() => setShowQr(true)}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 hover:text-white py-2 mb-6 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                Share via QR
              </button>

              <div className="profile-joined border-t border-white/10 pt-4 text-sm text-gray-500">
                Member since {fmtDate(author.createdAt)}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="profile-tabs flex gap-1 mb-6 border-b border-white/10 overflow-x-auto">
              {[
                { key: "works", label: "Works" },
                { key: "posts", label: "Posts" },
                { key: "pitchAlley", label: "Pitch Alley", hint: "Pitch ideas" },
                { key: "askUniverse", label: "Ask the Universe", hint: "Ask the community" },
                { key: "about", label: "About" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition ${
                    activeTab === tab.key
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}{tab.hint && <small>{tab.hint}</small>}
                  {activeTab === tab.key && (
                    <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {activeTab === "works" && (
              <div className="profile-panel">
                <h2 className="mb-5 text-2xl font-bold">Works</h2>
                {books.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No Published Works Yet"
                    description="This creator hasn't published any books yet — check back soon."
                  />
                ) : (
                  <div className="profile-public-works grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {books.map((book) => (
                      <Link
                        key={book._id}
                        href={`/books/${book._id}`}
                        className="profile-work-card bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex gap-3 p-3 hover:border-white/20 transition"
                      >
                        <div className="profile-work-cover w-16 h-20 flex-shrink-0 bg-white/[0.05] rounded-lg overflow-hidden">
                          {book.frontCover && (
                            <img
                              src={getFileUrl(book.frontCover) ?? undefined}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                          <div className="text-xs text-gray-500 mt-1">{book.category}</div>
                          <div className="flex items-center gap-3 mt-3 text-gray-500 text-xs">
                            <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{book.viewCount ?? 0}</span>
                            <span>{fmtDate(book.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "about" && (
              <div className="profile-panel">
                <section className="profile-surface rounded-2xl p-6">
                  <h2 className="text-xl font-bold">About {author.name || "this creator"}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{author.bio || roleInfo.description}</p>
                  <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div><dt className="text-gray-500">Account type</dt><dd className="mt-1 font-medium">{roleInfo.label}</dd></div>
                    <div><dt className="text-gray-500">Member since</dt><dd className="mt-1 font-medium">{fmtDate(author.createdAt)}</dd></div>
                    {author.craft && <div><dt className="text-gray-500">Craft</dt><dd className="mt-1 font-medium">{author.craft}</dd></div>}
                    {author.location && <div><dt className="text-gray-500">Location</dt><dd className="mt-1 font-medium">{author.location}</dd></div>}
                  </dl>
                  {!!author.socialLinks?.length && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {author.socialLinks.map((social, index) => (
                        <a key={`${social.platform}-${index}`} href={social.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:border-cyan-300/50">
                          {social.platform === "x" ? "X / Twitter" : social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === "posts" && <div className="profile-panel"><CommunityPostsPanel userId={author._id ?? id} compact /></div>}

            {activeTab === "pitchAlley" &&
              (profile.pitchVideos && profile.pitchVideos.length > 0 ? (
                <div className="profile-panel"><VideoGrid videos={profile.pitchVideos} trackViews /></div>
              ) : (
                <div className="profile-panel"><EmptyState
                  icon={Video}
                  title="No Pitches Yet"
                  description={`${author.name || "This creator"} hasn't posted to Pitch Alley yet.`}
                /></div>
              ))}

            {activeTab === "askUniverse" &&
              (profile.universeVideos && profile.universeVideos.length > 0 ? (
                <div className="profile-panel"><VideoGrid videos={profile.universeVideos} trackViews /></div>
              ) : (
                <div className="profile-panel"><EmptyState
                  icon={Sparkles}
                  title="Nothing Posted Yet"
                  description={`${author.name || "This creator"} hasn't posted to Ask the Universe yet.`}
                /></div>
              ))}
          </div>
        </div>
      </div>

      {showQr && typeof window !== "undefined" && (
        <ShareQrModal
          name={author.name || "This creator's"}
          profileUrl={`${window.location.origin}/profile/${author._id ?? id}`}
          onClose={() => setShowQr(false)}
        />
      )}

      <div className="h-20"></div>
    </div>
  );
}
