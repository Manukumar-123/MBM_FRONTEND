"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FlipCard from "../reusable/JoinBeta";
import { getFileUrl, getLatestCreativeVideo, type ICreativeVideo } from "../../../api/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FlipC: React.FC = () => {
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);
  const [pitchVideo, setPitchVideo] = useState<ICreativeVideo | null>(null);
  const [universeVideo, setUniverseVideo] = useState<ICreativeVideo | null>(null);

  useEffect(() => {
    getLatestCreativeVideo("pitch_alley").then((res) => setPitchVideo(res.data)).catch(() => {});
    getLatestCreativeVideo("ask_universe").then((res) => setUniverseVideo(res.data)).catch(() => {});
  }, []);

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
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftCardRef.current,
              start: "top 80%",
            },
          });

          gsap.from(rightCardRef.current, {
            x: 200,
            autoAlpha: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rightCardRef.current,
              start: "top 80%",
            },
          });
        } else {
          // Mobile: fade cards up
          [leftCardRef.current, rightCardRef.current].forEach((el) => {
            gsap.from(el, {
              y: 50,
              autoAlpha: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
              },
            });
          });
        }
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div className="relative isolate flex md:flex-row flex-col justify-center items-center w-full gap-12 bg-white dark:bg-black py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_12%_18%,rgba(139,92,246,0.16),transparent_38%),radial-gradient(ellipse_at_88%_82%,rgba(6,182,212,0.14),transparent_42%)]"
      />
      <div ref={leftCardRef} className="relative z-10">
        <FlipCard
          videoUrl={getFileUrl(pitchVideo?.videoUrl) || "/ally.mkv"}
          Title={pitchVideo?.title || "MEBOOKMETA PITCH ALLEY PREVIEW"}
          Back={
            <div className="w-full h-full flex flex-col justify-center items-center text-white rounded-xl">
              {pitchVideo?.userId && <Link href={`/profile/${pitchVideo.userId}?tab=pitchAlley`} className="mt-4 px-4 py-2 cursor-pointer bg-white text-black rounded-full">View Profile</Link>}
            </div>
          }
        />
      </div>

      <div ref={rightCardRef} className="relative z-10">
        <FlipCard
          videoUrl={getFileUrl(universeVideo?.videoUrl) || "/charly.mkv"}
          Title={universeVideo?.title || "MEBOOKMETA ASK THE UNIVERSE PREVIEW"}
          Back={
            <div className="w-full h-full flex flex-col justify-center items-center text-white rounded-xl">
              {universeVideo?.userId && <Link href={`/profile/${universeVideo.userId}?tab=askUniverse`} className="mt-4 px-4 py-2 bg-white text-black rounded-full">View Profile</Link>}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default FlipC;
