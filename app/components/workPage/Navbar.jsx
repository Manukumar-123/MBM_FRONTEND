"use client";
import s from "./upload.module.css";

export default function Navbar() {
  return (
    <nav className={s.nav}>
      <a href="/" className={s.navLogo}>
        <div className={s.logoMark}>M</div>
        <div className={s.logoText}>
          me<span className={s.logoAccent}>book</span>meta
        </div>
      </a>
      <div className={s.navRight}>
        <a href="/dashboard" className={s.navLink}>Dashboard</a>
        <a href="/works" className={s.navLink}>My Works</a>
        <a href="/analytics" className={s.navLink}>Analytics</a>
        <div className={s.navAvatar}>JD</div>
      </div>
    </nav>
  );
}
