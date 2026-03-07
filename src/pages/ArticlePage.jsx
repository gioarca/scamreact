import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { MOCK_ARTICLES } from "../data/articles.js"; // aggiusta il path secondo la tua struttura
import Badge from "../components/UI/Badge.jsx";

// ─── Scroll reveal hook ───────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────
const STEPS = [
  { n: "01", label: "Annuncio sponsorizzato sui social" },
  { n: "02", label: "Video deepfake o falsa intervista online" },
  { n: "03", label: "Primo investimento minimo (spesso €250)" },
  { n: "04", label: "Dashboard con profitti simulati" },
  { n: "05", label: "Pressione a versare somme più alte" },
  { n: "06", label: "Blocco del conto al tentativo di prelievo" },
];

const SIGNALS = [
  { text: 'Rendimenti "garantiti" o "senza rischio"' },
  { text: "Pressione a decidere entro poche ore" },
  { text: "Uso dell'immagine di politici o VIP per convincere" },
  { text: "Intermediari assenti dagli elenchi CONSOB" },
  { text: "Impossibilità o ostacoli nel prelevare i fondi" },
];

const SOURCES = [
  {
    tag: "Polizia Postale",
    text: "Oscurati centinaia di siti che promuovevano falsi investimenti finanziari e piattaforme di trading truffaldine.",
    url: "https://www.poliziadistato.it/articolo/postale--truffa-online-con-deepfake--oscurati-473-siti",
  },
  {
    tag: "CONSOB",
    text: "Come riconoscere truffe e falsi servizi di investimento non autorizzati.",
    url: "https://www.consob.it/web/area-pubblica/occhio-alle-truffe",
  },
  {
    tag: "Reuters",
    text: "La Banca d'Italia mette in guardia contro video deepfake che mostrano il governatore in promozioni fraudolente.",
    url: "https://www.reuters.com/business/finance/bank-italy-warns-over-deepfake-video-scams-using-governor-panetta-2026-02-26/",
  },
  {
    tag: "The European",
    text: "Analisi internazionale sulle campagne deepfake con celebrity ed endorsement falsi per investimenti.",
    url: "https://the-european.eu/story-57285/deepfake-celebrity-ads-drive-new-wave-of-investment-scams.html",
  },
  {
    tag: "Scamwatch AU",
    text: "Avviso sulle truffe con video manipolati di personaggi famosi per convincere ad investire.",
    url: "https://www.scamwatch.gov.au/about-us/news-and-alerts/scam-alert-fake-celebrity-online-investment-scams",
  },
];

// ─── Shared UI atoms (mirrors Home.jsx) ──────────────────────
function CategoryBadge({ children, variant = "teal" }) {
  const colors = {
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function ArticlePage() {
  const { id } = useParams();
  const article = MOCK_ARTICLES.find((a) => a.id === id);

  if (!article)
    return (
      <div className="py-24 text-center text-slate-500">
        Articolo non trovato.
        <Link to="/" className="block mt-4 text-teal-600 underline">
          Torna alla home
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-28 pb-16">
        {/* Same gradient + grid as Home hero */}
        <div className="absolute inset-0 bg-linear-to-br from-teal-50/60 via-white to-slate-50" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(rgba(20,184,166,0.07) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(20,184,166,0.07) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <Reveal>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-8"
            >
              <ArrowLeft size={15} />
              Torna alla home
            </a>
          </Reveal>

          {/* Meta */}
          <Reveal delay={60}>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="mb-4">
                <Badge variant="slate">{article.category}</Badge>
              </div>
              <CategoryBadge variant="teal">Analisi</CategoryBadge>
              <span className="text-xs text-slate-400">Marzo 2026</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-400">5 min lettura</span>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight mb-5">
              Guadagni Facili Online?{" "}
              <span className="text-teal-600">Attenzione ai Deepfake.</span>
            </h1>
          </Reveal>

          {/* Deck */}
          <Reveal delay={140}>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Video manipolati, interviste false, personaggi famosi clonati. Le
              truffe sugli investimenti online hanno cambiato faccia — e sono
              più credibili che mai.
            </p>
          </Reveal>

          {/* Trust strip — mirrors Home hero */}
          <Reveal delay={180}>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={15} className="text-green-500" />
                <span>Fonti verificate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={15} className="text-teal-500" />
                <span>Dati ufficiali</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen size={15} className="text-slate-400" />
                <span>Aggiornato 2026</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ BODY ══════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <div className="border-t border-slate-100 mb-12" />

        {/* Intercept quotes */}
        <Reveal>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-12">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Messaggi reali intercettati
            </p>
            <div className="space-y-3">
              {[
                '"Investi oggi, rendimenti garantiti."',
                '"Lo consiglia anche questo politico."',
                '"Intervista esclusiva: il segreto per diventare ricchi."',
              ].map((q) => (
                <div key={q} className="flex items-start gap-3">
                  <div className="w-0.5 self-stretch bg-teal-400 rounded-full shrink-0" />
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    {q}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Intro */}
        <Reveal>
          <div className="space-y-4 mb-12 text-base text-slate-700 leading-relaxed">
            <p>
              Le truffe sugli investimenti online stanno evolvendo rapidamente.
              Oltre alle classiche piattaforme di trading fasulle, oggi vengono
              usati <strong className="text-slate-900">video deepfake</strong> e
              articoli falsi che simulano interviste a personaggi famosi o
              leader politici per promuovere siti di investimento illeciti.
            </p>
            <p>
              La <strong className="text-slate-900">Polizia Postale</strong> ha
              più volte segnalato campagne fraudolente che sfruttano l'immagine
              di figure pubbliche. La{" "}
              <strong className="text-slate-900">CONSOB</strong> pubblica
              regolarmente avvisi su società di trading e criptovalute non
              autorizzate ad operare in Italia.
            </p>
          </div>
        </Reveal>

        <div className="border-t border-slate-100 mb-12" />

        {/* Come funziona */}
        <Reveal>
          <CategoryBadge variant="slate">Lo schema</CategoryBadge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 mb-8 tracking-tight">
            Come funziona la truffa
          </h2>
        </Reveal>

        <div className="space-y-3 mb-10">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 55}>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40 transition-all group cursor-default">
                <span className="text-sm font-bold text-teal-600 w-7 shrink-0">
                  {s.n}
                </span>
                <span className="text-sm text-slate-700 leading-snug flex-1">
                  {s.label}
                </span>
                <ChevronRight
                  size={14}
                  className="text-slate-200 shrink-0 group-hover:text-teal-400 transition-colors"
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* FBI callout — mirrors KPICard look */}
        <Reveal>
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center shrink-0 text-lg shadow-sm">
              🌐
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Secondo i report dell'
              <strong className="text-slate-900">
                FBI Internet Crime Complaint Center (IC3)
              </strong>
              , le truffe legate agli investimenti sono tra le categorie con le{" "}
              <strong className="text-slate-900">
                perdite economiche più elevate
              </strong>{" "}
              a livello globale.
            </p>
          </div>
        </Reveal>

        <div className="border-t border-slate-100 mb-12" />

        {/* Segnali */}
        <Reveal>
          <CategoryBadge variant="amber">Segnali d'allarme</CategoryBadge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 mb-2 tracking-tight">
            I segnali da non ignorare
          </h2>
          <p className="text-sm text-slate-500 mb-7">
            Se ne riconosci anche solo uno, fermati e non procedere.
          </p>
        </Reveal>

        <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 mb-12">
          {SIGNALS.map((s, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-amber-50/40 transition-colors">
                <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                <span className="text-sm text-slate-700 leading-snug">
                  {s.text}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Pull quote */}
        <Reveal>
          <blockquote className="border-l-4 border-teal-400 pl-5 py-1 mb-12">
            <p className="text-lg sm:text-xl font-semibold text-slate-800 leading-snug">
              Nessun investimento legale garantisce profitti certi. E nessuna
              figura pubblica seria promuove piattaforme sconosciute tramite
              link sponsorizzati.
            </p>
          </blockquote>
        </Reveal>

        <div className="border-t border-slate-100 mb-12" />

        {/* Perché parlarne */}
        <Reveal>
          <CategoryBadge variant="teal">Perché parlarne</CategoryBadge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 mb-5 tracking-tight">
            Il silenzio è parte del problema
          </h2>
          <div className="space-y-4 text-base text-slate-700 leading-relaxed mb-12">
            <p>
              Molte vittime non denunciano per vergogna. Ma riconoscere questi
              schemi — soprattutto quando sfruttano{" "}
              <strong className="text-slate-900">
                deepfake e intelligenza artificiale
              </strong>{" "}
              — può evitare che altri cadano nella stessa trappola.
            </p>
            <p>
              Parlarne apertamente è l'unico antidoto reale. Ogni segnalazione
              conta.
            </p>
          </div>
        </Reveal>

        {/* CTA — mirrors Home hero style exactly */}
        <Reveal>
          <div
            className="rounded-2xl p-6 sm:p-8 mb-12 text-center"
            style={{
              background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
              border: "1px solid #99f6e4",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-teal-50 border border-teal-200">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <Shield size={14} className="text-teal-600" />
              <span className="text-sm font-medium text-teal-700">
                100% anonimo · Nessun dato personale
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
              Hai ricevuto un messaggio sospetto?
            </h3>
            <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto leading-relaxed">
              Segnalalo in forma anonima. Aiuti migliaia di persone a
              riconoscerlo prima di cadere nella trappola.
            </p>
            <a
              href="/#form"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
            >
              Segnala una truffa
              <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>

        <div className="border-t border-slate-100 mb-12" />

        {/* Fonti */}
        <Reveal>
          <CategoryBadge variant="slate">Fonti</CategoryBadge>
          <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-6 tracking-tight">
            Approfondimenti e riferimenti
          </h2>
        </Reveal>

        <div className="space-y-3">
          {SOURCES.map((s, i) => (
            <Reveal key={i} delay={i * 50}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="mb-1.5">
                    <CategoryBadge variant="teal">{s.tag}</CategoryBadge>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {s.text}
                  </p>
                </div>
                <ExternalLink
                  size={14}
                  className="text-slate-300 shrink-0 mt-1 group-hover:text-teal-500 transition-colors"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
