"use client";

import React, { useEffect, useRef } from "react";
import FlipCard from "../reusable/JoinBeta";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FlipC: React.FC = () => {
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!leftCardRef.current || !rightCardRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };

        if (isDesktop) {
          // Desktop: left from left, right from right
          gsap.from(leftCardRef.current, {
            x: -200,
            autoAlpha: 0,
            filter: "blur(10px)",
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftCardRef.current,
              start: "top 80%",
            },
            onUpdate: function () {
              const progress = this.progress();
              if (leftCardRef.current) {
                leftCardRef.current.style.filter = `blur(${
                  10 * (1 - progress)
                }px)`;
              }
            },
          });

          gsap.from(rightCardRef.current, {
            x: 200,
            autoAlpha: 0,
            filter: "blur(10px)",
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rightCardRef.current,
              start: "top 80%",
            },
            onUpdate: function () {
              const progress = this.progress();
              if (rightCardRef.current) {
                rightCardRef.current.style.filter = `blur(${
                  10 * (1 - progress)
                }px)`;
              }
            },
          });
        } else {
          // Mobile: fade-up with blur
          [leftCardRef.current, rightCardRef.current].forEach((el) => {
            gsap.from(el, {
              y: 50,
              autoAlpha: 0,
              filter: "blur(10px)",
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
              },
              onUpdate: function () {
                const progress = this.progress();
                if (el) {
                  el.style.filter = `blur(${10 * (1 - progress)}px)`;
                }
              },
            });
          });
        }
      }
    );

    return () => {
      mm.revert();
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div className="flex md:flex-row flex-col justify-center items-center w-full gap-12 bg-black">
      <div ref={leftCardRef}>
        <FlipCard
          videoUrl="/ally.mkv"
          Title="MEBOOKMETA PITCH ALLEY PREVIEW"
          Back={
            <div className="w-full h-full flex flex-col justify-center items-center text-white rounded-xl">
              <button
                onClick={() => alert("coming soon")}
                className="mt-4 px-4 py-2 cursor-pointer bg-white text-black rounded-full"
              >
                Visit Profile
              </button>
            </div>
          }
        />
      </div>

      <div ref={rightCardRef}>
        <FlipCard
          videoUrl="/charly.mkv"
          Title="MEBOOKMETA ASK THE UNIVERSE PREVIEW"
          Back={
            <div className="w-full h-full flex flex-col justify-center items-center text-white rounded-xl">
              <button
                onClick={() => alert("coming soon")}
                className="mt-4 px-4 py-2 bg-white text-black rounded-full"
              >
                Visit Profile
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default FlipC;
