"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Eye,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  Video as VideoIcon,
} from "lucide-react";

import {
  deleteCreativeVideo,
  getFileUrl,
  getMyCreativeVideos,
  uploadCreativeVideo,
  type ICreativeVideo,
} from "../../../api/api";
import useAuthStore from "../../store/authStore";

const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB accepted, server compresses down to 25MB
const MAX_VIDEO_DURATION_SECONDS = 60; // 1 minute
const ALLOWED_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/x-msvideo",
];

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video metadata."));
    };
    video.src = url;
  });
}

interface Props {
  section: "pitch_alley" | "ask_universe";
  heading: string;
  description: string;
  titlePlaceholder: string;
}

function formatBytes(bytes = 0): string {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 100 ? 0 : 1)} MB`;
}

function formatDate(date?: string): string {
  if (!date || Number.isNaN(new Date(date).getTime())) return "Recently uploaded";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CreativeVideoUploader({
  section,
  heading,
  description,
  titlePlaceholder,
}: Props) {
  const [videos, setVideos] = useState<ICreativeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICreativeVideo | null>(null);
  const { user } = useAuthStore();

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

  const handleSelectedFile = async (selected: File | null) => {
    setFileError(null);

    if (!selected) {
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFileError("Unsupported format. Use MP4, MOV, WEBM, MKV or AVI.");
      setFile(null);
      return;
    }

    if (selected.size > MAX_VIDEO_BYTES) {
      setFileError(
        `File is ${formatBytes(selected.size)} — the limit is 100 MB.`,
      );
      setFile(null);
      return;
    }

    try {
      const duration = await getVideoDuration(selected);
      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        setFileError(
          `Video is ${Math.ceil(duration)}s long — only videos up to 1 minute are accepted.`,
        );
        setFile(null);
        return;
      }
    } catch {
      setFileError("Could not verify video length. Please try a different file.");
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!title.trim()) {
      setSubmitError("Give your video a title.");
      return;
    }
    if (!file) {
      setSubmitError("Choose a video file to upload (max 100 MB, up to 1 minute).");
      return;
    }

    const formData = new FormData();
    formData.append("section", section);
    formData.append("title", title.trim());
    if (caption.trim()) formData.append("description", caption.trim());
    formData.append("video", file);

    setUploading(true);
    setProgress(0);
    try {
      await uploadCreativeVideo(formData, setProgress);
      setTitle("");
      setCaption("");
      setFile(null);
      const fileInput = document.getElementById("creative-video-file") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      await fetchVideos();
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ??
          err?.response?.data?.errors?.[0] ??
          "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCreativeVideo(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete video");
    } finally {
      setDeletingId(null);
    }
  };

  const isPitch = section === "pitch_alley";
  const featuredVideo = videos[0];
  const profileHref = user?._id ? `/profile/${user._id}` : "/profile";

  return (
    <div className="creative-page min-h-screen bg-slate-50 text-slate-900 dark:bg-[#050507] dark:text-white">
      <div className="creative-wrap">
        <Link href={profileHref} className="creative-back"><ArrowLeft className="h-4 w-4" />Back to profile</Link>

        <header className="creative-heading">
          <div>
            <h1>{heading}</h1>
            <p>{description}</p>
          </div>
          <span className="creative-chip">{isPitch ? "One pitch video per author" : "Video questions"}</span>
        </header>

        <div className="creative-grid">
          <section className="creative-left">
            {isPitch ? (
              <>
                {loading ? (
                  <div className="creative-card creative-empty"><Loader2 className="h-7 w-7 animate-spin" />Loading your pitch…</div>
                ) : featuredVideo ? (
                  <article className="creative-card creative-featured">
                    <div className="creative-video-frame">
                      <video src={getFileUrl(featuredVideo.videoUrl) ?? undefined} controls playsInline />
                      <h2>{featuredVideo.title}</h2>
                      <span className="creative-live"><i />Live</span>
                    </div>
                    <div className="creative-video-meta">
                      <div><strong>Your pitch video</strong><small>{formatDate(featuredVideo.createdAt)} · {formatBytes(featuredVideo.videoSize)}</small></div>
                      <button type="button" onClick={() => setDeleteTarget(featuredVideo)} disabled={deletingId === featuredVideo._id} className="creative-icon-button" aria-label="Delete pitch"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="creative-stats">
                      <div><strong>{featuredVideo.views ?? 0}</strong><small>Views</small></div>
                      <div><strong>{formatBytes(featuredVideo.videoSize)}</strong><small>File size</small></div>
                      <div><strong>{formatDate(featuredVideo.createdAt)}</strong><small>Uploaded</small></div>
                    </div>
                  </article>
                ) : (
                  <div className="creative-card creative-empty">
                    <VideoIcon className="h-10 w-10" />
                    <strong>No pitch video yet</strong>
                    <p>Upload a short video and it will appear here and in Pitch Alley.</p>
                  </div>
                )}

                <section className="creative-card creative-tips">
                  <h2>Make your pitch land</h2>
                  <ol>
                    <li><strong>Hook in 5 seconds.</strong> Say what the book is and who it is for.</li>
                    <li><strong>Show, don’t summarise.</strong> Use the cover, a line from the book, or you reading.</li>
                    <li><strong>End with one ask.</strong> For example, “Read chapter one” or “Get in touch.”</li>
                  </ol>
                </section>
              </>
            ) : (
              <>
                {loading ? (
                  <div className="creative-card creative-empty"><Loader2 className="h-7 w-7 animate-spin" />Loading your video…</div>
                ) : videos.length > 0 ? (
                  <div className="creative-video-grid">
                    {videos.map((video) => (
                      <article className="creative-card creative-video-card" key={video._id}>
                        <div className="creative-video-frame compact">
                          <video src={getFileUrl(video.videoUrl) ?? undefined} controls playsInline />
                          <h2>{video.title}</h2>
                          <span className="creative-live"><i />Live</span>
                        </div>
                        <div className="creative-video-meta">
                          <div><strong>{video.title}</strong><small className="creative-view-line"><Eye className="h-3.5 w-3.5" />{video.views ?? 0} views · {formatDate(video.createdAt)}</small></div>
                          <button type="button" onClick={() => setDeleteTarget(video)} disabled={deletingId === video._id} className="creative-icon-button" aria-label="Delete video"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="creative-card creative-empty">
                    <Sparkles className="h-10 w-10" />
                    <strong>Nothing posted yet</strong>
                    <p>Ask the community a question about your work, your genre, or your next project.</p>
                    <div className="creative-prompts">
                      {["Feedback on the opening of my story", "How do I find a publisher?", "Which cover works better?"].map((prompt) => (
                        <button type="button" key={prompt} onClick={() => setTitle(prompt)}>{prompt}</button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="creative-right">
            <form onSubmit={handleSubmit} className="creative-card creative-form">
              <h2>{isPitch ? (featuredVideo ? "Replace your pitch" : "Upload your pitch") : "Post a video"}</h2>
              {videos.length > 0 && <div className="creative-note"><BadgeCheck className="h-4 w-4" />Uploading a new video replaces the current one.</div>}

              <label htmlFor="creative-title">{isPitch ? "Pitch title" : "Your question"}</label>
              <input id="creative-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={titlePlaceholder} maxLength={150} />
              <div className="creative-count">{title.length} / 150</div>

              <label htmlFor="creative-description">Description <small>(optional)</small></label>
              <textarea id="creative-description" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={isPitch ? "One or two lines about your book" : "Add context so people can answer well"} maxLength={1000} rows={3} />

              <label
                className="creative-drop"
                htmlFor="creative-video-file"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => { event.preventDefault(); void handleSelectedFile(event.dataTransfer.files[0] ?? null); }}
              >
                <span className="creative-drop-icon"><UploadCloud className="h-5 w-5" /></span>
                <strong>{file ? file.name : "Drag a video here, or browse"}</strong>
                <span className="creative-rules"><i>MP4 or MOV</i><i>Max 100 MB</i><i>Up to 1 minute</i></span>
                <small>We compress it to about 25 MB for you.</small>
                <input id="creative-video-file" type="file" accept={ALLOWED_TYPES.join(",")} onChange={handleFileChange} />
              </label>
              {file && <div className="creative-file-size">{formatBytes(file.size)} selected</div>}
              {fileError && <div className="creative-error" role="alert">{fileError}</div>}
              {submitError && <div className="creative-error" role="alert">{submitError}</div>}

              {uploading && <div className="creative-upload-progress"><span style={{ width: `${progress}%` }} /></div>}

              <button type="submit" disabled={uploading} className="creative-submit">
                {uploading ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading {progress}%</> : <><Plus className="h-4 w-4" />{isPitch ? (featuredVideo ? "Replace pitch" : "Publish pitch") : (featuredVideo ? "Replace video" : "Post video")}</>}
              </button>
            </form>
          </section>
        </div>
      </div>

      {deleteTarget && (
        <div className="creative-modal-backdrop" role="presentation" onClick={() => !deletingId && setDeleteTarget(null)}>
          <section className="creative-card creative-modal" role="dialog" aria-modal="true" aria-labelledby="delete-video-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="delete-video-title">Delete this video?</h2>
            <p>It will be removed from {heading} and can’t be restored.</p>
            <div><button type="button" onClick={() => setDeleteTarget(null)} disabled={!!deletingId} className="creative-secondary">Keep video</button><button type="button" onClick={() => void handleDelete(deleteTarget._id)} disabled={!!deletingId} className="creative-danger">{deletingId ? "Deleting…" : "Delete video"}</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
