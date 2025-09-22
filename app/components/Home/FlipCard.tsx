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

        // Desktop animation: left comes from left, right comes from right
        if (isDesktop) {
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
              leftCardRef.current!.style.filter = `blur(${
                10 * (1 - progress)
              }px)`;
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
              rightCardRef.current!.style.filter = `blur(${
                10 * (1 - progress)
              }px)`;
            },
          });
        } else {
          // Mobile: fade-up with blur for both cards
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
                el!.style.filter = `blur(${10 * (1 - progress)}px)`;
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
    <div className="flex md:flex-row flex-col justify-center items-center  gap-12 bg-black">
      <div ref={leftCardRef} className="w-full md:w-[30%]">
        <FlipCard
          front={
            <div className="bg-blue-500 w-full h-full flex flex-col justify-center items-center text-white rounded-xl">
              <h2 className="text-3xl font-bold">Front Side</h2>
              <button className="mt-4 px-4 py-2 bg-white text-black rounded-full">
                Join Beta
              </button>
            </div>
          }
          back={
            <div>
              <h2 className="text-2xl font-bold">Back Side</h2>
              <p className="mt-2">
                This is dummy content on top of an image with overlay.
              </p>
            </div>
          }
          backImage="https://img.freepik.com/premium-vector/rock-star-dog-skull-head-vector_1023984-25965.jpg"
        />
      </div>

      <div ref={rightCardRef} className="w-full md:w-[45%]">
        <FlipCard
          front={
            <div className="bg-blue-500 w-full h-full flex flex-col justify-center items-center text-white rounded-xl">
              <h2 className="text-3xl font-bold">Front Side</h2>
              <button className="mt-4 px-4 py-2 bg-white text-black rounded-full">
                Join Beta
              </button>
            </div>
          }
          back={
            <div>
              <h2 className="text-2xl font-bold">Back Side</h2>
              <p className="mt-2">
                This is dummy content on top of an image with overlay.
              </p>
            </div>
          }
          backImage="https://st2.depositphotos.com/2170303/5449/i/450/depositphotos_54498235-stock-photo-young-rockstar-playing-on-guitar.jpg"
        />
      </div>
    </div>
  );
};

export default FlipC;
