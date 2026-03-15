import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowRight, Menu, X } from "lucide-react";
import Button from "./UI/Button.jsx";

const NAV_LINKS = [
  { label: "Manifesto", type: "scroll", target: "manifesto", onlyHome: true },
  { label: "Truffe", type: "route", target: "/scams" },
  { label: "Articoli", type: "scroll", target: "articoli", onlyHome: true },
  { label: "Chi siamo", type: "scroll", target: "storia", onlyHome: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Chiudi il menu mobile ad ogni cambio pagina
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleNavClick = (link) => {
    if (link.type === "scroll") {
      if (isHome) {
        scrollTo(link.target);
      } else {
        // Torna alla home e poi scrolla (state passato a HomePage)
        window.location.href = `/#${link.target}`;
      }
    }
  };

  const isActiveRoute = (target) => location.pathname === target;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline group"
          onClick={() => isHome && scrollTo("top")}
        >
          <div className="relative">
            <ShieldCheck
              className="text-teal-600"
              size={30}
              strokeWidth={2.5}
            />
            <div className="absolute inset-0 bg-teal-400/20 blur-lg rounded-full" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 leading-none group-hover:text-teal-700 transition-colors">
              ScamReact
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide">
              Difesa collettiva
            </div>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            if (link.type === "route") {
              return (
                <Link
                  key={link.label}
                  to={link.target}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActiveRoute(link.target)
                      ? "text-teal-600 bg-teal-50"
                      : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* ── CTA Desktop ── */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            onClick={() =>
              isHome ? scrollTo("form") : (window.location.href = "/#form")
            }
            variant="primary"
            size="sm"
          >
            Segnala
            <ArrowRight size={16} />
          </Button>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden text-slate-700 p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link) => {
              if (link.type === "route") {
                return (
                  <Link
                    key={link.label}
                    to={link.target}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActiveRoute(link.target)
                        ? "text-teal-600 bg-teal-50"
                        : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-slate-50 text-left transition-colors"
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-2 mt-1 border-t border-slate-100">
              <Button
                onClick={() =>
                  isHome ? scrollTo("form") : (window.location.href = "/#form")
                }
                variant="primary"
                size="sm"
                className="w-full justify-center"
              >
                Segnala
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
