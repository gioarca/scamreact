import React from "react";

export default function Badge({ children, variant = "teal" }) {
  const variants = {
    teal: "bg-teal-50 text-teal-700 border border-teal-200",
    slate: "bg-slate-100 text-slate-600 border border-slate-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
