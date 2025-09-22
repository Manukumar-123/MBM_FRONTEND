"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ExclusivePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Inject custom styles for swiper pagination (pills)
    const style = document.createElement("style");
    style.innerHTML = `
      .swiper-pagination {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: center;
        gap: 8px;
      }
      .swiper-pagination-bullet {
        width: 40px;
        height: 6px;
        border-radius: 9999px;
        background: #444;
        opacity: 1;
        transition: all 0.3s ease;
      }
      .swiper-pagination-bullet-active {
        width: 50px;
        background: white;
      }
    `;
    document.head.appendChild(style);

    // GSAP animation: slide up + fade + blur
    if (containerRef.current) {
      const slides = containerRef.current.querySelectorAll(".swiper-slide");

      slides.forEach((slide) => {
        gsap.from(slide, {
          y: 50,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: slide,
            start: "top 90%",
          },
          onUpdate: function () {
            const progress = this.progress();
            (slide as HTMLElement).style.filter = `blur(${
              10 * (1 - progress)
            }px)`;
          },
        });
      });
    }

    return () => {
      document.head.removeChild(style);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black">
      <div ref={containerRef} className="w-[90%] max-w-4xl relative">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards, Pagination]}
          pagination={{ clickable: true }}
          className="pb-16"
        >
          {/* Card 1 */}
          <SwiperSlide>
            <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl p-8 text-black font-bold text-xl flex items-center justify-center h-[400px]">
              Curate Your Experience
            </div>
          </SwiperSlide>

          {/* Card 2 */}
          <SwiperSlide>
            <div className="bg-blue-500 rounded-2xl p-8 text-white font-bold text-xl flex flex-col items-center justify-center h-[400px]">
              <p>Unlock Exclusive Content</p>
              <button className="mt-6 bg-white text-blue-500 px-6 py-2 rounded-full font-medium shadow-md">
                Join the Beta
              </button>
            </div>
          </SwiperSlide>

          {/* Card 3 */}
          <SwiperSlide>
            <div className="bg-white rounded-2xl p-8 h-[400px] flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex-1 font-bold text-black text-2xl">
                Connect & Engage
              </div>
              <div className="flex-1">
                <img
                  src="/phone-mockup.png"
                  alt="App Preview"
                  className="rounded-2xl"
                />
                <p className="mt-4 text-gray-800 text-sm">
                  Interact with music creators and other fans through live
                  streams, direct messaging, and creator-led communities
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
