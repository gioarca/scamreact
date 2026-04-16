import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  BarChart3,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  Lock,
  CheckCircle,
} from "lucide-react";
import Badge from "../components/UI/Badge.jsx";
import Button from "../components/UI/Button.jsx";
import Card from "../components/UI/Card.jsx";
import Form from "../components/Form.jsx";
import { MOCK_ARTICLES } from "../data/articles.js";

const API_URL = import.meta.env.VITE_API_URL + "/api/reports/stats";

// ============================================================
// UTILITIES
// ============================================================

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ============================================================
// SECTIONS
// ============================================================

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-teal-50/60 via-white to-slate-50" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(20,184,166,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.07) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-teal-50 border border-teal-200">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <Shield size={14} className="text-teal-600" />
          <span className="text-sm font-medium text-teal-700">
            Difesa collettiva contro le truffe
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight mb-6">
          Reagisci alle truffe.
          <br />
          <span className="text-teal-600">Proteggi tutti.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          La piattaforma italiana di{" "}
          <span className="font-semibold text-slate-800">
            intelligenza collettiva
          </span>{" "}
          che raccoglie segnalazioni anonime per identificare truffe in tempo
          reale.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Button
            onClick={() =>
              document
                .getElementById("form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            variant="outline"
            size="lg"
          >
            Segnala una truffa
            <ArrowRight size={20} />
          </Button>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle size={16} className="text-green-500" />
            <span>100% anonimo</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield size={16} className="text-teal-500" />
            <span>Open source</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function KPIBar({ stats }) {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <KPICard
            value={stats.totalReports ?? "…"}
            label="Segnalazioni totali"
            icon={<BarChart3 size={20} className="text-teal-600" />}
          />
          <KPICard
            value={stats.recentReports}
            label="Ultimi 7 giorni"
            icon={<TrendingUp size={20} className="text-blue-500" />}
          />
          <KPICard
            value={stats.uniquePatterns}
            label="Pattern unici"
            icon={<Shield size={20} className="text-indigo-500" />}
          />
          <KPICard
            value="100%"
            label="Anonimo e sicuro"
            icon={<Lock size={20} className="text-green-500" />}
            isText
          />
        </div>
      </div>
    </section>
  );
}

function KPICard({ value, label, icon, isText = false }) {
  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div
        className={`font-bold text-slate-900 mb-1 ${isText ? "text-2xl" : "text-4xl"}`}
      >
        {value}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

// ============================================================
// CHI SIAMO
// ============================================================

// const founders = [
//   {
//     name: "Dario M.",
//     role: "CEO & Co-fondatore",
//     avatar: "DM",
//     color: "from-teal-400 to-teal-600",
//     reason:
//       "Ho perso €3.200 in una truffa online nel 2021. Nessuno mi ha aiutata a capire come riconoscerla prima. Voglio che nessun altro passi quello che ho vissuto io.",
//     emoji: "🛡️",
//   },
//   {
//     name: "Giorgio A.",
//     role: "CTO & Co-fondatore",
//     avatar: "GA",
//     color: "from-slate-500 to-slate-700",
//     reason:
//       "Come sviluppatore, ho visto da vicino quanto sia facile costruire siti fasulli. Ho deciso di usare le stesse competenze per smascherarli anziché crearli.",
//     emoji: "⚡",
//   },
//   {
//     name: "Nicola D.",
//     role: "Co-fondatore",
//     avatar: "ND",
//     color: "from-amber-400 to-orange-500",
//     reason:
//       "Mia nonna è stata truffata due volte. La seconda volta, aveva già dei dubbi ma non sapeva a chi rivolgersi. Scam React nasce per essere quella risposta.",
//     emoji: "💛",
//   },
// ];

// function ChiSiamo() {
//   const [view, setView] = useState("columns");

//   return (
//     <section
//       id="storia"
//       className="py-24 relative overflow-hidden"
//       style={{
//         background:
//           "linear-gradient(135deg, #f8fafc 0%, #f0fdfa 60%, #ecfdf5 100%)",
//       }}
//     >
//       {/* Decorative blobs */}
//       <div
//         className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
//         style={{
//           background: "radial-gradient(circle, #0d9488 0%, transparent 70%)",
//           transform: "translate(30%, -30%)",
//         }}
//       />
//       <div
//         className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
//         style={{
//           background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
//           transform: "translate(-30%, 30%)",
//         }}
//       />

//       <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <span
//             className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
//             style={{
//               color: "#0d9488",
//               background: "rgba(13,148,136,0.08)",
//               letterSpacing: "0.18em",
//             }}
//           >
//             Le persone dietro al progetto
//           </span>
//           <h2
//             className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
//             style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
//           >
//             Chi siamo
//           </h2>
//           <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
//             Tre persone con una storia personale. Una missione comune: rendere
//             internet un posto più sicuro.
//           </p>
//         </div>

//         {/* Toggle */}
//         <div className="flex items-center justify-center mb-10 gap-2">
//           <button
//             onClick={() => setView("columns")}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
//             style={{
//               background: view === "columns" ? "#0d9488" : "white",
//               color: view === "columns" ? "white" : "#64748b",
//               border: "2px solid",
//               borderColor: view === "columns" ? "#0d9488" : "#e2e8f0",
//               boxShadow:
//                 view === "columns" ? "0 4px 14px rgba(13,148,136,0.3)" : "none",
//             }}
//           >
//             <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
//               <rect x="0" y="0" width="4" height="16" rx="1" />
//               <rect x="6" y="0" width="4" height="16" rx="1" />
//               <rect x="12" y="0" width="4" height="16" rx="1" />
//             </svg>
//             Ognuno di noi
//           </button>
//           <button
//             onClick={() => setView("group")}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
//             style={{
//               background: view === "group" ? "#0d9488" : "white",
//               color: view === "group" ? "white" : "#64748b",
//               border: "2px solid",
//               borderColor: view === "group" ? "#0d9488" : "#e2e8f0",
//               boxShadow:
//                 view === "group" ? "0 4px 14px rgba(13,148,136,0.3)" : "none",
//             }}
//           >
//             <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
//               <circle cx="4" cy="6" r="3" />
//               <circle cx="12" cy="6" r="3" />
//               <path d="M0 14c0-2.21 1.79-4 4-4s4 1.79 4 4H0zM8 14c0-2.21 1.79-4 4-4s4 1.79 4 4H8z" />
//             </svg>
//             Il team
//           </button>
//         </div>

//         {/* ── VIEW: 3 COLUMNS ── */}
//         {view === "columns" && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {founders.map((f) => (
//               <div
//                 key={f.name}
//                 className="relative rounded-2xl overflow-hidden group"
//                 style={{
//                   background: "white",
//                   border: "1px solid rgba(0,0,0,0.06)",
//                   boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
//                 }}
//               >
//                 {/* Top accent bar */}
//                 <div className={`h-1.5 w-full bg-linear-to-r ${f.color}`} />

//                 <div className="p-7">
//                   {/* Avatar */}
//                   <div
//                     className={`w-14 h-14 rounded-2xl bg-linear-to-br ${f.color} flex items-center justify-center text-white font-bold text-lg mb-5`}
//                     style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
//                   >
//                     {f.avatar}
//                   </div>

//                   <p className="text-slate-900 font-bold text-lg leading-tight mb-0.5">
//                     {f.name}
//                   </p>
//                   <p className="text-sm text-teal-600 font-medium mb-5">
//                     {f.role}
//                   </p>

//                   <div className="flex items-center gap-3 mb-4">
//                     <span className="text-xl">{f.emoji}</span>
//                     <span
//                       className="text-xs font-bold tracking-widest uppercase"
//                       style={{ color: "#94a3b8" }}
//                     >
//                       Perché lo faccio
//                     </span>
//                   </div>

//                   <p className="text-slate-600 text-sm leading-relaxed italic">
//                     "{f.reason}"
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── VIEW: GROUP ── */}
//         {view === "group" && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             {/* Simulated video call */}
//             <div
//               className="relative rounded-2xl overflow-hidden"
//               style={{
//                 aspectRatio: "4/3",
//                 background: "linear-gradient(135deg, #ccfbf1 0%, #e0f2fe 100%)",
//                 border: "2px dashed #0d9488",
//               }}
//             >
//               <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-2">
//                 {founders.map((f) => (
//                   <div
//                     key={f.name}
//                     className={`rounded-xl bg-linear-to-br ${f.color} flex flex-col items-center justify-center gap-1 relative overflow-hidden`}
//                     style={{ opacity: 0.9 }}
//                   >
//                     <span className="text-white font-bold text-xl">
//                       {f.avatar}
//                     </span>
//                     <span className="text-white/80 text-xs font-medium">
//                       {f.name.split(" ")[0]}
//                     </span>
//                     <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
//                       <svg
//                         width="8"
//                         height="10"
//                         viewBox="0 0 8 10"
//                         fill="white"
//                       >
//                         <rect x="2.5" y="0" width="3" height="6" rx="1.5" />
//                         <path
//                           d="M0.5 5a3.5 3.5 0 007 0"
//                           stroke="white"
//                           strokeWidth="1"
//                           fill="none"
//                         />
//                         <line
//                           x1="4"
//                           y1="8.5"
//                           x2="4"
//                           y2="10"
//                           stroke="white"
//                           strokeWidth="1"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 ))}
//                 {/* Empty join cell */}
//                 <div
//                   className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer group/join"
//                   style={{
//                     background: "rgba(13,148,136,0.12)",
//                     border: "2px dashed rgba(13,148,136,0.4)",
//                   }}
//                 >
//                   <div
//                     className="w-8 h-8 rounded-full flex items-center justify-center group-hover/join:scale-110 transition-transform"
//                     style={{ background: "#0d9488" }}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 14 14"
//                       fill="white"
//                     >
//                       <line
//                         x1="7"
//                         y1="2"
//                         x2="7"
//                         y2="12"
//                         stroke="white"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                       />
//                       <line
//                         x1="2"
//                         y1="7"
//                         x2="12"
//                         y2="7"
//                         stroke="white"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                   </div>
//                   <span className="text-teal-700 text-xs font-semibold">
//                     Unisciti
//                   </span>
//                 </div>
//               </div>

//               {/* LIVE badge */}
//               <div
//                 className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
//                 style={{
//                   background: "rgba(0,0,0,0.55)",
//                   backdropFilter: "blur(4px)",
//                 }}
//               >
//                 <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
//                 <span className="text-white text-xs font-semibold">LIVE</span>
//               </div>
//             </div>

//             {/* Story text */}
//             <div>
//               <h3
//                 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-5"
//                 style={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}
//               >
//                 Come nasce
//                 <br />
//                 <span style={{ color: "#0d9488" }}>Scam React</span>
//               </h3>

//               <div className="space-y-4 text-slate-600 leading-relaxed">
//                 <p>
//                   Tutto inizia nel 2025, su una videochiamata tra tre amici
//                   stanchi di vedere persone care cadere in trappole online.
//                   Dario aveva appena perso i risparmi. Nicola stava ancora
//                   aiutando sua nonna. Giorgio aveva trovato il codice sorgente
//                   di una truffa su GitHub.
//                 </p>
//                 <p>
//                   In quella call decidono: le competenze che ognuno ha costruito
//                   possono diventare uno scudo collettivo. Non un articolo, non
//                   un corso. Una piattaforma viva, alimentata dalla comunità, che
//                   cresce insieme alle truffe che cerca di smascherare.
//                 </p>
//                 <p>
//                   Oggi ScamReact vuole diventare il punto di riferimento{" "}
//                   <strong className="text-slate-900">
//                     per le migliaia di segnalazioni
//                   </strong>{" "}
//                   verificate e una community di{" "}
//                   <strong className="text-slate-900">persone vere</strong> che
//                   si proteggono a vicenda ogni giorno.
//                 </p>
//               </div>

//               {/* Founders mini-row */}
//               <div className="flex items-center gap-3 mt-7">
//                 {founders.map((f) => (
//                   <div
//                     key={f.name}
//                     className={`w-8 h-8 rounded-full bg-linear-to-br ${f.color} flex items-center justify-center text-white text-xs font-bold`}
//                   >
//                     {f.avatar}
//                   </div>
//                 ))}
//                 <span className="text-slate-400 text-sm ml-1">
//                   Dario &amp; Giorgio
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// ─── Data ───────────────────────────────────────────────────────────────────
const founders = [
  {
    initials: "DA",
    name: "Dario",
    role: "Co-fondatore · Finanza",
    num: "01",
    accentBg: "#ccfbf1",
    accentText: "#0f766e",
    patternColor: "#5eead4",
    tag: "Investimento fraudolento",
    story: (
      <>
        Nel 2024 <strong>ho perso i miei risparmi</strong> in un investimento
        che sembrava legittimo. Nessun segnale evidente, nessun campanello
        d'allarme — almeno così credevo. Dopo mesi a ricostruire cosa fosse
        andato storto, ho capito che{" "}
        <strong>il problema non era la mia ingenuità</strong>, ma la mancanza di
        strumenti accessibili per riconoscere queste trappole in anticipo.
      </>
    ),
  },
  {
    initials: "GR",
    name: "Giorgio",
    role: "Co-fondatore · Tecnologia",
    num: "02",
    accentBg: "#dbeafe",
    accentText: "#1d4ed8",
    patternColor: "#93c5fd",
    tag: "Reverse engineering",
    story: (
      <>
        Da sviluppatore, un giorno ho trovato il{" "}
        <strong>codice sorgente di una truffa attiva su GitHub</strong> —
        deployment automatizzato, fake reviews, pagine clonate di banche reali.
        Ho realizzato che le truffe non sono improvvisate: sono{" "}
        <strong>prodotti ingegnerizzati</strong>. Da quel momento ho iniziato a
        smontarle pubblicamente, una alla volta.
      </>
    ),
  },
];

// ─── Avatar with geometric SVG pattern ──────────────────────────────────────
function FounderAvatar({ founder, size = 120 }) {
  // const id = `pattern-${founder.initials}`;
  const isDario = founder.initials === "DA";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", display: "block", flexShrink: 0 }}
    >
      <defs>
        <clipPath id={`clip-${founder.initials}`}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${founder.initials})`}>
        {/* Base fill */}
        <rect width="120" height="120" fill={founder.accentBg} />

        {/* Geometric pattern – unique per founder */}
        {isDario ? (
          <>
            {/* Dario: concentric arcs — finance/wave motif */}
            {[20, 34, 48, 62, 76, 90].map((r) => (
              <circle
                key={r}
                cx="110"
                cy="110"
                r={r}
                stroke={founder.patternColor}
                strokeWidth="1.2"
                fill="none"
                opacity="0.45"
              />
            ))}
            <circle
              cx="110"
              cy="110"
              r={104}
              stroke={founder.patternColor}
              strokeWidth="1.2"
              fill="none"
              opacity="0.25"
            />
          </>
        ) : (
          <>
            {/* Giorgio: grid dots — code/tech motif */}
            {Array.from({ length: 7 }, (_, col) =>
              Array.from({ length: 7 }, (_, row) => (
                <circle
                  key={`${col}-${row}`}
                  cx={8 + col * 18}
                  cy={8 + row * 18}
                  r="2"
                  fill={founder.patternColor}
                  opacity={0.5 - (col + row) * 0.03}
                />
              )),
            )}
          </>
        )}

        {/* Soft overlay circle */}
        <circle cx="60" cy="60" r="60" fill={founder.accentBg} opacity="0.35" />

        {/* Initials */}
        <text
          x="60"
          y="67"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontSize="28"
          fill={founder.accentText}
          letterSpacing="2"
        >
          {founder.initials}
        </text>
      </g>

      {/* Border ring */}
      <circle
        cx="60"
        cy="60"
        r="59"
        stroke={founder.patternColor}
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

// ─── Animated entry hook ─────────────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
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

// ─── Founder Card ────────────────────────────────────────────────────────────
function FounderCard({ founder, delay = 0 }) {
  const [ref, visible] = useFadeIn();

  return (
    <div
      ref={ref}
      style={{
        padding: "2.25rem 2rem 2rem",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {/* Editorial number */}
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "4rem",
          fontWeight: 700,
          color: "rgba(0,0,0,0.055)",
          position: "absolute",
          top: "1rem",
          right: "1.25rem",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {founder.num}
      </span>

      {/* Avatar */}
      <div style={{ marginBottom: "1.4rem" }}>
        <FounderAvatar founder={founder} size={96} />
      </div>

      {/* Name + role */}
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "var(--color-text-primary, #0f172a)",
          marginBottom: "2px",
          lineHeight: 1.2,
        }}
      >
        {founder.name}
      </p>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#0d9488",
          marginBottom: "1.4rem",
        }}
      >
        {founder.role}
      </p>

      {/* Story label */}
      <p
        style={{
          fontSize: "10px",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "rgba(100,116,139,0.7)",
          marginBottom: "0.5rem",
        }}
      >
        La storia
      </p>

      {/* Story text */}
      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.85,
          color: "var(--color-text-secondary, #475569)",
          fontStyle: "italic",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        "{founder.story}"
      </p>

      {/* Tag */}
      <span
        style={{
          display: "inline-block",
          marginTop: "1.25rem",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.07em",
          padding: "4px 12px",
          borderRadius: "99px",
          border: "0.5px solid rgba(100,116,139,0.25)",
          color: "var(--color-text-secondary, #64748b)",
        }}
      >
        {founder.tag}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
function ChiSiamo() {
  const [headerRef, headerVisible] = useFadeIn(0.2);
  const [missionRef, missionVisible] = useFadeIn(0.2);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        #storia * { box-sizing: border-box; }

        #storia strong {
          font-style: normal;
          font-weight: 500;
          color: var(--color-text-primary, #0f172a);
        }

        .sr-founder-card:first-child {
          border-right: 0.5px solid rgba(0,0,0,0.07);
        }

        @media (max-width: 600px) {
          .sr-founders-grid {
            grid-template-columns: 1fr !important;
          }
          .sr-founder-card:first-child {
            border-right: none !important;
            border-bottom: 0.5px solid rgba(0,0,0,0.07);
          }
          .sr-mission-inner {
            flex-direction: column !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>

      <section
        id="storia"
        style={{
          background:
            "linear-gradient(160deg, #f8fafc 0%, #f0fdfa 55%, #f0f9ff 100%)",
          padding: "5rem 1.5rem 6rem",
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Decorative blob top-right */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Decorative blob bottom-left */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{ maxWidth: "820px", margin: "0 auto", position: "relative" }}
        >
          {/* ── Header ── */}
          <div
            ref={headerRef}
            style={{
              marginBottom: "3rem",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(100,116,139,0.8)",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#0d9488",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              Le persone dietro al progetto
            </span>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 5.5vw, 3.5rem)",
                fontWeight: 700,
                lineHeight: 1.07,
                color: "#0f172a",
                margin: "0 0 1.1rem",
                letterSpacing: "-0.02em",
              }}
            >
              Chi siamo,
              <br />
              <em style={{ color: "#0d9488", fontStyle: "italic" }}>
                e perché lo facciamo
              </em>
            </h2>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "#64748b",
                maxWidth: "480px",
                margin: 0,
              }}
            >
              Due persone con una storia personale. Una missione comune: rendere
              internet un posto più sicuro per tutti.
            </p>

            {/* Divider line */}
            <div
              style={{
                width: "36px",
                height: "2px",
                background: "#0d9488",
                marginTop: "1.75rem",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* ── Founders grid ── */}
          <div
            className="sr-founders-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              border: "0.5px solid rgba(0,0,0,0.07)",
              borderRadius: "16px",
              overflow: "hidden",
              background: "white",
              boxShadow: "0 2px 24px rgba(0,0,0,0.05)",
            }}
          >
            {founders.map((f, i) => (
              <div key={f.initials} className="sr-founder-card">
                <FounderCard founder={f} delay={i * 120} />
              </div>
            ))}
          </div>

          {/* ── Mission block ── */}
          <div
            ref={missionRef}
            style={{
              marginTop: "1.75rem",
              padding: "2rem 2rem",
              border: "0.5px solid rgba(0,0,0,0.07)",
              borderRadius: "16px",
              background: "white",
              boxShadow: "0 2px 24px rgba(0,0,0,0.04)",
              opacity: missionVisible ? 1 : 0,
              transform: missionVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s",
            }}
          >
            <div
              className="sr-mission-inner"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              {/* Mini avatars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "-8px",
                  flexShrink: 0,
                }}
              >
                {founders.map((f, i) => (
                  <div
                    key={f.initials}
                    style={{
                      marginLeft: i > 0 ? "-10px" : 0,
                      position: "relative",
                      zIndex: founders.length - i,
                    }}
                  >
                    <FounderAvatar founder={f} size={44} />
                  </div>
                ))}
              </div>

              {/* Text */}
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  color: "#334155",
                  flex: 1,
                  margin: 0,
                }}
              >
                Nel 2025, su una videochiamata, abbiamo deciso che le nostre
                competenze potevano diventare uno scudo collettivo. Oggi{" "}
                <strong
                  style={{
                    fontStyle: "normal",
                    fontWeight: 700,
                    color: "#0d9488",
                  }}
                >
                  ScamReact
                </strong>{" "}
                è una piattaforma viva, alimentata dalla comunità, che cresce
                insieme alle truffe che cerca di smascherare.
              </p>

              {/* CTA */}
              <a
                href="#community"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "11px 20px",
                  borderRadius: "99px",
                  background: "#0d9488",
                  color: "white",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Scopri di più
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2.5 6.5h8M7.5 3.5l3 3-3 3"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Manifesto page (placeholder, non è linkata da nessuna parte per ora)

function Manifesto() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-teal-50/60 via-white to-slate-50" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(20,184,166,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.07) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-teal-50 border border-teal-200">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <Shield size={14} className="text-teal-600" />
          <span className="text-sm font-medium text-teal-700">Manifesto</span>
        </div>

        {/* Subheadline */}
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Il numero di truffe a cui siamo esposti è in continua crescita. Non
          importa il mezzo: telefono, computer, messaggi, intelligenza
          artificiale o una persona incontrata per strada. Oggi il rischio è
          reale. Non esistono armi magiche per difendersi. Esistono
          consapevolezza, attenzione ai dettagli e conoscenza dei nuovi metodi
          usati per truffare. Le forze dell’ordine fanno il possibile, ma non
          possono prevenire tutto. Allora cosa possiamo fare? Attivare il potere
          della community. ScamReact nasce da una truffa subita da un amico e
          dalla consapevolezza che quegli avvisi condivisi nelle chat di
          famiglia, negli articoli o sui social meritano un unico luogo chiaro e
          accessibile. Uno spazio dove trovare gli ultimi schemi ricorrenti, le
          truffe riconosciute in tempo e quelle purtroppo subite, per
          trasformare ogni esperienza in protezione per gli altri. La tua storia
          può proteggere qualcuno. Unisciti. Condividi. Aiuta a fermare la
          prossima truffa
          <span className="font-semibold text-slate-800">
            intelligenza collettiva
          </span>{" "}
          che raccoglie segnalazioni anonime per identificare truffe in tempo
          reale.
        </p>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle size={16} className="text-green-500" />
            <span>100% anonimo</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield size={16} className="text-teal-500" />
            <span>Open source</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ARTICLES
// ============================================================

function Articles() {
  return (
    <section id="articoli" className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <BookOpen size={28} className="text-teal-600" />
              Articoli
            </h2>
            <p className="text-slate-600">
              Guide e approfondimenti per proteggerti
            </p>
          </div>
          {/* <Button variant="ghost" size="sm">
            Vedi tutti
            <ArrowRight size={16} />
          </Button> */}
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {MOCK_ARTICLES.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }) {
  const categoryColors = {
    Guida: "teal",
    Analisi: "blue",
    Approfondimento: "slate",
  };

  return (
    <Link to={`/articoli/${article.id}`} className="block group">
      <Card hoverable className="flex flex-col">
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-3">
            <Badge variant={categoryColors[article.category] || "slate"}>
              {article.category}
            </Badge>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-snug mb-3 group-hover:text-teal-700 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {formatDate(article.date)}
            </span>
            <ArrowRight size={16} className="text-teal-500" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function HomePage() {
  const [stats, setStats] = useState({
    totalReports: null,
    recentReports: 38,
    uniquePatterns: 14,
  });

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setStats((prev) => ({
          ...prev,
          totalReports: data.totalReports,
        }));
      })
      .catch((err) => {
        console.error("Errore nel fetch stats:", err);
        setStats((prev) => ({ ...prev, totalReports: "N/D" }));
      });
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <KPIBar stats={stats} />
      <Manifesto />
      <Articles />
      <ChiSiamo />
      <Form />
    </div>
  );
}
