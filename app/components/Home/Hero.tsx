"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Carousel from "./Carousel";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        {
          y: 80, // start lower
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2, // animate children one by one
          ease: "power3.out",
        },
      );
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Carousel as full background */}
      {/* <div className="absolute inset-0 w-full h-full">
        <Carousel />
      </div> */}

      {/* Hero content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-600 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-neutral-300 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          A home for creative minds
        </div>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-neutral-950 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Made for <span className="bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-clip-text italic text-transparent">creatives.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-300 sm:text-base md:text-lg md:leading-8">
          Share your work. Grow your following. Find your people. <span className="text-neutral-950 dark:text-white">Create, collaborate, and explore</span> across every form of creativity.
        </p>
        <button className="group mt-8 inline-flex items-center gap-3 rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-neutral-950/15 transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200">
          Join the Beta
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </section>
  );
}
