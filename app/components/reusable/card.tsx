"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getBooks, getCreators, getFileUrl, IBook } from "../../../api/api";

import "swiper/css";
import "swiper/css/effect-cards";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_COVER = "/iphoneCover.jpg";


const Creator: React.FC = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [works, setWorks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const openCreatorProfile = async (work: IBook) => {
    if (work.userId) {
      router.push(`/profile/${work.userId}`);
      return;
    }

    // Older works may not have an owner ID; resolve the author to their creator profile.
    try {
      const response = await getCreators({ search: work.author, page: 1, limit: 10 });
      const author = response.data?.find(
        (creator) => creator.name?.trim().toLocaleLowerCase() === work.author?.trim().toLocaleLowerCase(),
      );
      if (author) router.push(`/profile/${author._id}`);
    } catch (error) {
      console.error("Failed to find creator profile", error);
    }
  };

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

  // Animate text when it comes into view (once, with cleanup)
  useEffect(() => {
    if (!leftRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, filter: "blur(10px)", y: 50, willChange: "transform, opacity, filter" },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          // Drop filter/will-change after finishing so scrolling doesn't repaint a blur layer
          clearProps: "filter,willChange",
          scrollTrigger: {
            trigger: leftRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  // Animate Swiper slides when they exist and come into view
  useEffect(() => {
    if (!swiperRef.current || works.length === 0) return;
    const ctx = gsap.context(() => {
      const slides = swiperRef.current!.querySelectorAll(".swiper-slide");
      gsap.fromTo(
        slides,
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
            once: true,
          },
        },
      );
    }, swiperRef);
    return () => ctx.revert();
  }, [works]);

  return (
    <section className="relative w-full overflow-hidden min-h-screen text-gray-900 dark:text-white flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0 px-5 sm:px-6 md:px-12 lg:px-20 py-16 max-md:min-h-0 max-md:px-0 max-md:py-10 max-md:text-center">
      {/* Left Content */}
      <div ref={leftRef} className="xl:px-40 lg:px-12 px-0 sm:px-4 dark:text-white text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 ">
          The Greatest Challenge for Creatives
        </h1>
        <h2 className="text-sm md:text-md font-bold leading-7 tracking-widest max-md:leading-6 max-md:tracking-wide">
          It’s not content creation. Creating is literally what we as Creatives
          do. No, our biggest <br /> 
          Meet that challenge for only $49.99/month on this site
        </h2>
        <button className="px-6 mt-4 py-3 bg-white text-black font-semibold rounded-full shadow-md hover:scale-105 transition">
          Join the Beta
        </button>
      </div>

      {/* Right Swiper Cards Effect */}
      <div
        ref={swiperRef}
        className="w-full lg:w-1/2 mt-10 lg:mt-0 flex flex-col items-center"
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
          className="w-[240px] h-[420px] sm:w-[300px] md:w-[360px] md:h-[500px] [transform:translateZ(0)]"
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
                  sizes="(min-width: 768px) 360px, (min-width: 640px) 300px, 240px"
                  decoding="async"
                  className="object-cover"
                  unoptimized
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FALLBACK_COVER;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                <div className="relative z-10 flex flex-col justify-between h-full p-6 max-md:p-5 max-md:text-left">
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
                      <h3 className="text-2xl font-bold max-md:line-clamp-3 max-md:break-words">{work.title}</h3>
                      <p className="text-sm text-white/80">by {work.author}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        // Don't let this bubble up to the card's image click handler
                        e.stopPropagation();
                        void openCreatorProfile(work);
                      }}
                      className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:scale-105 transition max-md:min-h-10"
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


