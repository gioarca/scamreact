import React from "react";
import { Shield, ExternalLink, Github } from "lucide-react";

function Footer() {
  const socials = [
    {
      href: "https://www.facebook.com/profile.php?id=61586819457695",
      alt: "Facebook",
      label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      href: "https://www.instagram.com/scamreact/",
      alt: "Instagram",
      label: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      ),
    },
  ];

  const navGroups = [
    {
      title: "Piattaforma",
      links: [
        { label: "Le truffe", href: "#verifica" },
        { label: "Articoli", href: "#articoli" },
        { label: "Chi siamo", href: "#storia" },
        { label: "Segnala una truffa", href: "#form", highlight: true },
      ],
    },
    {
      title: "Legale",
      links: [
        // { label: "Termini e condizioni", href: "/terms-and-conditions" },
        {
          label: "Privacy policy",
          href: "https://www.iubenda.com/privacy-policy/41152962",
          external: true,
        },
        {
          label: "Open source",
          href: "https://github.com/gioarca/scamreact",
          external: true,
        },
      ],
    },
    {
      title: "Info",
      links: [
        { label: "Nessun dato personale raccolto", href: null, muted: true },
        { label: "100% anonimo", href: null, muted: true },
        { label: "Progetto open source", href: null, muted: true },
      ],
    },
  ];

  const scrollTo = (id) => {
    if (!id.startsWith("#")) return;
    const el = document.getElementById(id.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* Main footer grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors">
                  <Shield size={16} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 leading-none">
                  Scam React
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                  Difesa collettiva
                </div>
              </div>
            </a>

            <p className="text-xs text-slate-500 leading-relaxed mb-5 max-w-50">
              La piattaforma italiana di intelligenza collettiva contro le
              truffe online.
            </p>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socials.map(({ href, alt, label, icon }) => (
                <a
                  key={alt}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 text-xs font-medium"
                >
                  {icon}
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map(
                  ({ label, href, highlight, external, muted }) => (
                    <li key={label}>
                      {muted || !href ? (
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="w-1 h-1 rounded-full bg-teal-400 shrink-0" />
                          {label}
                        </span>
                      ) : highlight ? (
                        <a
                          href={href}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollTo(href);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                          {label}
                        </a>
                      ) : (
                        <a
                          href={href}
                          onClick={
                            href.startsWith("#")
                              ? (e) => {
                                  e.preventDefault();
                                  scrollTo(href);
                                }
                              : undefined
                          }
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition-colors"
                        >
                          {label}
                          {external && (
                            <ExternalLink size={10} className="opacity-50" />
                          )}
                        </a>
                      )}
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            © 2026{" "}
            <span className="text-teal-600 font-semibold">ScamReact</span> —
            Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Github size={12} className="text-slate-300" />
            <span>Open source · MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
