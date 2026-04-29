import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
  Search,
  FileWarning,
  BookOpen,
  Newspaper,
  Users,
  List,
} from "lucide-react";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const NAV_LINKS = [
  {
    id: "manifesto",
    label: "Manifesto",
    type: "scroll",
    target: "manifesto",
    icon: BookOpen,
  },
  {
    id: "articoli",
    label: "Articoli",
    type: "scroll",
    target: "articoli",
    icon: Newspaper,
  },
  {
    id: "chi-siamo",
    label: "Chi siamo",
    type: "scroll",
    target: "storia",
    icon: Users,
  },
  {
    id: "truffe",
    label: "Truffe",
    type: "route",
    target: "/scams",
    icon: List,
  },
];

// ─────────────────────────────────────────────
// HOOK — blocca body scroll quando il menu è aperto
// ─────────────────────────────────────────────

function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

// ─────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // scroll listener
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useLockBodyScroll(mobileOpen);

  // chiudi il menu al cambio di pathname.
  // Pattern "derived state during render": confronto diretto nel corpo
  // della funzione, nessun effect, nessun warning del linter.
  const prevPathnameRef = useRef(location.pathname);
  // eslint-disable-next-line react-hooks/refs
  if (prevPathnameRef.current !== location.pathname) {
    // eslint-disable-next-line react-hooks/refs
    prevPathnameRef.current = location.pathname;
    if (mobileOpen) {
      setMobileOpen(false);
      setClosing(false);
    }
  }

  // ── close: avvia animazione uscita, poi smonta
  function closeMenu() {
    setClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setClosing(false);
    }, 260);
  }

  // ── open
  function openMenu() {
    setClosing(false);
    setMobileOpen(true);
  }

  function scrollTo(id) {
    closeMenu();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  function handleNavClick(link) {
    if (link.type !== "scroll") return;
    isHome
      ? scrollTo(link.target)
      : (closeMenu(), navigate(`/#${link.target}`));
  }

  function handleSegnala() {
    isHome ? scrollTo("form") : (closeMenu(), navigate("/#form"));
  }

  const isActive = (target) => location.pathname === target;

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <>
      {/* ══════════════════════════════
          HEADER BAR
      ══════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div
          className="max-w-5xl mx-auto flex items-center justify-between"
          style={{ padding: "12px 16px" }}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={() => isHome && scrollTo("top")}
            className="flex items-center gap-2 no-underline group flex-shrink-0"
          >
            <div className="relative flex-shrink-0">
              <ShieldCheck
                className="text-teal-600"
                size={26}
                strokeWidth={2.5}
              />
              <div className="absolute inset-0 bg-teal-400/20 blur-md rounded-full pointer-events-none" />
            </div>
            <div className="leading-none">
              <div className="text-[16px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                ScamReact
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                Difesa collettiva
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) =>
              link.type === "route" ? (
                <Link
                  key={`route-${link.id}`}
                  to={link.target}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.target)
                      ? "text-teal-600 bg-teal-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={`scroll-${link.id}`}
                  onClick={() => handleNavClick(link)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </button>
              ),
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link
              to="/verifica"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                isActive("/verifica")
                  ? "border-teal-300 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50"
              }`}
            >
              <Search size={13} strokeWidth={2.5} />
              Verifica
            </Link>
            <button
              onClick={handleSegnala}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 active:scale-95 transition-all shadow-sm shadow-teal-100"
            >
              Segnala
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={mobileOpen ? closeMenu : openMenu}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0"
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={20} strokeWidth={2.5} />
            ) : (
              <Menu size={20} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </header>

      {/* ══════════════════════════
          MOBILE MENU
          Montato fuori da <header>
          per z-index e fixed puliti
      ══════════════════════════ */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/40"
            style={{
              animation: closing
                ? "srFadeOut 260ms ease forwards"
                : "srFadeIn 180ms ease forwards",
            }}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Bottom sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl"
            style={{
              animation: closing
                ? "srSlideDown 260ms cubic-bezier(0.4,0,1,1) forwards"
                : "srSlideUp 300ms cubic-bezier(0.34,1.56,0.64,1) forwards",
              paddingBottom: "max(24px, env(safe-area-inset-bottom))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            <div className="px-4 pt-2 space-y-1">
              {/* Nav links */}
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const keyPfx =
                  link.type === "route" ? "mob-route" : "mob-scroll";
                const active = link.type === "route" && isActive(link.target);

                return link.type === "route" ? (
                  <Link
                    key={`${keyPfx}-${link.id}`}
                    to={link.target}
                    className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-colors ${
                      active
                        ? "text-teal-700 bg-teal-50"
                        : "text-slate-700 active:bg-slate-100"
                    }`}
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className={active ? "text-teal-500" : "text-slate-400"}
                    />
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={`${keyPfx}-${link.id}`}
                    onClick={() => handleNavClick(link)}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-[15px] font-medium text-slate-700 active:bg-slate-100 transition-colors"
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className="text-slate-400"
                    />
                    {link.label}
                  </button>
                );
              })}

              {/* Divider */}
              <div
                className="h-px bg-slate-100 mx-1"
                style={{ margin: "10px 4px" }}
              />

              {/* CTA: Verifica */}
              <Link
                to="/verifica"
                className={`flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-[15px] font-medium border-2 transition-colors ${
                  isActive("/verifica")
                    ? "border-teal-400 bg-teal-50 text-teal-700"
                    : "border-slate-200 text-slate-700 active:bg-slate-50"
                }`}
              >
                <Search
                  size={18}
                  strokeWidth={2}
                  className="text-teal-500 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="leading-tight">Verifica un contatto</div>
                  <div className="text-xs font-normal text-slate-400 mt-0.5 truncate">
                    Numero, email o sito già segnalato?
                  </div>
                </div>
              </Link>

              {/* CTA: Segnala */}
              <button
                onClick={handleSegnala}
                className="flex items-center justify-between w-full px-4 py-4 rounded-2xl text-[15px] font-semibold bg-teal-600 text-white active:bg-teal-700 active:scale-[0.98] transition-all shadow-md shadow-teal-100"
              >
                <div className="flex items-center gap-3">
                  <FileWarning
                    size={18}
                    strokeWidth={2}
                    className="flex-shrink-0"
                  />
                  Segnala una truffa
                </div>
                <span className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Keyframes — prefisso "sr" per evitare collisioni globali */}
      <style>{`
        @keyframes srFadeIn    { from { opacity: 0 }                  to { opacity: 1 } }
        @keyframes srFadeOut   { from { opacity: 1 }                  to { opacity: 0 } }
        @keyframes srSlideUp   { from { transform: translateY(110%) } to { transform: translateY(0) } }
        @keyframes srSlideDown { from { transform: translateY(0) }    to { transform: translateY(110%) } }
      `}</style>
    </>
  );
}
