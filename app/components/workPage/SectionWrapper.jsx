"use client";
import s from "./upload.module.css";

const ICON_CLASSES = {
  gold: s.iconGold,
  green: s.iconGreen,
  blue: s.iconBlue,
  red: s.iconRed,
  purple: s.iconPurple,
};

export default function SectionWrapper({
  number,
  icon,
  iconColor = "gold",
  title,
  description,
  delay = "0s",
  children,
}) {
  return (
    <div className={s.formSection} style={{ animationDelay: delay }}>
      <div className={s.sectionHeader}>
        <div className={`${s.sectionIcon} ${ICON_CLASSES[iconColor]}`}>
          {icon}
        </div>
        <div>
          <div className={s.sectionNum}>SECTION {number}</div>
          <div className={s.sectionTitle}>{title}</div>
          <div className={s.sectionDesc}>{description}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
