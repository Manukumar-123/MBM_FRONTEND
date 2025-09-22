"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "../reusable/card";

gsap.registerPlugin(ScrollTrigger);

const Creator: React.FC = () => {
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const HeadingRef = useRef<HTMLDivElement | null>(null);
  const HeadingSecondRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!videoWrapperRef.current) return;

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
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: videoWrapperRef.current,
              start: "top top",
              end: "+=1600",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              pinSpacing: true,
            },
          });

          // Shrink and rotate video
          tl.to(videoWrapperRef.current, {
            width: "320px",
            height: "640px",
            borderRadius: "3rem",
            rotate: 10,
            left: "50%",
            top: "50%",
            xPercent: -50,
            yPercent: -50,
            duration: 4,
            ease: "power2.inOut",
          });

          // Fade headings in with blur effect
          const animateHeading = (el: HTMLDivElement, offset: number) => {
            if (!el) return;
            tl.from(
              el,
              {
                autoAlpha: 0,
                y: 50,
                filter: "blur(10px)",
                duration: 1.2,
                ease: "power2.out",
                onUpdate: function () {
                  this.targets().forEach((target: HTMLDivElement) => {
                    const progress = this.progress();
                    target.style.filter = `blur(${10 * (1 - progress)}px)`;
                  });
                },
              },
              `-=${offset}`
            );
          };

          animateHeading(HeadingRef.current!, 3);
          animateHeading(HeadingSecondRef.current!, 2.5);

          // Slide video up at end
          tl.to(
            videoWrapperRef.current,
            {
              yPercent: -100,
              autoAlpha: 0,
              duration: 1.2,
              ease: "power2.inOut",
            },
            "+=0.5"
          );
        } else {
          // Mobile: simple scale + fade
          gsap.fromTo(
            videoWrapperRef.current,
            { scale: 1, borderRadius: "0rem" },
            {
              scale: 1.1,
              borderRadius: "1.5rem",
              autoAlpha: 0.8,
              scrollTrigger: {
                trigger: videoWrapperRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            }
          );

          // Headings fade-up + blur for mobile
          [HeadingRef.current, HeadingSecondRef.current].forEach((el) => {
            if (!el) return;
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 50, filter: "blur(10px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                },
              }
            );
          });
        }

        return () => ScrollTrigger.killAll();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Video pinned / animated */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-0 w-full h-screen flex items-center justify-center overflow-hidden"
      >
        <video
          src="/pub.webm"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-12 py-12 sm:py-16 space-y-6">
        <div ref={HeadingRef}>
          <h1 className="text-2xl sm:text-5xl md:text-7xl font-semibold tracking-wide text-white text-center mt-16">
            Empowering <br /> Music Creators <br /> to Thrive.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white text-center">
            Build, connect, and monetize all <br /> in one place — on your
            terms.
          </p>
        </div>

        {/* Cards */}
        <div className="w-full">
          <Card />
        </div>

        <div
          ref={HeadingSecondRef}
          className="max-w-3xl mx-auto text-center px-4 sm:px-6"
        >
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            An Enhanced <br />
            Fan Experience
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white">
            M_B_M puts you in control. Engage with your <br />
            favorite music creators, explore new talent, access exclusive
            content, and <br /> experience music on your terms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Creator;
