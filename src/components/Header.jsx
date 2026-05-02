import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Search,
  Menu,
  X,
  FileWarning,
} from "lucide-react";

// ─────────────────────────────────────────────
// CONFIG — aggiungere/rimuovere voci qui
// ─────────────────────────────────────────────

const NAV_LINKS = [
  { id: "manifesto", label: "Manifesto", type: "scroll", target: "manifesto" },
  { id: "articoli", label: "Articoli", type: "scroll", target: "articoli" },
  { id: "chi-siamo", label: "Chi siamo", type: "scroll", target: "storia" },
  { id: "truffe", label: "Truffe", type: "route", target: "/scams" },
];

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // ── Chiudi menu al cambio pagina
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Shadow barra allo scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Blocca scroll body quando menu aperto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ── Scroll fluido verso una sezione della homepage
  function smoothScroll(id) {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  // ── Gestisce click su link di navigazione
  function handleLink(link) {
    if (link.type !== "scroll") return;
    isHome ? smoothScroll(link.target) : navigate(`/#${link.target}`);
  }

  // ── Porta al form di segnalazione
  function handleSegnala() {
    setMenuOpen(false);
    isHome ? smoothScroll("form") : navigate("/#form");
  }

  const isActive = (path) => location.pathname === path;

  return (
    // Il nav ha `mb-8` come nella navbar Vicus: spinge il contenuto sotto
    <nav className="w-full mb-8">
      <div
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-md border-b border-slate-100"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex-shrink-0">
              <ShieldCheck
                className="text-teal-600"
                size={26}
                strokeWidth={2.5}
              />
              {/* Alone luminoso dietro lo scudo */}
              <div className="absolute inset-0 bg-teal-400/20 blur-md rounded-full pointer-events-none" />
            </div>
            <div className="leading-none">
              <div className="text-[15px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                ScamReact
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                Difesa collettiva
              </div>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {NAV_LINKS.map((link) =>
              link.type === "route" ? (
                <Link
                  key={link.id}
                  to={link.target}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.target)
                      ? "text-teal-600 bg-teal-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.id}
                  onClick={() => handleLink(link)}
                  className="text-sm font-medium px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </button>
              ),
            )}

            {/* Separatore verticale — stesso pattern di Vicus */}
            <span className="h-5 w-px bg-slate-200 mx-1" />

            {/* Verifica — azione secondaria */}
            <Link
              to="/verifica"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                isActive("/verifica")
                  ? "border-teal-300 bg-teal-50 text-teal-700"
                  : "border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50"
              }`}
            >
              <Search size={13} strokeWidth={2.5} />
              Verifica
            </Link>

            {/* Segnala — azione primaria */}
            <button
              onClick={handleSegnala}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm hover:shadow"
            >
              Segnala
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* ── Hamburger mobile ── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden rounded-full p-2 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-teal-600" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6 text-slate-700" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* ── Menu mobile — scende dall'alto come Vicus ── */}
        {menuOpen && (
          <>
            {/* Overlay per chiudere cliccando fuori */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Pannello — stessa struttura di Vicus: `absolute top-full` */}
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-2xl z-50 lg:hidden">
              <div className="flex flex-col p-4 gap-1">
                {/* Link di navigazione */}
                {NAV_LINKS.map((link) =>
                  link.type === "route" ? (
                    <Link
                      key={link.id}
                      to={link.target}
                      className={`px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive(link.target)
                          ? "text-teal-600 bg-teal-50"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.id}
                      onClick={() => handleLink(link)}
                      className="text-left px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {link.label}
                    </button>
                  ),
                )}

                {/* Divisore — stesso pattern di Vicus */}
                <div className="border-t border-slate-100 my-1 pt-1" />

                {/* CTAs mobile */}
                <Link
                  to="/verifica"
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium border transition-colors ${
                    isActive("/verifica")
                      ? "border-teal-300 bg-teal-50 text-teal-700"
                      : "border-slate-200 text-slate-700 hover:border-teal-200 hover:bg-teal-50/50"
                  }`}
                >
                  <Search
                    size={16}
                    strokeWidth={2}
                    className="text-teal-500 flex-shrink-0"
                  />
                  <div>
                    <div className="font-medium leading-tight">
                      Verifica un contatto
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Numero, email o sito già segnalato?
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleSegnala}
                  className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileWarning size={16} strokeWidth={2} />
                    Segnala una truffa
                  </div>
                  <ArrowRight size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
