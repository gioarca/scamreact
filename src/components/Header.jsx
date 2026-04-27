import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Menu, X, Search } from "lucide-react";
import Button from "./UI/Button.jsx";

const NAV_LINKS = [
  { label: "Manifesto", type: "scroll", target: "manifesto", onlyHome: true },
  { label: "Articoli", type: "scroll", target: "articoli", onlyHome: true },
  { label: "Chi siamo", type: "scroll", target: "storia", onlyHome: true },
  { label: "Truffe", type: "route", target: "/scams" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // chiudi menu su cambio route
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleNavClick = (link) => {
    if (link.type !== "scroll") return;
    setMobileOpen(false);
    isHome ? scrollTo(link.target) : navigate(`/#${link.target}`);
  };

  const handleSegnala = () => {
    setMobileOpen(false);
    isHome ? scrollTo("form") : navigate("/#form");
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6">
        {/* ── Logo ── */}
        <Link
          to="/"
          onClick={() => isHome && scrollTo("top")}
          className="flex items-center gap-2.5 no-underline group flex-shrink-0"
        >
          <div className="relative">
            <ShieldCheck
              className="text-teal-600"
              size={28}
              strokeWidth={2.5}
            />
            <div className="absolute inset-0 bg-teal-400/20 blur-lg rounded-full" />
          </div>
          <div>
            <div className="text-[17px] font-bold text-slate-900 leading-none group-hover:text-teal-700 transition-colors">
              ScamReact
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
              Difesa collettiva
            </div>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_LINKS.map((link) =>
            link.type === "route" ? (
              <Link
                key={link.label}
                to={link.target}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveRoute(link.target)
                    ? "text-teal-600 bg-teal-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </button>
            ),
          )}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {/* Verifica — ghost con icona search, punta a /verifica */}
          <Link
            to="/verifica"
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isActiveRoute("/verifica")
                ? "border-teal-300 bg-teal-50 text-teal-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50"
            }`}
          >
            <Search size={14} strokeWidth={2.5} />
            Verifica
          </Link>

          {/* Segnala — primary CTA */}
          <button
            onClick={handleSegnala}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 active:scale-95 transition-all shadow-sm shadow-teal-200"
          >
            Segnala
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="md:hidden text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Menu panel — bottom sheet ── */}
      <div
        className={`md:hidden fixed left-0 right-0 z-50 transition-all duration-300 ease-out ${
          mobileOpen
            ? "bottom-0 opacity-100 pointer-events-auto"
            : "-bottom-full opacity-0 pointer-events-none"
        }`}
        style={{ top: "auto" }}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 overflow-hidden">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-1 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors"
              aria-label="Chiudi menu"
            />
          </div>

          <div className="px-5 pt-1 pb-8 space-y-1.5">
            {/* Nav links — grandi e touch-friendly */}
            {NAV_LINKS.map((link) =>
              link.type === "route" ? (
                <Link
                  key={link.label}
                  to={link.target}
                  className={`flex items-center w-full px-4 py-4 rounded-2xl text-base font-medium transition-colors ${
                    isActiveRoute(link.target)
                      ? "text-teal-700 bg-teal-50"
                      : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="w-full text-left flex items-center px-4 py-4 rounded-2xl text-base font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  {link.label}
                </button>
              ),
            )}

            {/* Divider */}
            <div className="h-px bg-slate-100 !my-3" />

            {/* CTA: Verifica */}
            <Link
              to="/verifica"
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-base font-medium border-2 transition-colors ${
                isActiveRoute("/verifica")
                  ? "border-teal-400 bg-teal-50 text-teal-700"
                  : "border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 active:bg-teal-100"
              }`}
            >
              <Search
                size={18}
                strokeWidth={2}
                className="text-teal-500 flex-shrink-0"
              />
              <div>
                <span className="block leading-tight">
                  Verifica un contatto
                </span>
                <span className="block text-xs font-normal text-slate-400 mt-0.5">
                  Controlla se un numero o sito è già segnalato
                </span>
              </div>
            </Link>

            {/* CTA: Segnala — primario */}
            <button
              onClick={handleSegnala}
              className="flex items-center justify-between w-full px-4 py-4 rounded-2xl text-base font-semibold bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] transition-all shadow-md shadow-teal-200"
            >
              <span>Segnala una truffa</span>
              <span className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
