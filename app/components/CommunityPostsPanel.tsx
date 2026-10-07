"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Heart, ImagePlus, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import {
  createCommunityPost,
  deleteCommunityPost,
  getCommunityPosts,
  getFileUrl,
  toggleCommunityPostLike,
  type ICommunityPost,
} from "../../api/api";
import useAuthStore from "../store/authStore";
import DeleteConfirmModal from "./workPage/deleteConfirmModel";

interface Props {
  userId?: string;
  canCreate?: boolean;
  limit?: number;
  compact?: boolean;
  slider?: boolean;
}

interface PostCardProps {
  post: ICommunityPost;
  compact: boolean;
  sliderCard: boolean;
  canDelete: boolean;
  liking: boolean;
  onLike: () => void;
  onDelete: () => void;
}

function CommunityPostCard({ post, compact, sliderCard, canDelete, liking, onLike, onDelete }: PostCardProps) {
  return (
    <article className={`overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-900/5 dark:border-white/10 dark:bg-[#101014] dark:text-white dark:shadow-violet-950/10 ${compact ? `flex w-full flex-col ${sliderCard ? "mx-auto h-[620px] sm:h-[660px]" : "h-full"}` : ""}`}>
      <div className="flex items-center gap-3 p-4 sm:p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 font-bold text-white">
          {(post.userName || "M").split(/\s+/).slice(0, 2).map((name) => name[0]).join("").toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/profile/${post.userId}`} className="font-semibold hover:text-cyan-500">{post.userName}</Link>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        {canDelete && (
          <button type="button" onClick={onDelete} aria-label="Delete post" className="rounded-lg p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="px-4 pb-3 sm:px-5">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className={`mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-300 ${compact ? "line-clamp-2" : ""}`}>{post.description}</p>
      </div>
      <img src={getFileUrl(post.imageUrl) ?? undefined} alt={post.title} className={`w-full bg-black/5 ${sliderCard ? "h-[320px] object-contain sm:h-[360px]" : compact ? "h-[260px] object-contain" : "max-h-[560px] object-contain"}`} />
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 sm:px-5">
        <span>{post.likeCount} {post.likeCount === 1 ? "like" : "likes"}</span>
      </div>
      <div className="mx-4 border-t border-white/10 sm:mx-5" />
      <div className="p-2">
        <button type="button" onClick={onLike} disabled={liking}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-rose-500/10 ${post.liked ? "text-rose-500" : "text-gray-500 hover:text-rose-500"}`}>
          <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} /> {post.liked ? "Liked" : "Like"}
        </button>
      </div>
    </article>
  );
}

export default function CommunityPostsPanel({ userId, canCreate = false, limit = 50, compact = false, slider = false }: Props) {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const [posts, setPosts] = useState<ICommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICommunityPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCommunityPosts({ userId, limit });
      setPosts(response.data ?? []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => { void refresh(); }, [refresh]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!image) { toast.error("Choose an image for your post."); return; }
    if (image.size > 5 * 1024 * 1024) { toast.error("Image must be 5 MB or smaller."); return; }
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("image", image);
    setSubmitting(true);
    try {
      await createCommunityPost(formData);
      setTitle("");
      setDescription("");
      setImage(null);
      const input = document.getElementById("community-post-image") as HTMLInputElement | null;
      if (input) input.value = "";
      await refresh();
      toast.success("Post published.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Could not publish your post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (post: ICommunityPost) => {
    if (!accessToken) { router.push("/login"); return; }
    setLiking(post._id);
    try {
      const response = await toggleCommunityPostLike(post._id);
      setPosts((current) => current.map((item) => item._id === post._id
        ? { ...item, liked: response.data.liked, likeCount: response.data.likeCount }
        : item));
    } catch {
      toast.error("Could not update your like. Please try again.");
    } finally {
      setLiking(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCommunityPost(deleteTarget._id);
      setPosts((current) => current.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Post deleted.");
    } catch {
      toast.error("Could not delete this post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {canCreate && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#101014] dark:text-white space-y-3">
          <h3 className="font-semibold">Share a post</h3>
          <input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={150}
            placeholder="Post title" className="w-full rounded-lg border border-white/10 bg-black/5 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm" />
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} required maxLength={2000}
            placeholder="What would you like to share?" className="min-h-24 w-full rounded-lg border border-white/10 bg-black/5 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm" />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-cyan-500">
            <ImagePlus className="h-4 w-4" />
            {image ? image.name : "Add an image (max 5 MB)"}
            <input id="community-post-image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
              onChange={(event) => setImage(event.target.files?.[0] ?? null)} />
          </label>
          <button disabled={submitting || !title.trim() || !description.trim()} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}{submitting ? "Posting…" : "Publish post"}
          </button>
        </form>
      )}
      {loading ? (
        <div className="flex justify-center py-14 text-gray-500"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#101014]">
          {canCreate ? "You haven’t shared a post yet. Add one above." : "No posts yet."}
        </div>
      ) : slider ? (
        <Swiper effect="cards" grabCursor modules={[EffectCards, Pagination]} pagination={{ clickable: true }} className="mx-auto w-full max-w-2xl !overflow-visible pb-12">
          {posts.map((post) => (
            <SwiperSlide key={post._id}>
              <CommunityPostCard post={post} compact={compact} sliderCard={compact} canDelete={canCreate && user?._id === post.userId}
                liking={liking === post._id} onLike={() => void handleLike(post)} onDelete={() => setDeleteTarget(post)} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : compact ? (
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2">
          {posts.map((post) => <CommunityPostCard key={post._id} post={post} compact sliderCard={false} canDelete={canCreate && user?._id === post.userId}
            liking={liking === post._id} onLike={() => void handleLike(post)} onDelete={() => setDeleteTarget(post)} />)}
        </div>
      ) : posts.map((post) => (
        <CommunityPostCard key={post._id} post={post} compact={false} sliderCard={false} canDelete={canCreate && user?._id === post.userId}
          liking={liking === post._id} onLike={() => void handleLike(post)} onDelete={() => setDeleteTarget(post)} />
      ))}
      {deleteTarget && (
        <DeleteConfirmModal
          bookTitle={deleteTarget.title}
          itemType="Post"
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
