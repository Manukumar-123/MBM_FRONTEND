"use client";
import s from "./upload.module.css";

export default function ErrorList({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <ul className={s.errorList}>
      {errors.map((err, i) => (
        <li key={i} className={s.errorItem}>
          • {err}
        </li>
      ))}
    </ul>
  );
}
