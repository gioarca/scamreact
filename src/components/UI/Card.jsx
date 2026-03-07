import React from "react";

export default function Card({ children, className = "", hoverable = false }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 ${hoverable ? "hover:shadow-lg hover:border-teal-200 transition-all duration-200 cursor-pointer" : "shadow-sm"} ${className}`}
    >
      {children}
    </div>
  );
}
