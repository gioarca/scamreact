import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

// ============================================================================
// CONSTANTS
// ============================================================================

const SCAM_TYPES = [
  {
    id: "phishing_smishing",
    label: "Phishing / Link",
    icon: "🎣",
    example: "Link per credenziali",
  },
  {
    id: "impersonation_bank",
    label: "Finta banca",
    icon: "🏦",
    example: "Finto operatore",
  },
  {
    id: "fake_investment",
    label: "Investimenti",
    icon: "💰",
    example: "Trading/crypto falso",
  },
  {
    id: "marketplace_scam",
    label: "E-commerce",
    icon: "🛒",
    example: "Mai consegnato",
  },
  {
    id: "job_scam",
    label: "Lavoro falso",
    icon: "💼",
    example: "Offerte fake",
  },
  {
    id: "romance_scam",
    label: "Sentimentale",
    icon: "💔",
    example: "Pig butchering",
  },
  {
    id: "tech_support",
    label: "Assistenza",
    icon: "🔧",
    example: "Finto supporto",
  },
  { id: "other", label: "Altro", icon: "❓", example: "Altro schema" },
];

const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "sms", label: "SMS", icon: "📱" },
  { id: "telegram", label: "Telegram", icon: "✈️" },
  { id: "email", label: "Email", icon: "📧" },
  { id: "phone_call", label: "Chiamata", icon: "📞" },
  { id: "instagram", label: "Instagram", icon: "📷" },
  { id: "facebook", label: "Facebook", icon: "👥" },
  { id: "website", label: "Sito web", icon: "🌐" },
  { id: "other", label: "Altro", icon: "❓" },
];

const AMOUNT_RANGES = [
  { id: "na", label: "Preferisco non dirlo" },
  { id: "lt_50", label: "< 50 €" },
  { id: "50_200", label: "50–200 €" },
  { id: "200_1000", label: "200–1.000 €" },
  { id: "gt_1000", label: "> 1.000 €" },
];

const BADGES = [
  { id: "first_report", name: "Prima segnalazione", icon: "🎖️", xp: 25 },
  { id: "detective", name: "Detective", icon: "🔍", xp: 100 },
  { id: "guardian", name: "Guardiano", icon: "🛡️", xp: 250 },
  { id: "expert", name: "Esperto", icon: "⭐", xp: 500 },
];

const TOTAL_STEPS = 3;
const MIN_MSG_LEN = 50;
const LS_KEY = "scam_radar_v3";

// ============================================================================
// UTILITIES (pure, memoization-friendly)
// ============================================================================

function uid() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function nowISO() {
  return new Date().toISOString();
}

function humanDate(iso) {
  try {
    return new Date(iso).toLocaleString("it-IT", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function withinLastDays(iso, days) {
  return new Date(iso).getTime() >= Date.now() - days * 86_400_000;
}

// Luhn check for credit card redaction
function luhnCheck(digits) {
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0,
    even = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i]);
    if (even) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    even = !even;
  }
  return sum % 10 === 0;
}

function redactSensitive(text) {
  if (!text) return "";
  return text
    .replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, "[EMAIL]")
    .replace(/(?:\+39|0039)?\s?3\d{2}[\s-]?\d{3}[\s-]?\d{4}/g, "[TEL]")
    .replace(/(?:\+39|0039)?\s?0\d{1,4}[\s-]?\d{6,8}/g, "[TEL]")
    .replace(/\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi, "[CF]")
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, (m) => {
      const d = m.replace(/\D/g, "");
      return luhnCheck(d) ? "[CARTA]" : m;
    })
    .replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/gi, "[IBAN]")
    .replace(
      /\b(via|viale|piazza|corso|str\.|v\.)\s+[a-zA-Zàèéìòù\s]+\d{1,4}/gi,
      "[INDIRIZZO]",
    )
    .replace(/https?:\/\/[^\s]+/g, (url) => {
      try {
        const u = new URL(url);
        return /token|id|auth|key|session/i.test(url)
          ? `[LINK:${u.hostname}]`
          : `${u.origin}${u.pathname}`.slice(0, 100);
      } catch {
        return "[LINK]";
      }
    })
    .replace(
      /\b(gentile|egregio|caro|cara)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
      "$1 [NOME]",
    )
    .trim()
    .slice(0, 5000);
}

// ============================================================================
// STORAGE
// ============================================================================

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// ============================================================================
// SEED DATA
// ============================================================================

function createSeedReports() {
  const make = (minsAgo, type, ch, msg) => ({
    id: uid(),
    createdAt: new Date(Date.now() - minsAgo * 60_000).toISOString(),
    scamType: type,
    channel: ch,
    amountRange: "na",
    message: redactSensitive(msg),
    consentPublic: true,
  });
  return [
    make(
      2880,
      "impersonation_bank",
      "whatsapp",
      "Gentile cliente, per una transazione sospetta acceda subito: https://banca-sicura.example/verify",
    ),
    make(
      1440,
      "phishing_smishing",
      "sms",
      "Il tuo pacco è in giacenza. Clicca qui per aggiornare: https://corriere.example/track",
    ),
    make(
      180,
      "fake_investment",
      "telegram",
      "Investimento garantito crypto! Rendimento 300% in 30 giorni. Contattami ora!",
    ),
  ];
}

// ============================================================================
// UI PRIMITIVES
// ============================================================================

function Chip({ children, active, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
        border-2 transition-all duration-150 select-none
        ${
          active
            ? "border-teal-500 bg-teal-50 text-teal-700"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
        } ${className}
      `}
    >
      {children}
    </button>
  );
}

function SelectCard({ icon, label, sublabel, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center
        transition-all duration-150 w-full
        ${
          active
            ? "border-teal-500 bg-teal-50 shadow-sm shadow-teal-100"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }
      `}
    >
      <span className="text-2xl leading-none">{icon}</span>
      <span
        className={`text-xs font-bold leading-tight ${active ? "text-teal-700" : "text-slate-700"}`}
      >
        {label}
      </span>
      {sublabel && (
        <span className="text-[10px] text-slate-400 leading-tight">
          {sublabel}
        </span>
      )}
    </button>
  );
}

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <React.Fragment key={i}>
          <div
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${i < current ? "bg-teal-500" : i === current - 1 ? "bg-teal-500 flex-1" : "bg-slate-200"}
              ${i === current - 1 ? "flex-3" : "flex-1"}
            `}
          />
        </React.Fragment>
      ))}
      <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-1">
        {current}/{total}
      </span>
    </div>
  );
}

// ============================================================================
// REPORT WIZARD
// ============================================================================

const DEFAULT_FORM = {
  message: "",
  scamType: "phishing_smishing",
  channel: "sms",
  amountRange: "na",
  consent: true,
};

function ReportWizard({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(DEFAULT_FORM);

  const set = useCallback(
    (key) => (val) => setForm((prev) => ({ ...prev, [key]: val })),
    [],
  );

  const redacted = useMemo(() => redactSensitive(form.message), [form.message]);

  const handleSubmit = useCallback(() => {
    onSubmit({
      id: uid(),
      createdAt: nowISO(),
      scamType: form.scamType,
      channel: form.channel,
      amountRange: form.amountRange,
      message: redacted,
      consentPublic: form.consent,
    });
    setForm(DEFAULT_FORM);
    setStep(1);
  }, [form, redacted, onSubmit]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📝</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Segnala una truffa
            </h3>
            <p className="text-sm text-slate-500">
              In 3 step aiuti la community
            </p>
          </div>
        </div>
        <ProgressDots current={step} total={TOTAL_STEPS} />
      </div>

      <div className="p-6">
        {step === 1 && (
          <StepMessage
            value={form.message}
            onChange={set("message")}
            redacted={redacted}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepClassify
            scamType={form.scamType}
            setScamType={set("scamType")}
            channel={form.channel}
            setChannel={set("channel")}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepConfirm
            redacted={redacted}
            amountRange={form.amountRange}
            setAmountRange={set("amountRange")}
            consent={form.consent}
            setConsent={set("consent")}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

// ── Step 1 ──────────────────────────────────────────────────────────────────

function StepMessage({ value, onChange, redacted, onNext }) {
  const textareaRef = useRef(null);
  const ready = value.length >= MIN_MSG_LEN;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="space-y-4">
      {/* Privacy note */}
      <div className="flex items-start gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl">
        <span className="text-lg mt-0.5">🔒</span>
        <div className="text-xs text-teal-800">
          <span className="font-semibold block">Cosa NON serve</span>
          Nome · Email · Telefono · Documenti — rimoviamo tutto automaticamente
        </div>
      </div>

      <div>
        <label
          htmlFor="msg-input"
          className="block text-sm font-semibold text-slate-800 mb-2"
        >
          Descrivi o incolla il messaggio sospetto
        </label>
        <textarea
          id="msg-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Es. "Salve, sono della sua banca. La sua carta è stata bloccata per attività sospetta, clicchi qui per sbloccarla..."'
          rows={5}
          className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:border-teal-400 focus:outline-none resize-none transition-colors placeholder:text-slate-400"
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-slate-400">
            {value.length} / {MIN_MSG_LEN} caratteri minimi
          </span>
          {ready && (
            <span className="text-xs text-green-600 font-semibold">
              ✓ Pronto
            </span>
          )}
        </div>
      </div>

      {/* Redaction preview */}
      {ready && redacted !== value && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-semibold text-slate-500 mb-1.5">
            Anteprima dopo redazione automatica:
          </div>
          <div className="text-xs text-slate-700 whitespace-pre-wrap line-clamp-3 font-mono">
            {redacted}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!ready}
        className="w-full py-3 rounded-xl font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Continua →
      </button>
    </div>
  );
}

// ── Step 2 ──────────────────────────────────────────────────────────────────

function StepClassify({
  scamType,
  setScamType,
  channel,
  setChannel,
  onBack,
  onNext,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3">
          Che tipo di truffa è?
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {SCAM_TYPES.map((t) => (
            <SelectCard
              key={t.id}
              icon={t.icon}
              label={t.label}
              sublabel={t.example}
              active={scamType === t.id}
              onClick={() => setScamType(t.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3">
          Dove l'hai ricevuto?
        </h4>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <Chip
              key={c.id}
              active={channel === c.id}
              onClick={() => setChannel(c.id)}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 border-slate-200 text-slate-600 hover:border-slate-300 transition-all"
        >
          ← Indietro
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-2 py-3 rounded-xl font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-all"
        >
          Continua →
        </button>
      </div>
    </div>
  );
}

// ── Step 3 ──────────────────────────────────────────────────────────────────

function StepConfirm({
  redacted,
  amountRange,
  setAmountRange,
  consent,
  setConsent,
  onBack,
  onSubmit,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3">
          Importo coinvolto (opzionale)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMOUNT_RANGES.map((a) => (
            <Chip
              key={a.id}
              active={amountRange === a.id}
              onClick={() => setAmountRange(a.id)}
              className="justify-center text-center"
            >
              {a.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Final preview */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="text-xs font-semibold text-slate-500 mb-1.5">
          Testo che verrà salvato (redatto):
        </div>
        <div className="text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto leading-relaxed">
          {redacted}
        </div>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-teal-200 hover:bg-teal-50/40 transition-all">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-teal-600"
        />
        <span className="text-sm">
          <span className="font-semibold text-slate-800">
            Contribuisci ai trend aggregati
          </span>
          <span className="text-slate-500 block mt-0.5 text-xs">
            Solo statistiche, mai dati personali
          </span>
        </span>
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 border-slate-200 text-slate-600 hover:border-slate-300 transition-all"
        >
          ← Indietro
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex-2 py-3 rounded-xl font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-all shadow-sm hover:shadow-md"
        >
          ✓ Invia segnalazione
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SUCCESS STATE
// ============================================================================

function SuccessBanner({ report, user, onReset, onViewTrends }) {
  const type = SCAM_TYPES.find((t) => t.id === report.scamType);
  const ch = CHANNELS.find((c) => c.id === report.channel);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-teal-50 border-2 border-teal-200 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
        ✓
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1">
        Segnalazione inviata!
      </h3>
      <p className="text-slate-500 text-sm mb-6">
        Grazie per proteggere la community.
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Chip active>
          {type?.icon} {type?.label}
        </Chip>
        <Chip active>
          {ch?.icon} {ch?.label}
        </Chip>
      </div>

      {/* XP gained */}
      <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="text-amber-600 font-bold text-sm">+25 XP</span>
        <span className="text-amber-500 text-xs">
          · Livello {user.level} — {user.xp}/{user.xpToNext} XP
        </span>
      </div>

      {/* Mini XP bar */}
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-teal-500 transition-all duration-700"
          style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onViewTrends}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700 transition-all"
        >
          Vedi trend →
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-all"
        >
          Nuova segnalazione
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// TRENDS DASHBOARD
// ============================================================================

function TrendsDashboard({ reports }) {
  const last7 = useMemo(
    () => reports.filter((r) => withinLastDays(r.createdAt, 7)),
    [reports],
  );

  const topType = useMemo(() => {
    const map = new Map();
    last7.forEach((r) => map.set(r.scamType, (map.get(r.scamType) || 0) + 1));
    const [id, count] = [...map.entries()].sort((a, b) => b[1] - a[1])[0] || [];
    return id ? { ...SCAM_TYPES.find((t) => t.id === id), count } : null;
  }, [last7]);

  const topChannel = useMemo(() => {
    const map = new Map();
    last7.forEach((r) => map.set(r.channel, (map.get(r.channel) || 0) + 1));
    const [id, count] = [...map.entries()].sort((a, b) => b[1] - a[1])[0] || [];
    return id ? { ...CHANNELS.find((c) => c.id === id), count } : null;
  }, [last7]);

  return (
    <div className="space-y-4">
      {/* User card */}
      {/* <UserCard user={user} /> */}

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Ultimi 7 gg" value={last7.length} icon="📊" />
        <StatCard
          label="Top schema"
          value={topType?.icon ?? "—"}
          sub={topType?.label}
          icon={null}
          raw
        />
        <StatCard
          label="Top canale"
          value={topChannel?.icon ?? "—"}
          sub={topChannel?.label}
          icon={null}
          raw
        />
      </div>

      {/* Recent */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">
            Ultime segnalazioni
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {reports.slice(0, 5).map((r) => (
            <ReportRow key={r.id} report={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, raw = false }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
      <div
        className={`font-bold text-slate-900 mb-0.5 ${raw ? "text-3xl" : "text-3xl text-teal-600"}`}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 font-medium">{sub}</div>}
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

// function UserCard({ user }) {
//   const progress = Math.min((user.xp / user.xpToNext) * 100, 100);
//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
//       <div className="flex items-center gap-4 mb-4">
//         <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
//           {user.level}
//         </div>
//         <div className="min-w-0 flex-1">
//           <div className="font-bold text-slate-900">
//             Difensore Lv. {user.level}
//           </div>
//           <div className="text-xs text-slate-500">
//             {user.reportsCount} segnalazioni
//           </div>
//         </div>
//         <div className="text-xs font-semibold text-slate-400">
//           {user.xp}/{user.xpToNext} XP
//         </div>
//       </div>

//       {/* XP bar */}
//       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
//         <div
//           className="h-full bg-teal-500 transition-all duration-500"
//           style={{ width: `${progress}%` }}
//         />
//       </div>

//       {/* Badges */}
//       <div className="flex gap-2">
//         {BADGES.map((b) => (
//           <div
//             key={b.id}
//             title={`${b.name} (+${b.xp} XP)`}
//             className={`
//               w-10 h-10 rounded-xl flex items-center justify-center text-xl
//               border-2 transition-all
//               ${
//                 user.badges.includes(b.id)
//                   ? "border-amber-300 bg-amber-50"
//                   : "border-slate-100 bg-slate-50 opacity-30 grayscale"
//               }
//             `}
//           >
//             {b.icon}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

function ReportRow({ report }) {
  const type = SCAM_TYPES.find((t) => t.id === report.scamType);
  const ch = CHANNELS.find((c) => c.id === report.channel);
  return (
    <div className="px-5 py-3 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-2 flex-wrap mb-1.5">
        <Chip active={false}>
          {type?.icon} {type?.label}
        </Chip>
        <Chip active={false}>
          {ch?.icon} {ch?.label}
        </Chip>
        <span className="text-xs text-slate-400 ml-auto">
          {humanDate(report.createdAt)}
        </span>
      </div>
      <p className="text-xs text-slate-600 line-clamp-2 font-mono leading-relaxed">
        {report.message}
      </p>
    </div>
  );
}

// ============================================================================
// ROOT COMPONENT
// ============================================================================

const DEFAULT_USER = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  reportsCount: 0,
  checksCount: 0,
  badges: [],
};

export default function Form() {
  const [tab, setTab] = useState("report"); // "report" | "trends"
  const [submitted, setSubmitted] = useState(null); // last submitted report

  const [reports, setReports] = useState(() => {
    const s = loadFromStorage();
    return s?.reports || createSeedReports();
  });

  const [user, setUser] = useState(() => {
    const s = loadFromStorage();
    return s?.user || DEFAULT_USER;
  });

  // Persist on changes (skip initial mount via flag)
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    saveToStorage({ reports, user });
  }, [reports, user]);

  const handleSubmit = useCallback((report) => {
    setReports((prev) => [report, ...prev]);

    setUser((prev) => {
      const next = { ...prev };
      next.xp += 25;
      next.reportsCount += 1;
      if (next.reportsCount === 1 && !next.badges.includes("first_report")) {
        next.badges = [...next.badges, "first_report"];
        next.xp += 25;
      }
      // Level up loop
      while (next.xp >= next.xpToNext) {
        next.xp -= next.xpToNext;
        next.level += 1;
        next.xpToNext = Math.floor(next.xpToNext * 1.5);
      }
      return next;
    });

    setSubmitted(report);
    setTab("success");
  }, []);

  const recentCount = useMemo(
    () => reports.filter((r) => withinLastDays(r.createdAt, 7)).length,
    [reports],
  );

  return (
    <section id="form" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold tracking-wide mb-5">
            ✓ Gratuito · Sicuro · Anonimo
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Segnala una truffa
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            Aiuta migliaia di persone condividendo la tua esperienza. Nessun
            dato personale richiesto.
          </p>
        </div>

        {/* Tabs */}
        {tab !== "success" && (
          <div className="flex gap-2 mb-6 p-1 bg-white border border-slate-200 rounded-2xl">
            <TabBtn
              active={tab === "report"}
              onClick={() => setTab("report")}
              icon="📝"
              label="Segnala"
            />
            <TabBtn
              active={tab === "trends"}
              onClick={() => setTab("trends")}
              icon="📊"
              label="Trend"
              badge={recentCount}
            />
          </div>
        )}

        {/* Content */}
        {tab === "report" && <ReportWizard onSubmit={handleSubmit} />}
        {tab === "success" && submitted && (
          <SuccessBanner
            report={submitted}
            user={user}
            onReset={() => {
              setSubmitted(null);
              setTab("report");
            }}
            onViewTrends={() => {
              setSubmitted(null);
              setTab("trends");
            }}
          />
        )}
        {tab === "trends" && <TrendsDashboard reports={reports} user={user} />}

        {/* Privacy footer */}
        <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          <div className="font-semibold text-slate-700 mb-2">
            🔒 Privacy-by-design
          </div>
          <ul className="grid grid-cols-2 gap-1">
            <li>✅ Nessun dato personale</li>
            <li>✅ Redazione automatica</li>
            <li>✅ Solo nel tuo browser</li>
            <li>✅ Trend aggregati</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function TabBtn({ active, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
        text-sm font-semibold transition-all duration-150
        ${
          active
            ? "bg-teal-600 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {badge > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
