"use client";

import * as React from "react";
import HTMLFlipBookOriginal from "react-pageflip";

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

const Page = () => {
  const [bookSize, setBookSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateSize = () => {
      const w = Math.min(window.innerWidth * 0.5, 600); // max 600 width
      const h = Math.min(window.innerHeight * 0.8, 700); // max 700 height
      setBookSize({ width: w, height: h });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!bookSize.width || !bookSize.height) return null;

  return (
    <div className="flex justify-center pt-16 items-center min-h-screen bg-black overflow-hidden">
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
        {/* --- 📘 FRONT COVER --- */}
        <div className="flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center p-10">
          <h1 className="text-4xl font-bold mb-3">🌙 The Star Whisperer</h1>
          <p className="text-lg italic">A tale of dreams and destiny</p>
          <div className="mt-8 text-sm opacity-80">By Manu Kumar</div>
        </div>

        {/* --- Page 1 --- */}
        <div className="bg-white flex flex-col justify-between p-10">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              Chapter 1 — The Night Sky
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In a small village tucked beneath the hills, a young girl named
              Mira spent her nights gazing at the stars. While others slept, she
              whispered her secrets to the constellations.
            </p>
          </div>
          <p className="text-right text-sm italic text-gray-400">— Page 1</p>
        </div>

        {/* --- Page 2 --- */}
        <div className="bg-white flex flex-col justify-between p-10">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              Chapter 2 — The Falling Star
            </h2>
            <p className="text-gray-700 leading-relaxed">
              One midnight, the sky broke open with light. A single star fell,
              landing near the forest edge. Mira ran barefoot, chasing the glow,
              until she found a small crystal pulsating gently in the moss.
            </p>
          </div>
          <p className="text-right text-sm italic text-gray-400">— Page 2</p>
        </div>

        {/* --- Page 3 --- */}
        <div className="bg-white flex flex-col justify-between p-10">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              Chapter 3 — The Wish
            </h2>
            <p className="text-gray-700 leading-relaxed">
              When Mira touched the crystal, she heard a whisper — faint yet
              clear. “One wish, child of light.” She wished not for gold or
              beauty, but for courage to explore beyond her quiet village.
            </p>
          </div>
          <p className="text-right text-sm italic text-gray-400">— Page 3</p>
        </div>

        {/* --- Page 4 --- */}
        <div className="bg-white flex flex-col justify-between p-10">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              Chapter 4 — The Journey
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The next dawn, Mira set out carrying nothing but the crystal. The
              winds guided her, and every night, the stars shimmered brighter as
              if cheering her onward.
            </p>
          </div>
          <p className="text-right text-sm italic text-gray-400">— Page 4</p>
        </div>

        {/* --- 📘 BACK COVER --- */}
        <div className="flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white text-center p-10">
          <h2 className="text-3xl font-bold mb-3">✨ The End ✨</h2>
          <p className="text-lg italic opacity-90">
            Every dream begins with a whisper to the stars.
          </p>
          <p className="mt-6 text-sm opacity-70">— Thank you for reading</p>
        </div>
      </HTMLFlipBook>
    </div>
  );
};

export default Page;
