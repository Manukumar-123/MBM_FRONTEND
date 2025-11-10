"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Diffrent: React.FC = () => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false); // ✅ prevent hydration mismatch

  const images = [
    {
      src: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
      label: "Podcasts",
    },
    {
      src: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
      label: "Audio Books",
    },
    {
      src: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
      label: "Audio Music",
    },
    {
      src: "https://flowbite.com/docs/images/people/profile-picture-4.jpg",
      label: "Video Music",
    },
    {
      src: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
      label: "Live Shows",
    },
  ];

  const radius = 140;

  useEffect(() => {
    setMounted(true); // ✅ Render only after mount to avoid SSR mismatch
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (outerRef.current) {
      gsap.to(outerRef.current, {
        rotation: 360,
        transformOrigin: "50% 50%",
        repeat: -1,
        duration: 30,
        ease: "linear",
      });
    }

    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }
  }, [mounted]);

  if (!mounted) return null; // ✅ SSR-safe: render only on client

  return (
    <div className="bg-black py-20">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          What makes us <br /> different?
        </h1>
        <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
          Other social media apps treat music <br /> as just another piece of
          content, M_B_M treats <br /> it as an experience.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative md:h-[500px] md:w-[500px] h-70 w-70 mx-auto mt-20"
      >
        {/* Rotating outer ring */}
        <div
          ref={outerRef}
          className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-gray-400 z-0"
        >
          {images.map((item, index) => {
            const angle = (index / images.length) * 360;

            // ✅ Rounded values to fix SSR float mismatch
            const x = Math.round(radius * Math.cos((angle * Math.PI) / 180));
            const y = Math.round(radius * Math.sin((angle * Math.PI) / 180));

            return (
              <React.Fragment key={item.label}>
                <div
                  className="absolute"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  {/* Image circle */}
                  <div
                    className="md:w-[60px] md:h-[60px] w-16 h-16 md:p-12 p-4 rounded-full overflow-hidden border-2 border-white border-dashed border-gray-400/50 cursor-pointer relative z-10"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover rounded-full p-2 hover:scale-125 transition duration-300 -z-20"
                    />
                  </div>

                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <div
                      className="absolute top-1/2 left-full -translate-y-1/2 ml-3 w-80 h-40 rounded-lg overflow-hidden shadow-lg z-[100] cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <span className="text-white text-lg font-bold">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Central static circle */}
        <div className="absolute inset-0 flex items-center justify-center -z-20">
          <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center border-2 border-gray-300">
            <h1 className="text-2xl font-bold text-black">M_B_M</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diffrent;
