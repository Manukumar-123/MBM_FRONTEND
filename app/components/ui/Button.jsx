"use client";

// Shared button used across both the profile page and the creator dashboard.
// - shape="pill" (default) matches the public-facing profile/social pages
// - shape="rect" matches the dashboard's more compact, admin-style controls
// - icon renders a square/circular icon-only button (edit, delete, more, etc.)
const VARIANTS = {
  primary: "bg-gradient-to-r from-cyan to-blue text-[#06121A] shadow-[0_6px_16px_-6px_rgba(47,211,240,0.45)] hover:brightness-110",
  secondary: "bg-surface border border-borderline text-white hover:border-cyan hover:text-cyan",
  soft: "bg-cyan/10 border border-cyan/30 text-cyan hover:bg-cyan/20",
  danger: "bg-transparent border border-danger/35 text-danger hover:bg-danger/10",
  icon: "bg-surface-2 border border-borderline-soft text-gray-400 hover:text-white hover:border-cyan",
};

const SHAPES = { pill: "rounded-full", rect: "rounded-lg" };
const SIZES = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2.5" };
const ICON_SIZES = { sm: "w-[30px] h-[30px]", md: "w-9 h-9" };

export default function Button({
  variant = "primary",
  shape = "pill",
  size = "md",
  icon = false,
  danger = false,
  className = "",
  children,
  ...props
}) {
  const variantKey = icon ? "icon" : variant;
  const dimensionClasses = icon ? ICON_SIZES[size] : SIZES[size];
  const shapeClass = icon ? "rounded-lg" : SHAPES[shape];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-bold transition active:scale-95
        ${shapeClass} ${VARIANTS[variantKey]} ${dimensionClasses}
        ${icon && danger ? "hover:!text-danger hover:!border-danger/40" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
