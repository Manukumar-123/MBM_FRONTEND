"use client";
import s from "./upload.module.css";

export default function FileUploadZone({
  id,
  icon = "📄",
  title,
  subtitle,
  specs = [],
  accept,
  preview = null,
  small = false,
  badge = null,
  onChange,
  style = {},
}) {
  const hasPreview = !!preview;

  return (
    <div className={badge ? s.uploadCard : undefined}>
      {badge && <div className={s.uploadBadge}>{badge}</div>}
      <div
        className={`${s.uploadZone} ${hasPreview ? s.uploadPreview : ""} ${small ? s.uploadZoneSmall : ""}`}
        style={{
          ...(hasPreview
            ? { backgroundImage: `url(${preview})` }
            : {}),
          ...style,
        }}
      >
        <input
          className={s.fileInput}
          type="file"
          accept={accept}
          onChange={(e) => onChange?.(e)}
          id={id}
        />
        <div
          className={`${s.uploadIconWrap} ${small ? s.uploadIconSmall : ""}`}
        >
          {icon}
        </div>
        <div className={s.uploadTitle}>{title}</div>
        <div className={s.uploadSubtitle}>{subtitle}</div>
        {specs.length > 0 && (
          <div className={s.uploadSpecs}>
            {specs.map((spec) => (
              <span key={spec} className={s.specTag}>
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
