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
        }
      );
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Carousel as full background */}
      <div className="absolute inset-0 w-full h-full">
        <Carousel />
      </div>

      {/* Hero content */}
      <div
        ref={contentRef}
        className="relative lg:mt-40 mt-10 z-10 flex flex-col items-center justify-center h-full text-center text-white"
      >
        <h1 className="md:text-5xl text-lg font-bold lg:mt-10 mt-0">
          Built for Creators. Powered <br /> by Fans.
        </h1>
        <p className="md:mt-6 mt-2 md:text-lg text-xs text-gray-300 px-8">
          A Direct-to-Fan Music Platform for Discovery, <br /> Community, and
          Culture.
        </p>
        <button className="md:mt-10 mt-4 px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition">
          Join the Beta
        </button>
      </div>
    </section>
  );
}
