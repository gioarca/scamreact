// // ScamsPage.jsx
// // Lista truffe con mappa coropleta Italia + embed Power BI
// //
// // Struttura dati API GET /api/reports (allineata allo schema Mongoose):
// // {
// //   _id: string,
// //   message: string,
// //   scamType: "phishing_smishing" | "impersonation_bank" | "fake_investment" |
// //             "marketplace_scam" | "job_scam" | "romance_scam" | "tech_support" | "other",
// //   channel: "whatsapp" | "sms" | "telegram" | "email" | "phone_call" |
// //            "instagram" | "facebook" | "website" | "other",
// //   amountRange: "na" | "lt_50" | "50_200" | "200_1000" | "gt_1000",
// //   age?: number,
// //   gender?: "male" | "female" | "non_binary" | "prefer_not_to_say",
// //   location?: string,   // nome regione italiana
// //   scamDate?: string,   // ISO 8601
// //   consentPublic: boolean,
// //   createdAt: string,   // ISO 8601
// // }
// //
// // ENV:
// //   VITE_API_URL      — base URL backend
// //   VITE_POWERBI_URL  — URL embed Power BI

import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Search,
  BarChart3,
  ExternalLink,
  Filter,
  X,
  TrendingUp,
  MapPin,
  MessageSquare,
  Smartphone,
  Mail,
  Phone,
  Globe,
  Users,
} from "lucide-react";
import ItalyMap from "./ItalyMap.jsx";

const API_URL = import.meta.env.VITE_API_URL + "/api/reports";
const POWERBI_URL = import.meta.env.VITE_POWERBI_URL ?? "";

// ============================================================
// DIZIONARI
// ============================================================

const SCAM_TYPE = {
  phishing_smishing: { label: "Phishing / Smishing", color: "#3b82f6" },
  impersonation_bank: { label: "Finta banca", color: "#8b5cf6" },
  fake_investment: { label: "Falso investimento", color: "#0d9488" },
  marketplace_scam: { label: "E-commerce", color: "#f59e0b" },
  job_scam: { label: "Offerta lavoro", color: "#64748b" },
  romance_scam: { label: "Truffa romantica", color: "#ec4899" },
  tech_support: { label: "Supporto tecnico", color: "#ef4444" },
  other: { label: "Altro", color: "#94a3b8" },
};

const CHANNEL = {
  whatsapp: { label: "WhatsApp", icon: MessageSquare },
  sms: { label: "SMS", icon: Smartphone },
  telegram: { label: "Telegram", icon: MessageSquare },
  email: { label: "Email", icon: Mail },
  phone_call: { label: "Telefono", icon: Phone },
  instagram: { label: "Instagram", icon: Users },
  facebook: { label: "Facebook", icon: Users },
  website: { label: "Sito web", icon: Globe },
  other: { label: "Altro", icon: MessageSquare },
};

const AMOUNT_RANGE = {
  na: { label: "Non specificato", color: "#94a3b8" },
  lt_50: { label: "< €50", color: "#facc15" },
  "50_200": { label: "€50 – €200", color: "#f97316" },
  "200_1000": { label: "€200 – €1.000", color: "#ef4444" },
  gt_1000: { label: "> €1.000", color: "#dc2626" },
};

const SCAM_FILTERS = [
  { key: "all", label: "Tutte" },
  { key: "phishing_smishing", label: "Phishing" },
  { key: "fake_investment", label: "Investimento" },
  { key: "romance_scam", label: "Romantica" },
  { key: "marketplace_scam", label: "E-commerce" },
  { key: "impersonation_bank", label: "Finta banca" },
  { key: "tech_support", label: "Supporto tecnico" },
  { key: "job_scam", label: "Lavoro" },
  { key: "other", label: "Altro" },
];

// Mock data per fallback
const MOCK_REPORTS = [];

// ============================================================
// UTILITIES
// ============================================================

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(str, n = 130) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n).trimEnd() + "…" : str;
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function ScamTypeBadge({ scamType }) {
  const cfg = SCAM_TYPE[scamType] ?? SCAM_TYPE.other;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 99,
        background: cfg.color + "18",
        color: cfg.color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.color,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

function ChannelBadge({ channel }) {
  const cfg = CHANNEL[channel] ?? CHANNEL.other;
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 500,
        color: "#64748b",
      }}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function AmountBadge({ amountRange }) {
  if (!amountRange || amountRange === "na") return null;
  const cfg = AMOUNT_RANGE[amountRange];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function ScamCard({ report, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "1.1rem 1.25rem",
        borderRadius: 12,
        background: "white",
        border: isActive
          ? "1.5px solid #0d9488"
          : "0.5px solid rgba(0,0,0,0.07)",
        boxShadow: isActive
          ? "0 0 0 3px rgba(13,148,136,0.1)"
          : "0 1px 8px rgba(0,0,0,0.04)",
        cursor: "pointer",
        transition: "border 0.15s, box-shadow 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <ScamTypeBadge scamType={report.scamType} />
        <span style={{ fontSize: 11, color: "#cbd5e1", flexShrink: 0 }}>
          {formatDate(report.scamDate || report.createdAt)}
        </span>
      </div>

      <p
        style={{
          fontSize: 13,
          color: "#334155",
          lineHeight: 1.65,
          margin: "0 0 10px",
          fontStyle: "italic",
        }}
      >
        "{truncate(report.message)}"
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ChannelBadge channel={report.channel} />
          {report.location && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 11,
                color: "#94a3b8",
              }}
            >
              <MapPin size={10} />
              {report.location}
            </span>
          )}
        </div>
        <AmountBadge amountRange={report.amountRange} />
      </div>
    </div>
  );
}

function FilterChip({ label, active, color = "#0d9488", onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 500,
        border: "0.5px solid",
        borderColor: active ? color : "rgba(0,0,0,0.1)",
        background: active ? color : "white",
        color: active ? "white" : "#64748b",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function KPIStrip({ reports }) {
  const total = reports.length;
  const regions = new Set(reports.map((r) => r.location).filter(Boolean)).size;
  const withLoss = reports.filter(
    (r) => r.amountRange && r.amountRange !== "na",
  ).length;
  const channels = new Set(reports.map((r) => r.channel)).size;

  const items = [
    {
      label: "Segnalazioni",
      value: total,
      icon: <Shield size={15} />,
      color: "#0d9488",
    },
    {
      label: "Regioni",
      value: regions,
      icon: <MapPin size={15} />,
      color: "#3b82f6",
    },
    {
      label: "Con perdite",
      value: withLoss,
      icon: <TrendingUp size={15} />,
      color: "#dc2626",
    },
    {
      label: "Canali",
      value: channels,
      icon: <Smartphone size={15} />,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 12,
        marginBottom: "1.75rem",
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            padding: "1rem 1.1rem",
            borderRadius: 12,
            background: "white",
            border: "0.5px solid rgba(0,0,0,0.07)",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
            }}
          >
            <span style={{ color: item.color }}>{item.icon}</span>
            <span
              style={{
                fontSize: 10,
                color: "#94a3b8",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {item.label}
            </span>
          </div>
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function PowerBIPanel({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15,23,42,0.6)",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(820px,95vw)",
          height: "100vh",
          background: "white",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: "0.5px solid rgba(0,0,0,0.08)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#f1c40f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart3 size={16} color="#1a1a2e" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Dashboard Power BI
              </p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                Analisi segnalazioni ScamReact
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {POWERBI_URL && (
              <a
                href={POWERBI_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "0.5px solid rgba(0,0,0,0.1)",
                  background: "white",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#64748b",
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={13} /> Apri in Power BI
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "0.5px solid rgba(0,0,0,0.1)",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} color="#64748b" />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden" }}>
          {POWERBI_URL ? (
            <iframe
              src={POWERBI_URL}
              title="Power BI ScamReact"
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
            />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                color: "#94a3b8",
              }}
            >
              <BarChart3 size={48} style={{ opacity: 0.2 }} />
              <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
                URL Power BI non configurato
              </p>
              <p style={{ fontSize: 12, margin: 0 }}>
                Aggiungi{" "}
                <code
                  style={{
                    background: "#f1f5f9",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                >
                  VITE_POWERBI_URL
                </code>{" "}
                nel{" "}
                <code
                  style={{
                    background: "#f1f5f9",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                >
                  .env
                </code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ScamsPage() {
  const [reports, setReports] = useState([]);   // array di segnalazioni
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [activeRegion, setActiveRegion] = useState(null);
  const [powerBIOpen, setPowerBIOpen] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Supporta sia array diretto che risposta paginata { data: [...] }
        const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
        setReports(list);
        setLoading(false);
      })
      .catch(() => {
        setReports(MOCK_REPORTS);
        setLoading(false);
      });
  }, []);

  const regionCounts = useMemo(() => {
    const map = {};
    for (const r of reports) {
      if (r.location) map[r.location] = (map[r.location] ?? 0) + 1;
    }
    return map;
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchType = activeType === "all" || r.scamType === activeType;
      const matchSearch =
        !search ||
        r.message.toLowerCase().includes(search.toLowerCase()) ||
        (r.location ?? "").toLowerCase().includes(search.toLowerCase());
      const matchRegion = !activeRegion || r.location === activeRegion;
      return matchType && matchSearch && matchRegion;
    });
  }, [reports, activeType, search, activeRegion]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .scams-page * { box-sizing: border-box; }
        .scam-list { display: flex; flex-direction: column; gap: 10px; }
        .scam-list-scroll { overflow-y: auto; max-height: 680px; padding-right: 4px; }
        .scam-list-scroll::-webkit-scrollbar { width: 4px; }
        .scam-list-scroll::-webkit-scrollbar-track { background: transparent; }
        .scam-list-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        @media (max-width: 900px) {
          .main-layout { flex-direction: column !important; }
          .map-col { width: 100% !important; position: static !important; }
          .kpi-strip { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .kpi-strip { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div
        className="scams-page"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(160deg, #f8fafc 0%, #f0fdfa 60%, #f0f9ff 100%)",
          fontFamily: "'DM Sans', sans-serif",
          paddingTop: "6rem",
          paddingBottom: "4rem",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(100,116,139,0.8)",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#0d9488",
                    display: "inline-block",
                  }}
                />
                Database segnalazioni
              </span>
              <h1
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Truffe segnalate
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#64748b",
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                {loading
                  ? "Caricamento…"
                  : `${reports.length} segnalazioni nel database`}
              </p>
            </div>

            <button
              onClick={() => setPowerBIOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                background: "#f1c40f",
                color: "#1a1a2e",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                boxShadow: "0 2px 12px rgba(241,196,15,0.35)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <BarChart3 size={16} />
              Analisi Power BI
            </button>
          </div>

          {/* KPIs */}
          {!loading && <KPIStrip reports={reports} />}

          {/* Filters */}
          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ position: "relative", maxWidth: 420 }}>
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca nel testo, regione…"
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 36px",
                  borderRadius: 10,
                  border: "0.5px solid rgba(0,0,0,0.1)",
                  background: "white",
                  fontSize: 13,
                  color: "#0f172a",
                  outline: "none",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <Filter size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
              {SCAM_FILTERS.map((f) => (
                <FilterChip
                  key={f.key}
                  label={f.label}
                  active={activeType === f.key}
                  color={
                    f.key === "all"
                      ? "#0d9488"
                      : (SCAM_TYPE[f.key]?.color ?? "#0d9488")
                  }
                  onClick={() => setActiveType(f.key)}
                />
              ))}
              {activeRegion && (
                <FilterChip
                  label={`📍 ${activeRegion}`}
                  active
                  color="#3b82f6"
                  onClick={() => setActiveRegion(null)}
                />
              )}
            </div>
          </div>

          {/* List + Map */}
          <div
            className="main-layout"
            style={{ display: "flex", gap: 20, alignItems: "flex-start" }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {loading ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: 110,
                        borderRadius: 12,
                        background: "white",
                        border: "0.5px solid rgba(0,0,0,0.06)",
                      }}
                    />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  <Shield
                    size={40}
                    style={{ opacity: 0.2, margin: "0 auto 12px" }}
                  />
                  <p style={{ fontWeight: 500, margin: 0 }}>
                    Nessun risultato trovato
                  </p>
                  <p style={{ fontSize: 13, margin: "4px 0 0" }}>
                    Prova a modificare i filtri
                  </p>
                </div>
              ) : (
                <>
                  <p
                    style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}
                  >
                    {filtered.length} risultat
                    {filtered.length === 1 ? "o" : "i"}
                    {activeRegion ? ` in ${activeRegion}` : ""}
                  </p>
                  <div className="scam-list-scroll">
                    <div className="scam-list">
                      {filtered.map((r) => (
                        <ScamCard
                          key={r._id}
                          report={r}
                          isActive={activeRegion === r.location}
                          onClick={() =>
                            setActiveRegion((prev) =>
                              prev === r.location ? null : r.location,
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div
              className="map-col"
              style={{
                width: 280,
                flexShrink: 0,
                background: "white",
                borderRadius: 16,
                border: "0.5px solid rgba(0,0,0,0.07)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.05)",
                padding: "1.25rem",
                position: "sticky",
                top: "5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: "0.75rem",
                }}
              >
                <MapPin size={14} style={{ color: "#0d9488" }} />
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Distribuzione geografica
                </p>
              </div>

              {activeRegion && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    padding: "5px 10px",
                    borderRadius: 8,
                    background: "#f0fdfa",
                    border: "0.5px solid #99f6e4",
                  }}
                >
                  <span
                    style={{ fontSize: 12, color: "#0d9488", fontWeight: 500 }}
                  >
                    {activeRegion} · {regionCounts[activeRegion] ?? 0} segn.
                  </span>
                  <button
                    onClick={() => setActiveRegion(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <X size={13} color="#0d9488" />
                  </button>
                </div>
              )}

              <ItalyMap
                data={regionCounts}
                activeRegion={activeRegion}
                onRegionClick={(region) =>
                  setActiveRegion((prev) => (prev === region ? null : region))
                }
              />
            </div>
          </div>
        </div>
      </div>

      <PowerBIPanel
        isOpen={powerBIOpen}
        onClose={() => setPowerBIOpen(false)}
      />
    </>
  );
}