"use client";
import s from "./upload.module.css";

export default function HeroSection() {
  return (
    <>
      <div className={s.hero + " mt-20"}>
        <div className={s.heroBadge}>
          <span className={s.dot} />
          Creative Studio
        </div>
        <h1 className={s.heroTitle}>
          Share Your Published <em className={s.heroAccent}>Work Samples</em>
        </h1>
        <p className={s.heroSubtitle}>
          Connect with your audience deserves to be told. Fill in the details
          below and let the universe discover your work.
        </p>
      </div>
      <div className={s.divider} />
    </>
  );
}
