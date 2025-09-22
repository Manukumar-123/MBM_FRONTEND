"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const contentInsideRef = useRef<HTMLDivElement | null>(null);
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);
  const HeadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !mobileRef.current ||
      !contentInsideRef.current
    )
      return;

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

        const endDistance = isDesktop
          ? window.innerHeight * 1.1
          : window.innerHeight * 2.5;
        const cardsDrift = isDesktop ? -60 : -20;

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${endDistance}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            markers: false,
          },
        });

        // Animate text when it comes into view
        if (HeadingRef.current) {
          gsap.fromTo(
            HeadingRef.current,
            { opacity: 0, filter: "blur(10px)", y: 50 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: HeadingRef.current,
                start: "top 80%",
              },
            }
          );
        }

        // Step 1: inner content slides in
        tl.from(contentInsideRef.current, {
          yPercent: 90,
          autoAlpha: 0,
          duration: 3,
        });

        // Step 2: phone expands
        tl.to(
          mobileRef.current,
          {
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            duration: 3,
            ease: "power2.inOut",
          },
          "-=0.2"
        );

        // Step 3: expand inside content
        tl.to(
          contentInsideRef.current,
          {
            width: "100vw",
            height: "100%",
            top: 0,
            left: 0,
            x: 0,
            y: 0,
            borderRadius: 0,
            backgroundColor: "#ffffff",
            color: "#111111",
            padding: "2rem",
            duration: 1,
          },
          "-=0.6"
        );

        // Step 4: animate cards in
        tl.addLabel("cards");
        tl.from(
          [leftCardRef.current, rightCardRef.current],
          {
            yPercent: 20,
            autoAlpha: 0,
            rotate: -40,
            scale: 0.9,
            duration: 1,
            stagger: 0.2,
            ease: "back.out()",
          },
          "<"
        );

        // Drift effect while scrolling
        tl.to([leftCardRef.current, rightCardRef.current], {
          yPercent: cardsDrift,
          duration: 1.2,
          ease: "none",
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          tl.kill();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-black via-[#1a0f0f] to-[#2d1b00] overflow-hidden">
      {/* Dotted halftone overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none"></div>

      <div
        ref={containerRef}
        className="relative w-full flex flex-col items-center justify-center min-h-screen"
      >
        <h1
          ref={HeadingRef}
          className="mx-auto my-20 text-6xl font-bold text-white text-center relative z-10"
        >
          The Global Media <br /> Marketplace!
        </h1>

        {/* Mobile Shell */}
        <div
          ref={mobileRef}
          className="group relative w-[280px] sm:w-[340px] md:w-[300px] h-[600px] sm:h-[700px] md:h-[700px] 
          rounded-2xl shadow-2xl overflow-hidden z-30 flex items-center justify-center 
          bg-gray-900 will-change-transform mx-auto"
        >
          {/* Video playing inside iPhone */}
          <video
            src="/benefits-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10"
          />

          <Image
            src="/iphone.webp"
            alt="Mobile"
            fill
            className="object-cover opacity-40 pointer-events-none select-none"
          />

          {/* Inside Content */}
          <div
            ref={contentInsideRef}
            className="absolute inset-0 w-full h-full flex flex-col items-start justify-start 
            text-left px-6 py-8 bg-white text-black 
            overflow-y-auto md:overflow-y-hidden md:overflow-y-auto"
          >
            <div className="max-w-5xl w-full mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-6 md:mt-24">
                Experience Creativity <br /> Beyond the Screen
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-4">
                M_B_M goes beyond digital engagement — we bring creators and
                fans together in real life.
              </p>

              {/* Cards */}
              <div className="lg:mt-60 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full pb-16">
                {/* Left Card */}
                <div ref={leftCardRef}>
                  <div className="relative overflow-hidden w-full h-80 rounded-3xl cursor-pointer text-2xl font-bold bg-gradient-to-bl from-[#323232] to-[#ccc]">
                    <div className="z-10 absolute w-full h-full peer"></div>
                    <div
                      className="absolute -top-32 -left-16 w-32 h-44 rounded-full bg-white 
                      peer-hover:-top-20 peer-hover:-left-16 peer-hover:w-[140%] peer-hover:h-[140%] 
                      transition-all duration-500"
                    ></div>
                    <div
                      className="absolute flex text-xl text-center items-end justify-end 
                      -bottom-60 -right-40 w-36 h-44 rounded-full bg-gradient-to-br from-white to-black 
                      peer-hover:right-0 peer-hover:rounded-b-none peer-hover:bottom-0 peer-hover:items-center 
                      peer-hover:justify-center peer-hover:w-full peer-hover:h-full transition-all duration-500"
                    >
                      <div className="text-white">
                        <p className="mt-3">
                          Discover intimate sessions, <br /> secret gigs, and
                          real-world <br />
                          moments with artists.
                        </p>
                        <div className="flex items-center justify-center">
                          <ul className="mt-4 space-y-3 text-start">
                            <li className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-sm font-bold">
                                ✓
                              </span>
                              <span className="text-sm">Instant RSVPs</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-sm font-bold">
                                ✓
                              </span>
                              <span className="text-sm">
                                Location-based surprises
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-sm font-bold">
                                ✓
                              </span>
                              <span className="text-sm">Earned rewards</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-full flex items-center justify-center uppercase">
                      Creator Tools
                    </div>
                  </div>
                </div>

                {/* Right Card */}
                <div ref={rightCardRef}>
                  <div className="relative overflow-hidden w-full h-80 rounded-3xl cursor-pointer text-2xl font-bold bg-gradient-to-bl from-[#323232] to-[#ccc]">
                    <div className="z-10 absolute w-full h-full peer"></div>
                    <div
                      className="absolute -top-32 -left-16 w-32 h-44 rounded-full bg-white 
                      peer-hover:-top-20 peer-hover:-left-16 peer-hover:w-[140%] peer-hover:h-[140%] 
                      transition-all duration-500"
                    ></div>
                    <div
                      className="absolute flex text-xl text-center items-end justify-end 
                      -bottom-60 -right-40 w-36 h-44 rounded-full bg-gradient-to-br from-white to-black 
                      peer-hover:right-0 peer-hover:rounded-b-none peer-hover:bottom-0 peer-hover:items-center 
                      peer-hover:justify-center peer-hover:w-full peer-hover:h-full transition-all duration-500"
                    >
                      <div className="text-white">
                        <p className="mt-3">
                          Discover intimate sessions, <br /> secret gigs, and
                          real-world <br />
                          moments with artists.
                        </p>
                        <div className="flex items-center justify-center">
                          <ul className="mt-4 space-y-3 text-start">
                            <li className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-sm font-bold">
                                ✓
                              </span>
                              <span className="text-sm">Instant RSVPs</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-sm font-bold">
                                ✓
                              </span>
                              <span className="text-sm">
                                Location-based surprises
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-sm font-bold">
                                ✓
                              </span>
                              <span className="text-sm">Earned rewards</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-full flex items-center justify-center uppercase">
                      Creator Tools
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Inside content */}
        </div>
      </div>
    </section>
  );
};

export default ScrollAnimation;
