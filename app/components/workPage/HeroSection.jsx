"use client";
import s from "./upload.module.css";

export default function HeroSection() {
  return (
    <>
      <div className={s.hero}>
        <div className={s.heroBadge}>
          <span className={s.dot} />
          Creator Studio
        </div>
        <h1 className={s.heroTitle}>
          Publish Your <em className={s.heroAccent}>Masterpiece</em>
        </h1>
        <p className={s.heroSubtitle}>
          Every great story deserves to be told. Fill in the details below and
          let the world discover your work.
        </p>
      </div>
      <div className={s.divider} />
    </>
  );
}
