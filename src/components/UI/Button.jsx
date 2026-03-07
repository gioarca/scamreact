import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  };
  const variants = {
    primary:
      "bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md focus:ring-teal-500",
    outline:
      "border-2 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 bg-white focus:ring-teal-400",
    ghost:
      "text-slate-600 hover:text-teal-700 hover:bg-teal-50 focus:ring-teal-400",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
