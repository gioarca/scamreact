import React, { useState, useRef } from "react";

// ============================================================================
// CONSTANTS
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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

const REGIONS = [
  "Abruzzo",
  "Basilicata",
  "Calabria",
  "Campania",
  "Emilia-Romagna",
  "Friuli-Venezia Giulia",
  "Lazio",
  "Liguria",
  "Lombardia",
  "Marche",
  "Molise",
  "Piemonte",
  "Puglia",
  "Sardegna",
  "Sicilia",
  "Toscana",
  "Trentino-Alto Adige",
  "Umbria",
  "Valle d'Aosta",
  "Veneto",
];

const TOTAL_STEPS = 4;
const MIN_MSG_LEN = 50;

// ============================================================================
// UTILITIES
// ============================================================================

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
// UI PRIMITIVES
// ============================================================================

function Chip({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-150 select-none ${
        active
          ? "border-teal-500 bg-teal-50 text-teal-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
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
      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center transition-all duration-150 w-full ${
        active
          ? "border-teal-500 bg-teal-50 shadow-sm shadow-teal-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
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

function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
        {current}/{total}
      </span>
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continua →",
  nextDisabled = false,
  loading = false,
}) {
  return (
    <div className="flex gap-3 mt-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 border-slate-200 text-slate-600 hover:border-slate-300 transition-all"
        >
          ← Indietro
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="flex-2 py-3 rounded-xl font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Invio..." : nextLabel}
      </button>
    </div>
  );
}

// ============================================================================
// STEPS
// ============================================================================

// Step 1 — Messaggio
function StepMessage({ value, onChange, redacted, onNext }) {
  const textareaRef = useRef(null);
  const ready = value.length >= MIN_MSG_LEN;

  return (
    <div className="space-y-4">
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
          Descrivi brevemente cos'è successo, includendo eventuali messaggi
          ricevuti.
        </label>
        <p className="text-xs text-black mb-1.5">
          Più dettagli fornisci, più aiuti la community a riconoscere la truffa.
        </p>
        <textarea
          id="msg-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Es. "Salve, sono della sua banca. La sua carta è stata bloccata..."'
          rows={5}
          className="w-full px-4 py-3 text-sm text-black border-2 border-slate-200 rounded-xl focus:border-teal-400 focus:outline-none resize-none transition-colors placeholder:text-slate-400"
        />
        <div className="block items-center justify-between mt-1.5">
          <span className="text-xs text-slate-400">
            {value.length} / {MIN_MSG_LEN} caratteri minimi
          </span>
          <p className="block items-center justify-between text-xs text-black font-semibold mt-4">
            Linee guida per la segnalazione
            <br /> ScamReact raccoglie segnalazioni degli utenti per
            identificare possibili schemi di truffa online e offline.
            <br />
            Quando invii una segnalazione: descrivi i fatti nel modo più chiaro
            e neutrale possibile inserisci solo informazioni rilevanti per la
            segnalazione (ad esempio email, siti web o numeri di telefono
            utilizzati nel contatto ricevuto) non inserire nomi di persone,
            indirizzi privati o accuse personali.
            <br /> Le informazioni pubblicate su ScamReact sono contributi degli
            utenti e non rappresentano accuse verificate. La piattaforma non
            garantisce l’accuratezza delle segnalazioni e si riserva il diritto
            di moderare, modificare o rimuovere contenuti che possano violare la
            legge o contenere dati personali non appropriati.
          </p>
          {ready && (
            <span className="text-xs text-green-600 font-semibold">
              ✓ Pronto
            </span>
          )}
        </div>
      </div>

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

      <NavButtons onNext={onNext} nextDisabled={!ready} />
    </div>
  );
}

// Step 2 — Classificazione
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

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// Step 3 — Dati opzionali (età, regione, importo)
function StepOptional({
  age,
  setAge,
  location,
  setLocation,
  amountRange,
  setAmountRange,
  onBack,
  onNext,
}) {
  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
        Tutti i campi sono facoltativi. Ci aiutano a capire meglio il fenomeno.
      </p>

      {/* Età */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Età
        </label>
        <input
          type="number"
          min={18}
          max={100}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Es. 34"
          className="w-32 px-4 py-2 text-sm text-black border-2 border-slate-200 rounded-xl focus:border-teal-400 focus:outline-none transition-colors"
        />
      </div>

      {/* Regione */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Regione
        </label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 text-sm text-black border-2 border-slate-200 rounded-xl focus:border-teal-400 focus:outline-none transition-colors bg-white"
        >
          <option value="">Seleziona regione...</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Importo */}
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3">
          Importo coinvolto
        </h4>
        <div className="flex flex-wrap gap-2">
          {AMOUNT_RANGES.map((a) => (
            <Chip
              key={a.id}
              active={amountRange === a.id}
              onClick={() => setAmountRange(a.id)}
            >
              {a.label}
            </Chip>
          ))}
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

// Step 4 — Conferma e invio
function StepConfirm({
  redacted,
  consent,
  setConsent,
  onBack,
  onSubmit,
  loading,
  error,
}) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="text-xs font-semibold text-slate-500 mb-1.5">
          Testo che verrà salvato (redatto):
        </div>
        <div className="text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto leading-relaxed">
          {redacted}
        </div>
      </div>

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

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          ⚠️ {error}
        </div>
      )}

      <NavButtons
        onBack={onBack}
        onNext={onSubmit}
        nextLabel="✓ Invia segnalazione"
        loading={loading}
      />
    </div>
  );
}

// ============================================================================
// SUCCESS
// ============================================================================

function SuccessBanner({ onReset }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-teal-50 border-2 border-teal-200 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-black">
        ✓
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1">
        Segnalazione inviata!
      </h3>
      <p className="text-slate-500 text-sm mb-6">
        Grazie per proteggere la community.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-all"
      >
        Nuova segnalazione
      </button>
    </div>
  );
}

// ============================================================================
// WIZARD
// ============================================================================

const DEFAULT_FORM = {
  message: "",
  scamType: "phishing_smishing",
  channel: "sms",
  age: "",
  location: "",
  amountRange: "na",
  consent: true,
};

function ReportWizard({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));
  const redacted = redactSensitive(form.message);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: redacted,
          scamType: form.scamType,
          channel: form.channel,
          amountRange: form.amountRange,
          consentPublic: form.consent,
          ...(form.age && { age: Number(form.age) }),
          ...(form.location && { location: form.location }),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Errore ${res.status}`);
      }

      setForm(DEFAULT_FORM);
      setStep(1);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
              In {TOTAL_STEPS} step aiuti la community
            </p>
          </div>
        </div>
        <ProgressBar current={step} total={TOTAL_STEPS} />
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
          <StepOptional
            age={form.age}
            setAge={set("age")}
            location={form.location}
            setLocation={set("location")}
            amountRange={form.amountRange}
            setAmountRange={set("amountRange")}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <StepConfirm
            redacted={redacted}
            consent={form.consent}
            setConsent={set("consent")}
            onBack={() => setStep(3)}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ROOT
// ============================================================================

export default function Form() {
  const [done, setDone] = useState(false);

  return (
    <section
      id="form"
      className="py-24 bg-slate-50 border-t border-slate-100 scroll-mt-20"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold tracking-wide mb-5">
            Gratuito · Sicuro · Anonimo
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Segnala una truffa
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            Aiuta migliaia di persone condividendo la tua esperienza. Nessun
            dato personale richiesto.
          </p>
        </div>

        {/* Content */}
        {done ? (
          <SuccessBanner onReset={() => setDone(false)} />
        ) : (
          <ReportWizard onSuccess={() => setDone(true)} />
        )}

        {/* Privacy footer */}
        <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          <div className="font-semibold text-slate-700 mb-2">
            🔒 Privacy-by-design
          </div>
          <ul className="grid grid-cols-2 gap-1">
            <li>✅ Nessun dato personale</li>
            <li>✅ Redazione automatica</li>
            <li>✅ Dati salvati in modo anonimo</li>
            <li>✅ Trend aggregati</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
