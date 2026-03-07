import React, { useState, useEffect } from "react";
import { ShieldCheck, ArrowRight, Menu, X } from "lucide-react";
import Button from "./UI/Button.jsx";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => scrollToSection("top")}
        >
          <div className="relative">
            <ShieldCheck
              className="text-teal-600"
              size={30}
              strokeWidth={2.5}
            />
            <div className="absolute inset-0 bg-teal-400/20 blur-lg rounded-full" />
          </div>

          <a href="/">
            <div>
              <div className="text-lg font-bold text-slate-900 leading-none">
                ScamReact
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide">
                Difesa collettiva
              </div>
            </div>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {/* <button
            onClick={() => scrollToSection("verifica")}
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            Le truffe
          </button> */}

          <button
            onClick={() => scrollToSection("articoli")}
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            Articoli
          </button>

          <button
            onClick={() => scrollToSection("storia")}
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            Chi siamo
          </button>
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            onClick={() => scrollToSection("form")}
            variant="primary"
            size="sm"
          >
            Segnala
            <ArrowRight size={16} />
          </Button>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium">
            <button
              onClick={() => scrollToSection("verifica")}
              className="text-slate-600 hover:text-teal-600 text-left"
            >
              Le truffe
            </button>

            <button
              onClick={() => scrollToSection("articoli")}
              className="text-slate-600 hover:text-teal-600 text-left"
            >
              Articoli
            </button>

            <button
              onClick={() => scrollToSection("storia")}
              className="text-slate-600 hover:text-teal-600 text-left"
            >
              Chi siamo
            </button>

            <Button
              onClick={() => scrollToSection("form")}
              variant="primary"
              size="sm"
            >
              Segnala
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
