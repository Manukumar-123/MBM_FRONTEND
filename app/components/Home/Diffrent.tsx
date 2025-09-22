"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Diffrent = () => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (outerRef.current) {
      // Continuous rotation
      gsap.to(outerRef.current, {
        rotation: 360,
        transformOrigin: "50% 50%",
        repeat: -1,
        duration: 30,
        ease: "linear",
      });
    }

    if (containerRef.current) {
      // Pop-in animation on scroll
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
  }, []);

  const images = [
    "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    "https://flowbite.com/docs/images/people/profile-picture-4.jpg",
    "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
  ];

  const radius = 140; // distance from center

  return (
    <div className="bg-black py-20">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-10">
          What makes us <br /> different?
        </h1>
        <p className="text-white text-center text-sm md:text-base max-w-2xl mx-auto">
          Other social media apps treat music <br /> as just another piece of
          content, M_B_M treats <br /> it as an experience.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative md:h-[400px] md:w-[400px] h-80 w-80 mx-auto mt-20"
      >
        {/* Rotating outer ring */}
        <div
          ref={outerRef}
          className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-gray-400/50"
        >
          {images.map((src, index) => {
            const angle = (index / images.length) * 360;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={index}
                className="absolute w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-gray-400/50"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <Image
                  src={src}
                  alt={`Profile ${index + 1}`}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            );
          })}
        </div>

        {/* Central static circle */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center border-2 border-gray-300">
            <h1 className="text-2xl font-bold text-black">M_B_M</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diffrent;
