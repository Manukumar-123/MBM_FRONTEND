"use client";

import { getBookById, toggleBookLike, getBookComments, addBookComment, type IComment } from "@/api/api";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, X } from "lucide-react";
import useAuthStore from "../../store/authStore";

const HTMLFlipBook = dynamic(
  () => import("react-pageflip").then((mod) => mod.default),
  {
    ssr: false,
  },
) as React.ComponentType<any>;

const Book = () => {
  const { id } = useParams();
  const { accessToken, user } = useAuthStore();

  const [book, setBook] = useState<any>(null);
  const [pdf, setPdf] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeBusy, setLikeBusy] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [bookSize, setBookSize] = useState({
    width: 0,
    height: 0,
  });

  /**
   * Cache rendered pages
   */
  const pageCache = useRef<Map<number, string>>(new Map());

  /**
   * Pages currently being rendered
   */
  const renderingPages = useRef<Set<number>>(new Set());

  /**
   * Fetch book + PDF
   */
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getBookById(id as string);

        const bookData = res?.data;

        if (!bookData) {
          throw new Error("Book not found");
        }

        setBook(bookData);
        setLikeCount(bookData.likedBy?.length ?? 0);
        setLiked(
          Boolean(user?._id && bookData.likedBy?.includes(user._id)),
        );

        if (bookData.manuscript) {
          const pdfUrl =
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${bookData.manuscript}`;

          await loadPdf(pdfUrl);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Book fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load book.",
        );

        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  /**
   * Like / unlike the book (requires login).
   */
  const handleToggleLike = async () => {
    if (!id || likeBusy) return;
    if (!accessToken) {
      setError("Please log in to like this book.");
      return;
    }

    setLikeBusy(true);
    try {
      const res = await toggleBookLike(id as string);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      console.error("Like failed:", err);
    } finally {
      setLikeBusy(false);
    }
  };

  /**
   * Open the comments panel, loading comments on first open.
   */
  const handleOpenComments = async () => {
    setShowComments(true);
    if (!id || comments.length > 0) return;

    setCommentsLoading(true);
    try {
      const res = await getBookComments(id as string);
      setComments(res.data ?? []);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentText.trim() || commentSubmitting) return;
    if (!accessToken) {
      setError("Please log in to comment.");
      return;
    }

    setCommentSubmitting(true);
    try {
      const res = await addBookComment(id as string, commentText.trim());
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  /**
   * Load PDF only.
   *
   * IMPORTANT:
   * We DO NOT render all pages here.
   */
  const loadPdf = async (url: string) => {
    try {
      setPdfLoading(true);

      console.log("Loading PDF:", url);

      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const loadingTask = pdfjsLib.getDocument({
        url,
        withCredentials: false,
      });

      const loadedPdf = await loadingTask.promise;

      console.log(
        "PDF loaded:",
        loadedPdf.numPages,
        "pages",
      );

      setPdf(loadedPdf);

      /**
       * PDF itself is ready.
       * Don't wait for 900 pages.
       */
      setLoading(false);

      /**
       * Render only first 2 pages.
       */
      await renderPage(1, loadedPdf);

      if (loadedPdf.numPages >= 2) {
        renderPage(2, loadedPdf);
      }
    } catch (err) {
      console.error("PDF Load Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load PDF",
      );

      setLoading(false);
    } finally {
      setPdfLoading(false);
    }
  };

  /**
   * Render ONE PDF page
   */
  const renderPage = async (
    pageNumber: number,
    pdfDocument?: any,
  ) => {
    const currentPdf = pdfDocument || pdf;

    if (!currentPdf) return;

    /**
     * Already cached
     */
    if (pageCache.current.has(pageNumber)) {
      return;
    }

    /**
     * Already rendering
     */
    if (renderingPages.current.has(pageNumber)) {
      return;
    }

    /**
     * Invalid page
     */
    if (
      pageNumber < 1 ||
      pageNumber > currentPdf.numPages
    ) {
      return;
    }

    renderingPages.current.add(pageNumber);

    try {
      console.log(
        `Rendering page ${pageNumber}/${currentPdf.numPages}`,
      );

      const page = await currentPdf.getPage(pageNumber);

      /**
       * Lower scale = faster rendering + less memory.
       *
       * 1.2 is enough for book preview.
       */
      const viewport = page.getViewport({
        scale: 1.2,
      });

      const canvas = document.createElement("canvas");

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({
        canvasContext: context,
        viewport,
        canvas,
      }).promise;

      /**
       * JPEG is much smaller than PNG.
       */
      const image = canvas.toDataURL(
        "image/jpeg",
        0.75,
      );

      pageCache.current.set(pageNumber, image);

      /**
       * Force component update.
       */
      setPageVersion((v) => v + 1);

      /**
       * Free canvas memory.
       */
      canvas.width = 1;
      canvas.height = 1;

      canvas.remove();

      /**
       * Cleanup PDF page.
       */
      page.cleanup();

      console.log(
        `Page ${pageNumber} ready`,
      );
    } catch (err) {
      console.error(
        `Failed to render page ${pageNumber}:`,
        err,
      );
    } finally {
      renderingPages.current.delete(pageNumber);
    }
  };

  /**
   * Used only to refresh UI after
   * a page has been rendered.
   */
  const [, setPageVersion] = useState(0);

  /**
   * Responsive size
   */
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;

      let w: number;
      let h: number;

      if (width < 640) {
        w = Math.min(width * 0.9, 400);
        h = Math.min(window.innerHeight * 0.7, 600);
      } else if (width < 1024) {
        w = Math.min(width * 0.7, 500);
        h = Math.min(window.innerHeight * 0.75, 650);
      } else {
        w = Math.min(width * 0.5, 600);
        h = Math.min(window.innerHeight * 0.8, 700);
      }

      setBookSize({
        width: Math.floor(w),
        height: Math.floor(h),
      });
    };

    updateSize();

    window.addEventListener(
      "resize",
      updateSize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateSize,
      );
    };
  }, []);

  /**
   * Initial loading
   */
  if (!bookSize.width || !bookSize.height) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        Loading reader...
      </div>
    );
  }

  /**
   * Book/PDF loading
   */
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black dark:border-neutral-700 dark:border-t-white rounded-full animate-spin" />

        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {pdfLoading
            ? "Loading PDF..."
            : "Loading Book..."}
        </p>
      </div>
    );
  }

  /**
   * Error
   */
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        <p className="text-red-500 mb-4">
          {error}
        </p>

        <button
          onClick={() =>
            window.location.reload()
          }
          className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!book || !pdf) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        Book not found.
      </div>
    );
  }

  /**
   * Create page components.
   *
   * We don't render images here until
   * the individual page has been generated.
   */
  const pageElements = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const image = pageCache.current.get(i);

    pageElements.push(
      <div
        key={`page-${i}`}
        className="bg-white flex justify-center items-center overflow-hidden"
      >
        {image ? (
          <img
            src={image}
            alt={`Book page ${i}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />

            <span className="mt-3 text-sm">
              Page {i}
            </span>
          </div>
        )}
      </div>,
    );
  }

  return (
    <div className="flex justify-center pt-16 items-center min-h-screen bg-gray-100 dark:bg-black overflow-hidden">

      {/* Like / comments floating bar */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showComments && (
          <div className="w-80 max-h-96 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                Comments
              </span>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                aria-label="Close comments"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {commentsLoading ? (
                <p className="text-sm text-gray-400">Loading…</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-400">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {c.userName || "Anonymous"}
                    </span>
                    <p className="text-gray-600 dark:text-gray-300">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleAddComment}
              className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-neutral-800"
            >
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                maxLength={1000}
                className="flex-1 text-sm bg-gray-100 dark:bg-neutral-800 rounded-full px-3 py-2 outline-none text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={commentSubmitting || !commentText.trim()}
                className="p-2 rounded-full bg-black text-white dark:bg-white dark:text-black disabled:opacity-40"
                aria-label="Send comment"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-full shadow-xl px-2 py-2">
          <button
            onClick={handleToggleLike}
            disabled={likeBusy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="Like this book"
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">{likeCount}</span>
          </button>

          <button
            onClick={handleOpenComments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="View comments"
          >
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-200">{comments.length}</span>
          </button>
        </div>
      </div>

      <HTMLFlipBook
        width={bookSize.width}
        height={bookSize.height}
        size="stretch"
        minWidth={280}
        maxWidth={600}
        minHeight={400}
        maxHeight={800}
        startPage={0}
        drawShadow={true}
        flippingTime={800}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={true}
        disableFlipByClick={false}
        className="shadow-2xl rounded-2xl"
        style={{
          margin: "0 auto",
          boxShadow:
            "0px 10px 40px rgba(0,0,0,0.3)",
        }}
        onFlip={(e: any) => {
          const currentPage =
            e.data;

          console.log(
            "Current page:",
            currentPage,
          );

          /**
           * Render current + next pages
           */
          renderPage(
            currentPage + 1,
          );

          renderPage(
            currentPage + 2,
          );

          /**
           * Also preload previous page
           */
          renderPage(
            currentPage,
          );

          /**
           * Preload a few pages ahead
           */
          renderPage(
            currentPage + 3,
          );

          renderPage(
            currentPage + 4,
          );
        }}
      >

        {/* FRONT COVER */}

        <div className="bg-white flex justify-center items-center overflow-hidden">
          {book?.frontCover ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${book.frontCover}`}
              alt={book?.title || "Front cover"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center p-10">

              <h1 className="text-4xl font-bold mb-3">
                {book?.title}
              </h1>

              {book?.subtitle && (
                <p className="text-lg italic">
                  {book.subtitle}
                </p>
              )}

              <div className="mt-8 text-sm opacity-80">
                By {book?.author}
              </div>

            </div>
          )}
        </div>

        {/* PDF PAGES */}

        {pageElements}

        {/* BACK COVER */}

        <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white text-center p-10">

          <h2 className="text-3xl font-bold mb-3">
            ✨ The End ✨
          </h2>

          <p className="text-lg italic opacity-90">
            Thank you for reading
          </p>

        </div>

      </HTMLFlipBook>
    </div>
  );
};

export default Book;