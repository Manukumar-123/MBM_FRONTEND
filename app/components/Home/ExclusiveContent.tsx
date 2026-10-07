"use client";

import CommunityPostsPanel from "../CommunityPostsPanel";

export default function ExclusiveContent() {
  return (
    <section className="relative isolate w-full overflow-hidden px-5 py-20 text-black sm:px-8 dark:text-white">
      <video
        src="/pub.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 bg-white/80 dark:bg-black/75" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700 dark:text-violet-300">
            MeBookMeta community
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">A little inspiration for your next big idea</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-700 dark:text-gray-300 sm:text-base">
            Creators share their process, celebrate progress, and find the people who care about their work.
          </p>
        </div>
        <CommunityPostsPanel limit={8} compact slider />
      </div>
    </section>
  );
}
