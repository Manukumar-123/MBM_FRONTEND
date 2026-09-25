"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Image from "next/image";
import { useRouter } from "next/navigation";

gsap.registerPlugin(MotionPathPlugin);

const allImages = [
  { src: "/hero.webp", label: "Authors and Writers" },
  { src: "/hero2.webp", label: "Performance Art Creatives" },
  { src: "/hero3.webp", label: "Music, Recording & Production" },
  { src: "/hero4.webp", label: "Television, Film & News Media" },
  { src: "/hero9.webp", label: "Print, Internet, Streaming & Publishing" },
  { src: "/hero10.webp", label: "Visual Art Creatives" },
];

export default function SemiCircularCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // ✅ GSAP animation — recomputed on every resize so the orbit radius/path
  // always matches the current viewport instead of only at mount time.
  useEffect(() => {
    if (!containerRef.current || !pathRef.current) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const setupOrbit = () => {
      if (!containerRef.current || !pathRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 640;
      setIsMobile(mobile);

      const items = gsap.utils.toArray<HTMLElement>(
        containerRef.current.querySelectorAll(".orbit-item"),
      );

      gsap.killTweensOf(items);
      gsap.set(items, { clearProps: "all" });

      const radius = Math.min(width, height) * 0.35;
      const startX = width * 0.1;
      const endX = width * 0.9;
      const centerY = height / 2 + radius * 0.5;

      const pathD = `M ${startX},${centerY} A ${radius} ${radius} 0 0 1 ${endX},${centerY}`;
      pathRef.current.setAttribute("d", pathD);

      if (!mobile) {
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
    };

    setupOrbit();

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setupOrbit, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full md:h-screen h-[80vh] overflow-hidden">
      <div
        ref={containerRef}
        className="absolute -top-20 md:top-80 w-full h-full flex items-center justify-center perspective-1000"
      >
        <svg className="absolute w-full h-full">
          <path
            ref={pathRef}
            fill="none"
            stroke="transparent"
            strokeWidth="0"
          />
        </svg>

        {allImages.map((img, i) => (
          <div
            key={i}
            className="orbit-item absolute flex flex-col items-center cursor-pointer group z-100"
            onClick={() => router.push("/searchAll")}
          >
            <div
              className="relative w-40 h-40 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44
                         rounded-2xl overflow-hidden shadow-xl backface-hidden"
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                style={{ objectFit: "cover" }}
                quality={100}
                priority
                unoptimized
              />
            </div>
            <p className="mt-2 text-center text-white text-sm md:text-sm font-medium bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm break-words whitespace-normal ">
              {img.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom gradient */}
      <div className="absolute z-1000 bottom-0 left-0 w-full h-40 bg-gradient-to-t dark:from-black/100 from-white to-transparent pointer-events-none" />
    </div>
  );
}
