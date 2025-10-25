"use client";

import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation } from "swiper/modules";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Alice Johnson",
    text: "M_B_M changed the way I discover music! Absolutely love it.",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
  },
  {
    name: "Bob Smith",
    text: "The experience is so immersive. Highly recommend it to music lovers.",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
  },
  {
    name: "Charlie Lee",
    text: "Finally, a social media app that treats music as an experience.",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
  },
];

const Testimonial = () => {
  const swiperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (swiperRef.current) {
      gsap.fromTo(
        swiperRef.current.querySelectorAll(".swiper-slide"),
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 0.6,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: swiperRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <div className="bg-black py-16">
      <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-20">
        What Our Users Say
      </h1>

      <div ref={swiperRef} className=" md:w-100 w-10/12 mx-auto relative">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards, Navigation]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={true}
          className="mySwiper"
          style={{ paddingBottom: "40px" }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col p-8 h-68 rounded-2xl bg-white">
                <div className="flex">
                  <div className=" flex gap-4">
                    <Image
                      width={50}
                      height={50}
                      src={item.avatar}
                      alt={item.name}
                      className="rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-3 items-center -mt-1">
                        <p className="font-semibold cursor-pointer">
                          {item.name}
                        </p>
                        <p className="text-sm text-[#ff6154] cursor-pointer">
                          Follow
                        </p>
                      </div>
                      <div className="font-light text-md text-[#4b587c]">
                        {item.text}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-[#005ef6] text-xl tracking-[2px]">
                  ★★★★★
                </div>
                <div className="italic mt-2 text-[18px] text-[#4b587c] font-normal">
                  Cucumba
                </div>
                <div className="flex gap-6 text-[#4b587c] text-[12px] mt-4">
                  <span className="flex items-center gap-1 cursor-pointer">
                    <span className="text-[8px]">▲</span>Helpful
                  </span>
                  <span className="cursor-pointer hover:text-[#ff6154]">
                    Share
                  </span>
                  <span className="cursor-pointer">Feb 10</span>
                  <span className="-mt-3 text-xl tracking-[1px]">...</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonial;
