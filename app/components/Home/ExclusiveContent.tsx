"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ExclusivePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const videoLink = [
    "https://mebook-work-v2.s3.us-east-2.amazonaws.com/1688492047308-Mebookmeta+video.mp4",
    "https://mebook-work-v2.s3.us-east-2.amazonaws.com/1726321479769-Welcome.mov",
    "https://mebook-work-v2.s3.us-east-2.amazonaws.com/1725393224250-A+Universe+Of+Creativity+%281%29.mov",
  ];

  const videoRefs = useRef<HTMLVideoElement[]>([]);

  // Play only the active slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

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
      <div ref={containerRef} className="w-[80%] max-w-4xl relative">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards, Pagination]}
          pagination={{ clickable: true }}
          className="pb-16"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {videoLink?.map((link, index) => (
            <SwiperSlide key={link}>
              <div className="rounded-2xl overflow-hidden h-[480px] relative">
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[index] = el;
                  }}
                  src={link}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
