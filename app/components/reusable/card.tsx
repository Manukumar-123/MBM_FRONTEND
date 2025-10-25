"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/effect-cards";

gsap.registerPlugin(ScrollTrigger);

const Creator: React.FC = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
        }
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
        }
      );
    }
  }, []);

  return (
    <section className="relative w-full  overflow-hidden min-h-screen text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
      {/* Left Content */}
      <div ref={leftRef} className="lg:px-40 px-4">
        <h2 className="text-sm md:text-sml font-bold leading-7 tracking-widest ">
          Whether you are a new or established <br /> music creator, we provide
          the tools <br /> to engage with fans, earn from your <br /> music, and
          grow a sustainable career.
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
        <Swiper
          effect="cards"
          grabCursor={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          modules={[EffectCards]}
          className="w-[240px] h-[420px] sm:w-[300px] md:w-[360px] md:h-[500px]"
        >
          <SwiperSlide>
            <div className="relative bg-gradient-to-b from-orange-400 to-red-500 rounded-3xl shadow-xl text-white p-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="bg-white/20 rounded-xl p-3">🎵 New track</div>
                <div className="flex items-center space-x-3 bg-black/50 p-2 rounded-xl">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">Baker Grace ✅</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <img
                    src="https://picsum.photos/200/300"
                    className="rounded-xl object-cover"
                  />
                  <div className="bg-purple-600 text-sm flex items-center justify-center rounded-xl">
                    Event
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Promote & Engage</h3>
                <p className="text-sm">
                  Showcase your music, content, and live events while building
                  your ideal fanbase.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative bg-gradient-to-b from-blue-500 to-indigo-600 rounded-3xl shadow-xl text-white p-6 h-full flex flex-col justify-between">
              <h3 className="text-2xl font-bold">Slide 2</h3>
              <p className="text-sm">
                Another example card showcasing different content.
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative bg-gradient-to-b from-green-500 to-emerald-600 rounded-3xl shadow-xl text-white p-6 h-full flex flex-col justify-between">
              <h3 className="text-2xl font-bold">Slide 3</h3>
              <p className="text-sm">Final example of stacked cards.</p>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* Custom Navigation Dots */}
        <div className="flex mt-6 space-x-3">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`w-8 h-2 rounded-full transition-all ${
                activeIndex === idx ? "bg-white" : "bg-white/30"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Creator;
