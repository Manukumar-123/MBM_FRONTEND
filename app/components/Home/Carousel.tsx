"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Image from "next/image";

gsap.registerPlugin(MotionPathPlugin);

const allImages = [
  "/hero.webp",
  "/hero2.webp",
  "/hero3.webp",
  "/hero4.webp",
  "/hero9.webp",
  "/hero10.webp",
];

export default function SemiCircularCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Watch screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ✅ Animate carousel
  useEffect(() => {
    if (!containerRef.current || !pathRef.current) return;

    const items = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll(".orbit-item")
    );

    // Kill everything before re-initializing
    gsap.killTweensOf(items);
    gsap.set(items, { clearProps: "all" });

    const width = window.innerWidth;
    const height = window.innerHeight;
    const radius = Math.min(width, height) * 0.35;

    const startX = width * 0.1;
    const endX = width * 0.9;
    const centerY = height / 2 + radius * 0.5;

    const pathD = `M ${startX},${centerY} A ${radius} ${radius} 0 0 1 ${endX},${centerY}`;
    pathRef.current?.setAttribute("d", pathD);

    if (!isMobile) {
      // 🖥 Desktop orbit
      const count = items.length;
      const gap = 1 / count;
      items.forEach((item, i) => {
        gsap.to(item, {
          motionPath: {
            path: pathRef.current!,
            align: pathRef.current!,
            alignOrigin: [0.5, 0.5],
            start: i * gap,
            end: 1 + i * gap,
            autoRotate: true,
          },
          duration: 30,
          repeat: -1,
          ease: "linear",
        });
      });
    } else {
      // 📱 Mobile slideshow
      items.forEach((item) => {
        gsap.set(item, { opacity: 0, xPercent: 100, rotateY: -90 });
      });

      const tl = gsap.timeline({ repeat: -1 });

      items.forEach((item) => {
        tl.to(item, {
          opacity: 1,
          xPercent: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "power2.out",
        })
          .to(item, { opacity: 1, duration: 1.5 })
          .to(item, {
            opacity: 0,
            xPercent: -100,
            rotateY: 90,
            duration: 0.8,
            ease: "power2.in",
          });
      });
    }
  }, [isMobile]); // ✅ Re-run whenever screen type changes

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="absolute -top-40 md:top-80 w-full h-full flex items-center justify-center perspective-1000"
      >
        {/* Orbit path (desktop only) */}
        <svg className="absolute w-full h-full">
          <path
            ref={pathRef}
            fill="none"
            stroke="transparent"
            strokeWidth="0"
          />
        </svg>

        {allImages.map((src, i) => (
          <div
            key={i}
            className="orbit-item absolute w-40 h-40 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 
                       rounded-2xl overflow-hidden shadow-xl backface-hidden"
          >
            <Image
              src={src}
              alt={`carousel-${i}`}
              priority
              fill
              style={{ objectFit: "cover" }}
              quality={100}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
    </div>
  );
}
