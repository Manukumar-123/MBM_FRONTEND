"use client";

import { getBookById } from "@/api/api";
import { useParams } from "next/navigation";
import * as React from "react";
import HTMLFlipBookOriginal from "react-pageflip";
import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
type HTMLFlipBookProps = {
  width?: number;
  height?: number;
  showCover?: boolean;
  mobileScrollSupport?: boolean;
  flippingTime?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const HTMLFlipBook =
  HTMLFlipBookOriginal as unknown as React.ComponentType<HTMLFlipBookProps>;

const Book = () => {
  const { id } = useParams();

  const [book, setBook] = useState<any>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookSize, setBookSize] = useState({
    width: 0,
    height: 0,
  });

  // 📚 Fetch Book
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await getBookById(id as string);
        const bookData = res.data;

        console.log("Book Data:", bookData);

        setBook(bookData);

        if (bookData?.manuscript) {
          const pdfUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL + bookData.manuscript;

          console.log("PDF URL:", pdfUrl);

          await loadPdfPages(pdfUrl);
        }
      } catch (error) {
        console.error("Book fetch error:", error);
      }
    };

    fetchBook();
  }, [id]);

  // 📄 Convert PDF → Images
  const loadPdfPages = async (url: string) => {
    try {
      const loadingTask = pdfjsLib.getDocument(url);

      const pdf = await loadingTask.promise;

      console.log("Total pages:", pdf.numPages);

      const pageImages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        console.log("Rendering page:", i);

        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
          canvas: canvas, // Add the canvas property
        }).promise;

        const image = canvas.toDataURL("image/png");

        pageImages.push(image);
      }

      console.log("Generated pages:", pageImages.length);

      setPages(pageImages);
      setLoading(false);
    } catch (error) {
      console.error("PDF Load Error:", error);
    }
  };

  // 📐 Responsive Book Size
  useEffect(() => {
    const updateSize = () => {
      const w = Math.min(window.innerWidth * 0.5, 600);
      const h = Math.min(window.innerHeight * 0.8, 700);

      setBookSize({
        width: w,
        height: h,
      });
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!bookSize.width || !bookSize.height) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        Loading Book...
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-16 items-center min-h-screen bg-gray-100 dark:bg-black overflow-hidden">
      <HTMLFlipBook
        width={bookSize.width}
        height={bookSize.height}
        showCover
        mobileScrollSupport
        flippingTime={800}
        className="shadow-2xl rounded-2xl"
        style={{
          margin: "0 auto",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* 📘 FRONT COVER */}
        <div className="bg-white flex justify-center items-center">
          {book?.frontCover ? (
            <img
              src={process.env.NEXT_PUBLIC_API_BASE_URL + book.frontCover}
              alt="front-cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center p-10">
              <h1 className="text-4xl font-bold mb-3">{book?.title}</h1>
              <p className="text-lg italic">{book?.subtitle}</p>
              <div className="mt-8 text-sm opacity-80">By {book?.author}</div>
            </div>
          )}
        </div>

        {/* 📄 BOOK PAGES */}
        {pages.map((page, index) => (
          <div
            key={index}
            className="bg-white flex justify-center items-center"
          >
            <img
              src={page}
              alt={`page-${index}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}

        {/* 📘 BACK COVER */}
        <div className="flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white text-center p-10">
          <h2 className="text-3xl font-bold mb-3">✨ The End ✨</h2>
          <p className="text-lg italic opacity-90">Thank you for reading</p>
        </div>
      </HTMLFlipBook>
    </div>
  );
};

export default Book;
