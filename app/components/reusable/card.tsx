"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getBooks, getFileUrl, IBook } from "../../../api/api";

import "swiper/css";
import "swiper/css/effect-cards";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_COVER = "https://flowbite.com/docs/images/people/profile-picture-1.jpg";


const Creator: React.FC = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [works, setWorks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch the latest 4 works (any status) — one request, no filtering
  useEffect(() => {
    (async () => {
      try {
        const res = await getBooks({
          limit: "4",
          sortBy: "createdAt",
          order: "desc",
        });
        setWorks(res?.data ?? []);
      } catch {
        setWorks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // Animate text when it comes into view
    if (leftRef.current) {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, filter: "blur(10px)", y: 50 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: leftRef.current,
            start: "top 80%",
          },
        },
      );
    }

    // Animate Swiper container when it comes into view
    if (swiperRef.current) {
      gsap.fromTo(
        swiperRef.current.querySelectorAll(".swiper-slide"),
        { opacity: 0, y: -50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: swiperRef.current,
            start: "top 80%",
          },
        },
      );
    }
  }, [works]);

  return (
    <section className="relative w-full overflow-hidden min-h-screen text-gray-900 dark:text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
      {/* Left Content */}
      <div ref={leftRef} className="lg:px-40 px-4 dark:text-white text-white">
        <h1 className="text-4xl font-bold mb-2 ">
          The Greatest Challenge for Creatives
        </h1>
        <h2 className="text-sm md:text-md font-bold leading-7 tracking-widest ">
          It’s not content creation. Creating is literally what we as Creatives
          do. No, our biggest <br /> challenge is in Sharing Work and the Time
          and Cost of Sharing Work – specifically, <br /> sharing work with
          ideal audiences, creating a following (a unique brand) and becoming
          successful or profitable.
          <br /> <br />
          Meet that challenge for only $49.99/month on this site
        </h2>
        <button className="px-6 mt-4 py-3 bg-white text-black font-semibold rounded-full shadow-md hover:scale-105 transition">
          Join the Beta
        </button>
      </div>

      {/* Right Swiper Cards Effect */}
      <div
        ref={swiperRef}
        className="md:w-1/2 mt-10 md:mt-0 flex flex-col items-center"
      >
        {loading ? (
          <div className="w-[240px] h-[420px] sm:w-[300px] md:w-[360px] md:h-[500px] rounded-3xl bg-white/10 animate-pulse" />
        ) : works.length === 0 ? (
          <div className="w-[240px] h-[420px] sm:w-[300px] md:w-[360px] md:h-[500px] rounded-3xl bg-white/10 flex items-center justify-center text-white/60 text-sm text-center px-6">
            No work to show yet
          </div>
        ) : (
        <Swiper
          effect="cards"
          grabCursor={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          modules={[EffectCards]}
          className="w-[240px] h-[420px] sm:w-[300px] md:w-[360px] md:h-[500px]"
        >
          {works.map((work) => (
            <SwiperSlide key={work._id}>
              <div
                onClick={() => router.push(`/books/${work._id}`)}
                className="relative rounded-3xl shadow-xl text-white h-full overflow-hidden cursor-pointer"
              >
                <Image
                  src={getFileUrl(work.frontCover) ?? FALLBACK_COVER}
                  alt={work.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                <div className="relative z-10 flex flex-col justify-between h-full p-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-white/20 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full">
                      {work.category}
                    </span>
                    {work.status === "pending_review" && (
                      <span className="bg-yellow-400/90 text-black text-xs font-semibold px-3 py-1 rounded-full">
                        Pending Review
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold">{work.title}</h3>
                      <p className="text-sm text-white/80">by {work.author}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        // Don't let this bubble up to the card's image click handler
                        e.stopPropagation();
                        router.push(
                          work.userId ? `/profile/${work.userId}` : `/books/${work._id}`,
                        );
                      }}
                      className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:scale-105 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        )}

        {/* Custom Navigation Dots */}
        {works.length > 0 && (
          <div className="flex mt-6 space-x-3">
            {works.map((work, idx) => (
              <div
                key={work._id}
                className={`w-8 h-2 rounded-full transition-all ${
                  activeIndex === idx ? "bg-white" : "bg-white/30"
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Creator;


