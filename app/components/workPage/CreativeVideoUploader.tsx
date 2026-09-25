"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Trash2, UploadCloud, Video as VideoIcon } from "lucide-react";

import {
  deleteCreativeVideo,
  getFileUrl,
  getMyCreativeVideos,
  uploadCreativeVideo,
  type ICreativeVideo,
} from "../../../api/api";

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
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
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/profile"
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-semibold">{heading}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">{heading}</h1>
        <p className="text-sm text-gray-500 mb-8">{description}</p>

        {videos.length > 0 && (
          <div className="text-xs text-amber-300/90 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3.5 py-2.5 mb-4">
            You can only have one video here — uploading a new one will replace your current video.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-8 flex flex-col gap-3"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
            maxLength={150}
            className="bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-600"
          />
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a short description (optional)"
            maxLength={1000}
            className="bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-600 min-h-[70px]"
          />

          <label className="flex items-center gap-3 bg-white/[0.04] border border-dashed border-white/15 rounded-lg px-3.5 py-3 text-sm cursor-pointer hover:border-cyan-400/40 transition">
            <UploadCloud className="w-4 h-4 text-cyan-300 flex-shrink-0" />
            <span className="flex-1 truncate text-gray-300">
              {file ? file.name : "Choose a video file — max 100 MB, up to 1 minute"}
            </span>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/x-msvideo"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <div className="text-xs text-gray-500 -mt-1">
              {formatBytes(file.size)} selected
            </div>
          )}
          {fileError && <div className="text-xs text-red-400">{fileError}</div>}
          {submitError && <div className="text-xs text-red-400">{submitError}</div>}

          {uploading && (
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="self-start inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading {progress}%
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                {videos.length > 0 ? "Replace video" : "Publish video"}
              </>
            )}
          </button>
        </form>

        <h2 className="text-sm font-semibold text-gray-400 mb-3">Your video</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading…
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center text-gray-500">
            <VideoIcon className="w-8 h-8 mx-auto mb-3 text-gray-600" />
            No videos uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((v) => (
              <div
                key={v._id}
                className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
              >
                <video
                  src={getFileUrl(v.videoUrl) ?? undefined}
                  controls
                  className="w-full aspect-video bg-black"
                />
                <div className="p-3 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{v.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {v.views} views · {formatBytes(v.videoSize)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(v._id)}
                    disabled={deletingId === v._id}
                    className="p-2 rounded-full bg-white/[0.04] hover:bg-red-500/20 hover:text-red-400 border border-white/10 transition flex-shrink-0"
                    aria-label="Delete video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
