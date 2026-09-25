"use client";

import { BadgeCheck, Heart, MessageCircle, MoreHorizontal, Repeat2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

const posts = [
  {
    initials: "AM",
    name: "Aarav Mehta",
    handle: "@aaravcreates",
    time: "2 hours ago",
    message: "A small reminder from today’s writing session: you don’t have to finish the whole story today. Just show up for the next sentence. ✨",
    label: "Studio notes · No. 08",
    quote: "Every finished page began as a blank one.",
    footer: "Keep making. Your audience is finding you.",
    appreciations: 128,
    replies: 18,
    colors: "from-[#27114b] via-[#17172c] to-[#073944]",
  },
  {
    initials: "SK",
    name: "Sana Kapoor",
    handle: "@sanawrites",
    time: "Yesterday",
    message: "Finally shared the first chapter with my readers. It felt scary for five minutes, then it felt like the beginning. 💜",
    label: "Writing journal · No. 03",
    quote: "Make room for the story only you can tell.",
    footer: "Draft by draft, the idea becomes real.",
    appreciations: 96,
    replies: 12,
    colors: "from-[#4b1640] via-[#24152d] to-[#432819]",
  },
  {
    initials: "RJ",
    name: "Rohan Joshi",
    handle: "@rohanmakes",
    time: "2 days ago",
    message: "A peek at my process: lots of rough sketches, a few happy accidents, and one idea that wouldn’t leave me alone. 🎨",
    label: "From the sketchbook · No. 11",
    quote: "Curiosity is a good place to start.",
    footer: "Keep following the ideas that surprise you.",
    appreciations: 74,
    replies: 9,
    colors: "from-[#17374b] via-[#17232d] to-[#362258]",
  },
];

export default function ExclusivePage() {
  return (
    <section className="w-full bg-white px-5 py-20 text-white dark:bg-black sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
            MeBookMeta community
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">A little inspiration for your next big idea</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Creators share their process, celebrate progress, and find the people who care about their work.
          </p>
        </div>

        <Swiper
          effect="cards"
          grabCursor
          modules={[EffectCards, Pagination]}
          pagination={{ clickable: true }}
          className="mx-auto w-full max-w-4xl !overflow-visible pb-12"
        >
          {posts.map((post) => <SwiperSlide key={post.handle}>
        <article className="h-[540px] overflow-hidden rounded-3xl border border-white/10 bg-[#101014] shadow-2xl shadow-violet-950/20 sm:h-[570px]">
          <div className="flex items-center gap-3 px-5 py-5 sm:px-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-bold">
              {post.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{post.name}</span>
                <BadgeCheck aria-label="Creator" className="h-4 w-4 fill-cyan-400 text-cyan-400" />
              </div>
              <p className="text-sm text-gray-500">{post.handle} · {post.time}</p>
            </div>
            <button aria-label="More post options" className="rounded-full p-2 text-gray-500 transition hover:bg-white/10 hover:text-white">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 pb-5 text-[15px] leading-7 text-gray-200 sm:px-7">
            {post.message}
          </div>

          <div className={`relative mx-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${post.colors} p-7 sm:mx-7 sm:p-9`}>
            <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-8 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{post.label}</p>
              <p className="mt-5 max-w-lg text-2xl font-semibold leading-tight sm:text-3xl">
                {post.quote}
              </p>
              <p className="mt-4 text-sm text-white/60">{post.footer}</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-5 text-sm text-gray-500 sm:px-7">
            <span>{post.appreciations} appreciations · {post.replies} replies</span>
            <span>Share this post</span>
          </div>
          <div className="mx-5 border-t border-white/10 sm:mx-7" />
          <div className="flex items-center justify-around px-3 py-3 text-gray-400">
            <button className="flex items-center gap-2 rounded-xl px-4 py-2 transition hover:bg-white/5 hover:text-rose-400"><Heart className="h-5 w-5" /> Appreciate</button>
            <button className="flex items-center gap-2 rounded-xl px-4 py-2 transition hover:bg-white/5 hover:text-cyan-300"><MessageCircle className="h-5 w-5" /> Reply</button>
            <button className="flex items-center gap-2 rounded-xl px-4 py-2 transition hover:bg-white/5 hover:text-violet-300"><Repeat2 className="h-5 w-5" /> Repost</button>
          </div>
        </article>
          </SwiperSlide>)}
        </Swiper>
      </div>
    </section>
  );
}
