import React, { useState, useEffect } from "react";
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

const API_URL = import.meta.env.VITE_API_URL + "/api/reports/stats";

// =============== MOCK DATA =======================

const MOCK_ARTICLES = [
  {
    id: "1",
    title: "Guadagni facili online: come riconoscere le truffe più comuni",
    excerpt: "Attenzione alle Truffe con Deepfake e Falsi Investimenti",
    date: "2026-03-05",
    category: "Articolo",
  },
  // {
  //   id: "2",
  //   title: "Truffe bancarie: il trend del 2026",
  //   excerpt:
  //     "Analisi delle nuove tecniche usate dai truffatori per impersonare operatori bancari e come difendersi.",
  //   date: "2026-02-08",
  //   category: "Analisi",
  // },
  // {
  //   id: "3",
  //   title: "Falsi investimenti crypto: cosa sapere",
  //   excerpt:
  //     "Le truffe sugli investimenti in criptovalute continuano a crescere. Ecco come identificarle prima di cadere nella trappola.",
  //   date: "2026-02-05",
  //   category: "Approfondimento",
  // },
];

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

const founders = [
  {
    name: "Dario M.",
    role: "CEO & Co-fondatore",
    avatar: "DM",
    color: "from-teal-400 to-teal-600",
    reason:
      "Ho perso €3.200 in una truffa online nel 2021. Nessuno mi ha aiutata a capire come riconoscerla prima. Voglio che nessun altro passi quello che ho vissuto io.",
    emoji: "🛡️",
  },
  {
    name: "Giorgio A.",
    role: "CTO & Co-fondatore",
    avatar: "GA",
    color: "from-slate-500 to-slate-700",
    reason:
      "Come sviluppatore, ho visto da vicino quanto sia facile costruire siti fasulli. Ho deciso di usare le stesse competenze per smascherarli anziché crearli.",
    emoji: "⚡",
  },
  {
    name: "Nicola D.",
    role: "Co-fondatore",
    avatar: "ND",
    color: "from-amber-400 to-orange-500",
    reason:
      "Mia nonna è stata truffata due volte. La seconda volta, aveva già dei dubbi ma non sapeva a chi rivolgersi. Scam React nasce per essere quella risposta.",
    emoji: "💛",
  },
];

function ChiSiamo() {
  const [view, setView] = useState("columns");

  return (
    <section
      id="storia"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f0fdfa 60%, #ecfdf5 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #0d9488 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{
              color: "#0d9488",
              background: "rgba(13,148,136,0.08)",
              letterSpacing: "0.18em",
            }}
          >
            Le persone dietro al progetto
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
            style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Chi siamo
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Tre persone con una storia personale. Una missione comune: rendere
            internet un posto più sicuro.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center mb-10 gap-2">
          <button
            onClick={() => setView("columns")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: view === "columns" ? "#0d9488" : "white",
              color: view === "columns" ? "white" : "#64748b",
              border: "2px solid",
              borderColor: view === "columns" ? "#0d9488" : "#e2e8f0",
              boxShadow:
                view === "columns" ? "0 4px 14px rgba(13,148,136,0.3)" : "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="0" y="0" width="4" height="16" rx="1" />
              <rect x="6" y="0" width="4" height="16" rx="1" />
              <rect x="12" y="0" width="4" height="16" rx="1" />
            </svg>
            Ognuno di noi
          </button>
          <button
            onClick={() => setView("group")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: view === "group" ? "#0d9488" : "white",
              color: view === "group" ? "white" : "#64748b",
              border: "2px solid",
              borderColor: view === "group" ? "#0d9488" : "#e2e8f0",
              boxShadow:
                view === "group" ? "0 4px 14px rgba(13,148,136,0.3)" : "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="4" cy="6" r="3" />
              <circle cx="12" cy="6" r="3" />
              <path d="M0 14c0-2.21 1.79-4 4-4s4 1.79 4 4H0zM8 14c0-2.21 1.79-4 4-4s4 1.79 4 4H8z" />
            </svg>
            Il team
          </button>
        </div>

        {/* ── VIEW: 3 COLUMNS ── */}
        {view === "columns" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {founders.map((f) => (
              <div
                key={f.name}
                className="relative rounded-2xl overflow-hidden group"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Top accent bar */}
                <div className={`h-1.5 w-full bg-linear-to-r ${f.color}`} />

                <div className="p-7">
                  {/* Avatar */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-linear-to-br ${f.color} flex items-center justify-center text-white font-bold text-lg mb-5`}
                    style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                  >
                    {f.avatar}
                  </div>

                  <p className="text-slate-900 font-bold text-lg leading-tight mb-0.5">
                    {f.name}
                  </p>
                  <p className="text-sm text-teal-600 font-medium mb-5">
                    {f.role}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">{f.emoji}</span>
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: "#94a3b8" }}
                    >
                      Perché lo faccio
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{f.reason}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── VIEW: GROUP ── */}
        {view === "group" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Simulated video call */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "4/3",
                background: "linear-gradient(135deg, #ccfbf1 0%, #e0f2fe 100%)",
                border: "2px dashed #0d9488",
              }}
            >
              <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-2">
                {founders.map((f) => (
                  <div
                    key={f.name}
                    className={`rounded-xl bg-linear-to-br ${f.color} flex flex-col items-center justify-center gap-1 relative overflow-hidden`}
                    style={{ opacity: 0.9 }}
                  >
                    <span className="text-white font-bold text-xl">
                      {f.avatar}
                    </span>
                    <span className="text-white/80 text-xs font-medium">
                      {f.name.split(" ")[0]}
                    </span>
                    <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
                      <svg
                        width="8"
                        height="10"
                        viewBox="0 0 8 10"
                        fill="white"
                      >
                        <rect x="2.5" y="0" width="3" height="6" rx="1.5" />
                        <path
                          d="M0.5 5a3.5 3.5 0 007 0"
                          stroke="white"
                          strokeWidth="1"
                          fill="none"
                        />
                        <line
                          x1="4"
                          y1="8.5"
                          x2="4"
                          y2="10"
                          stroke="white"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
                {/* Empty join cell */}
                <div
                  className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer group/join"
                  style={{
                    background: "rgba(13,148,136,0.12)",
                    border: "2px dashed rgba(13,148,136,0.4)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center group-hover/join:scale-110 transition-transform"
                    style={{ background: "#0d9488" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="white"
                    >
                      <line
                        x1="7"
                        y1="2"
                        x2="7"
                        y2="12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="2"
                        y1="7"
                        x2="12"
                        y2="7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span className="text-teal-700 text-xs font-semibold">
                    Unisciti
                  </span>
                </div>
              </div>

              {/* LIVE badge */}
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-white text-xs font-semibold">LIVE</span>
              </div>
            </div>

            {/* Story text */}
            <div>
              <h3
                className="text-2xl sm:text-3xl font-bold text-slate-900 mb-5"
                style={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}
              >
                Come nasce
                <br />
                <span style={{ color: "#0d9488" }}>Scam React</span>
              </h3>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Tutto inizia nel 2025, su una videochiamata tra tre amici
                  stanchi di vedere persone care cadere in trappole online.
                  Dario aveva appena perso i risparmi. Nicola stava ancora
                  aiutando sua nonna. Giorgio aveva trovato il codice sorgente
                  di una truffa su GitHub.
                </p>
                <p>
                  In quella call decidono: le competenze che ognuno ha costruito
                  possono diventare uno scudo collettivo. Non un articolo, non
                  un corso. Una piattaforma viva, alimentata dalla comunità, che
                  cresce insieme alle truffe che cerca di smascherare.
                </p>
                <p>
                  Oggi ScamReact vuole diventare il punto di riferimento{" "}
                  <strong className="text-slate-900">
                    per le migliaia di segnalazioni
                  </strong>{" "}
                  verificate e una community di{" "}
                  <strong className="text-slate-900">persone vere</strong> che
                  si proteggono a vicenda ogni giorno.
                </p>
              </div>

              {/* Founders mini-row */}
              <div className="flex items-center gap-3 mt-7">
                {founders.map((f) => (
                  <div
                    key={f.name}
                    className={`w-8 h-8 rounded-full bg-linear-to-br ${f.color} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {f.avatar}
                  </div>
                ))}
                <span className="text-slate-400 text-sm ml-1">
                  Dario, Giorgio &amp; Nicola
                </span>
              </div>
            </div>
          </div>
        )}
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
      <Articles />
      <ChiSiamo />
      <Form />
    </div>
  );
}
