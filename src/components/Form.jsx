import React, { useState, useRef, useEffect } from "react";

// ============================================================================
// CONSTANTS
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const SCAM_TYPES = [
  {
    id: "account_identity_theft",
    label: "Furto d'identità",
    icon: "🪪",
    example: "Account compromesso",
    description:
      "I truffatori prendono il controllo dei tuoi account o si fingono te.",
  },
  {
    id: "payment_diversion",
    label: "Deviazione pagamenti",
    icon: "📨",
    example: "Fattura modificata",
    description:
      "I truffatori intercettano le fatture e modificano i dati di pagamento.",
  },
  {
    id: "purchase_sale_scam",
    label: "Acquisto / Vendita",
    icon: "🛒",
    example: "Prodotto mai arrivato",
    description:
      "Truffe legate all'acquisto o alla vendita di un prodotto o servizio.",
  },
  {
    id: "charity_donation_scam",
    label: "Falsa beneficenza",
    icon: "🤲",
    example: "Donazioni fraudolente",
    description:
      "False organizzazioni benefiche o richieste di donazioni fraudolente.",
  },
  {
    id: "investment_scam",
    label: "Investimenti",
    icon: "💰",
    example: "Trading/crypto falso",
    description:
      "Truffe che offrono prodotti finanziari o opportunità di investimento.",
  },
  {
    id: "job_scam",
    label: "Lavoro falso",
    icon: "💼",
    example: "Guadagni facili",
    description:
      "Falsi lavori, spesso con promesse di guadagni elevati con poco sforzo.",
  },
  {
    id: "recovery_scam",
    label: "Recupero fondi",
    icon: "🔁",
    example: "Commissione per rimborso",
    description:
      "I truffatori chiedono una commissione per recuperare soldi persi in una truffa.",
  },
  {
    id: "phishing",
    label: "Phishing",
    icon: "🎣",
    example: "Furto credenziali",
    description:
      "Email o messaggi progettati per ottenere informazioni personali.",
  },
  {
    id: "romance_scam",
    label: "Sentimentale",
    icon: "💔",
    example: "Pig butchering",
    description: "Truffe basate su relazioni affettive o romantiche.",
  },
  {
    id: "threat_intimidation_scam",
    label: "Minacce",
    icon: "😨",
    example: "Ricatto o estorsione",
    description:
      "Truffe che usano minacce o intimidazioni per richiedere denaro.",
  },
  {
    id: "unexpected_money_scam",
    label: "Soldi inattesi",
    icon: "🏆",
    example: "Eredità o vincita",
    description: "Promesse di eredità, vincite o somme di denaro improvvise.",
  },
  {
    id: "home_renovation_scam",
    label: "Lavori in casa",
    icon: "🔨",
    example: "Anticipo sparito",
    description:
      "Richiesta di anticipo per lavori domestici che non vengono mai completati.",
  },
  {
    id: "card_cloning_scam",
    label: "Clonazione carta",
    icon: "💳",
    example: "Addebiti non autorizzati",
    description:
      "Clonazione del bancomat o della carta di credito tramite skimmer, phishing o intercettazione dei dati.",
  },
  {
    id: "other",
    label: "Altro",
    icon: "❓",
    example: "Schema diverso",
    description:
      "La tua esperienza di truffa non rientra nelle categorie sopra elencate.",
  },
];

const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp", icon: "💬", type: "phone" },
  { id: "sms", label: "SMS", icon: "📱", type: "phone" },
  { id: "telegram", label: "Telegram", icon: "✈️", type: "phone" },
  { id: "email", label: "Email", icon: "📧", type: "email" },
  { id: "phone_call", label: "Chiamata", icon: "📞", type: "phone" },
  { id: "instagram", label: "Instagram", icon: "📷", type: "social" },
  { id: "facebook", label: "Facebook", icon: "👥", type: "social" },
  { id: "website", label: "Sito web", icon: "🌐", type: "website" },
  { id: "other", label: "Altro", icon: "❓", type: "none" },
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

// Phone number validation (Italian + international)
function validatePhone(value) {
  const cleaned = value.replace(/[\s\-().]/g, "");
  return (
    /^(\+?39)?3\d{8,9}$/.test(cleaned) || /^\+?[1-9]\d{6,14}$/.test(cleaned)
  );
}

// Website validation
function validateWebsite(value) {
  try {
    const url = value.startsWith("http") ? value : `https://${value}`;
    const u = new URL(url);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

// Email validation
function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

// Social profile validation — accetta @username, username, o URL profilo
function validateSocial(value) {
  const v = value.trim().replace(/^@/, "");
  if (v.length < 1) return false;
  // URL profilo (instagram.com/..., facebook.com/...)
  if (value.startsWith("http")) {
    try {
      return Boolean(new URL(value).hostname);
    } catch {
      return false;
    }
  }
  // Username: almeno 1 carattere, niente spazi
  return /^[^\s]{1,60}$/.test(v);
}

function normalizeWebsite(value) {
  if (!value) return value;
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  return `https://${trimmed}`;
}

// ============================================================================
// CONTACT EVIDENCE MODAL
// ============================================================================

function ContactEvidenceModal({
  channel,
  value,
  onChange,
  onConfirm,
  onSkip,
  onClose,
}) {
  const isPhone = channel?.type === "phone";
  const isWebsite = channel?.type === "website";
  const isEmail = channel?.type === "email";
  const isSocial = channel?.type === "social";
  const inputRef = useRef(null);
  const [localVal, setLocalVal] = useState(value || "");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const isValid = isPhone
    ? validatePhone(localVal)
    : isWebsite
      ? validateWebsite(localVal)
      : isEmail
        ? validateEmail(localVal)
        : isSocial
          ? validateSocial(localVal)
          : true;

  const errorMsg =
    touched && localVal && !isValid
      ? isPhone
        ? "Formato non valido. Esempio: +39 345 123 4567"
        : isEmail
          ? "Inserisci un indirizzo email valido. Esempio: noreply@fake-bank.it"
          : isSocial
            ? "Inserisci un username valido. Esempio: @profilo_sospetto"
            : "Inserisci un URL valido. Esempio: www.sito-truffa.it"
      : null;

  function handleConfirm() {
    if (!localVal.trim()) {
      onSkip();
      return;
    }
    if (!isValid) {
      setTouched(true);
      return;
    }
    const final = isWebsite ? normalizeWebsite(localVal) : localVal.trim();
    onChange(final);
    onConfirm();
  }

  function handleKey(e) {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onClose();
  }

  const icon = isPhone ? "📱" : isEmail ? "📧" : isSocial ? channel.icon : "🌐";
  const title = isPhone
    ? `Numero usato da ${channel.label}`
    : isEmail
      ? "Email del mittente sospetto"
      : isSocial
        ? `Profilo ${channel.label} sospetto`
        : "Sito web della truffa";
  const subtitle = isPhone
    ? "Inserisci il numero di telefono da cui hai ricevuto il contatto."
    : isEmail
      ? "Inserisci l'indirizzo email da cui hai ricevuto il messaggio sospetto."
      : isSocial
        ? `Inserisci il profilo ${channel.label} che ti ha contattato (username o URL).`
        : "Inserisci l'URL del sito truffaldino che hai visitato.";
  const placeholder = isPhone
    ? "+39 345 123 4567"
    : isEmail
      ? "noreply@fake-bank.it"
      : isSocial
        ? `@profilo_sospetto`
        : "www.sito-truffa.it";
  const hint = isPhone
    ? "Formato accettato: +39, 0039, o solo il numero (es. 3451234567)"
    : isEmail
      ? "Inserisci l'indirizzo completo — es. supporto@unicredit-sicurezza.com"
      : isSocial
        ? `Accettato con @ (es. @truffatore99) o come URL completo del profilo`
        : "Accettato con o senza https:// — es. www.crypto-fakebroker.com";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
    >
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Top handle (mobile) */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 mt-0.5 rounded-lg hover:bg-slate-100"
            aria-label="Chiudi"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Privacy note */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-sm mt-0.5">⚠️</span>
            <p className="text-xs text-amber-800">
              Questo dato è <strong>pubblico nella segnalazione</strong> e aiuta
              altri utenti a identificare la truffa.
              {isPhone && " Non inserire il tuo numero."}
              {isEmail && " Non inserire la tua email."}
              {isSocial && " Non inserire il tuo profilo."}
            </p>
          </div>

          {/* Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isPhone
                ? "Numero di telefono"
                : isEmail
                  ? "Indirizzo email mittente"
                  : isSocial
                    ? `Profilo ${channel.label}`
                    : "URL del sito"}
              <span className="text-slate-400 font-normal ml-1">
                (facoltativo)
              </span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={isPhone ? "tel" : isEmail ? "email" : "text"}
                value={localVal}
                onChange={(e) => {
                  setLocalVal(e.target.value);
                  setTouched(true);
                }}
                onKeyDown={handleKey}
                placeholder={placeholder}
                inputMode={isPhone ? "tel" : isEmail ? "email" : "url"}
                className={`w-full px-4 py-3 text-sm font-mono border-2 rounded-xl focus:outline-none transition-colors ${
                  errorMsg
                    ? "border-red-300 bg-red-50 text-red-900 focus:border-red-400"
                    : localVal && isValid
                      ? "border-green-300 bg-green-50 text-slate-900 focus:border-green-400"
                      : "border-slate-200 bg-white text-slate-900 focus:border-teal-400"
                }`}
              />
              {localVal && isValid && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-base">
                  ✓
                </span>
              )}
            </div>
            {errorMsg && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errorMsg}
              </p>
            )}
            {!errorMsg && (
              <p className="text-xs text-slate-400 mt-1.5">{hint}</p>
            )}
          </div>

          {/* Example chips — website */}
          {isWebsite && (
            <div className="flex flex-wrap gap-1.5">
              {[
                "www.unicredit-sicurezza.com",
                "cryptobonus-italia.net",
                "offerta-lavoro-da-casa.it",
              ].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    setLocalVal(ex);
                    setTouched(true);
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}

          {/* Example chips — email */}
          {isEmail && (
            <div className="flex flex-wrap gap-1.5">
              {[
                "noreply@unicredit-alert.it",
                "supporto@paypal-sicurezza.com",
                "info@rimborso-inps.net",
              ].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    setLocalVal(ex);
                    setTouched(true);
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}

          {/* Example chips — social */}
          {isSocial && (
            <div className="flex flex-wrap gap-1.5">
              {[
                "@investimenti_facili",
                "@guadagna_da_casa99",
                "@offerta_lavoro_ufficiale",
              ].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    setLocalVal(ex);
                    setTouched(true);
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all"
          >
            Salta
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-[2] py-3 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-all disabled:opacity-40"
            disabled={!!errorMsg}
          >
            {localVal ? "Conferma →" : "Continua senza →"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(32px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
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
            garantisce l'accuratezza delle segnalazioni e si riserva il diritto
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

// Step 2 — Classificazione (with modal trigger)
function StepClassify({
  scamType,
  setScamType,
  channel,
  setChannel,
  contactEvidence,
  setContactEvidence,
  onBack,
  onNext,
}) {
  const [showModal, setShowModal] = useState(false);
  const [pendingChannel, setPendingChannel] = useState(null);

  const selectedChannel = CHANNELS.find((c) => c.id === channel);

  function handleChannelClick(c) {
    setChannel(c.id);
    if (
      c.type === "phone" ||
      c.type === "website" ||
      c.type === "email" ||
      c.type === "social"
    ) {
      setPendingChannel(c);
      setShowModal(true);
    } else {
      setContactEvidence("");
    }
  }

  function handleModalConfirm() {
    setShowModal(false);
    setPendingChannel(null);
  }

  function handleModalSkip() {
    setContactEvidence("");
    setShowModal(false);
    setPendingChannel(null);
  }

  function handleModalClose() {
    setShowModal(false);
    setPendingChannel(null);
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-3">
            Che tipo di truffa è?
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
          {(() => {
            const sel = SCAM_TYPES.find((t) => t.id === scamType);
            return sel?.description ? (
              <div className="mt-3 flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-base mt-0.5">{sel.icon}</span>
                <div>
                  <span className="text-xs font-semibold text-slate-700">
                    {sel.label} —{" "}
                  </span>
                  <span className="text-xs text-slate-500">
                    {sel.description}
                  </span>
                </div>
              </div>
            ) : null;
          })()}
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
                onClick={() => handleChannelClick(c)}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </Chip>
            ))}
          </div>

          {/* Evidence badge — shown when a value was provided */}
          {contactEvidence &&
            selectedChannel &&
            (selectedChannel.type === "phone" ||
              selectedChannel.type === "website" ||
              selectedChannel.type === "email" ||
              selectedChannel.type === "social") && (
              <div className="mt-3 flex items-center gap-2 p-2.5 bg-teal-50 border border-teal-200 rounded-xl">
                <span className="text-sm">
                  {selectedChannel.type === "phone"
                    ? "📱"
                    : selectedChannel.type === "email"
                      ? "📧"
                      : selectedChannel.type === "social"
                        ? selectedChannel.icon
                        : "🌐"}
                </span>
                <span className="text-xs font-mono text-teal-800 flex-1 truncate">
                  {contactEvidence}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPendingChannel(selectedChannel);
                    setShowModal(true);
                  }}
                  className="text-xs text-teal-600 font-semibold hover:text-teal-800 underline underline-offset-2"
                >
                  Modifica
                </button>
                <button
                  type="button"
                  onClick={() => setContactEvidence("")}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                  aria-label="Rimuovi"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </button>
              </div>
            )}

          {/* Prompt to add evidence */}
          {!contactEvidence &&
            selectedChannel &&
            (selectedChannel.type === "phone" ||
              selectedChannel.type === "website" ||
              selectedChannel.type === "email" ||
              selectedChannel.type === "social") && (
              <button
                type="button"
                onClick={() => {
                  setPendingChannel(selectedChannel);
                  setShowModal(true);
                }}
                className="mt-3 w-full flex items-center gap-2 p-2.5 border-2 border-dashed border-teal-300 rounded-xl text-xs text-teal-600 font-semibold hover:bg-teal-50 transition-all"
              >
                <span>
                  {selectedChannel.type === "phone"
                    ? "📱"
                    : selectedChannel.type === "email"
                      ? "📧"
                      : selectedChannel.type === "social"
                        ? selectedChannel.icon
                        : "🌐"}
                </span>
                <span>
                  {selectedChannel.type === "phone"
                    ? `Aggiungi il numero usato da ${selectedChannel.label} →`
                    : selectedChannel.type === "email"
                      ? "Aggiungi l'indirizzo email del mittente sospetto →"
                      : selectedChannel.type === "social"
                        ? `Aggiungi il profilo ${selectedChannel.label} sospetto →`
                        : "Aggiungi l'URL del sito truffaldino →"}
                </span>
              </button>
            )}
        </div>

        <NavButtons onBack={onBack} onNext={onNext} />
      </div>

      {showModal && pendingChannel && (
        <ContactEvidenceModal
          channel={pendingChannel}
          value={contactEvidence}
          onChange={setContactEvidence}
          onConfirm={handleModalConfirm}
          onSkip={handleModalSkip}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

// Step 3 — Dati opzionali
function StepOptional({
  age,
  setAge,
  location,
  setLocation,
  amountRange,
  setAmountRange,
  priorSearch,
  setPriorSearch,
  onBack,
  onNext,
}) {
  const PRIOR_SEARCH_OPTIONS = [
    {
      id: "found",
      label: "Sì, e ho trovato altre segnalazioni",
      icon: "🔴",
      sublabel: "Il contatto era già noto come truffaldino",
    },
    {
      id: "not_found",
      label: "Sì, ma non ho trovato niente",
      icon: "🔍",
      sublabel: "Ho cercato ma non c'era nulla online",
    },
    {
      id: "no_search",
      label: "No, non ho cercato",
      icon: "➡️",
      sublabel: "Non sapevo dove o come cercare",
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
        Tutti i campi sono facoltativi. Ci aiutano a capire meglio il fenomeno.
      </p>

      {/* Micro-survey: ricerca preventiva */}
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">
          Prima di segnalare, hai cercato online questo contatto?
        </h4>
        <p className="text-xs text-slate-400 mb-3">
          Es. il numero di telefono, l'email o il sito su Google o altri motori
        </p>
        <div className="space-y-2">
          {PRIOR_SEARCH_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                setPriorSearch(priorSearch === opt.id ? null : opt.id)
              }
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                priorSearch === opt.id
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg leading-none flex-shrink-0">
                {opt.icon}
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-xs font-semibold leading-tight ${priorSearch === opt.id ? "text-teal-800" : "text-slate-700"}`}
                >
                  {opt.label}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5 leading-tight">
                  {opt.sublabel}
                </span>
              </div>
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                  priorSearch === opt.id
                    ? "border-teal-500 bg-teal-500"
                    : "border-slate-300 bg-white"
                }`}
              >
                {priorSearch === opt.id && (
                  <svg
                    viewBox="0 0 16 16"
                    fill="white"
                    className="w-full h-full p-0.5"
                  >
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Insight contestuale */}
        {priorSearch === "not_found" && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-base mt-0.5">💡</span>
            <p className="text-xs text-amber-800">
              La tua segnalazione potrebbe essere la <strong>prima</strong> su
              questo contatto. Aiuterà altri utenti a non cadere nella stessa
              truffa.
            </p>
          </div>
        )}
        {priorSearch === "found" && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-base mt-0.5">📊</span>
            <p className="text-xs text-blue-800">
              Perfetto. La tua segnalazione si aggiungerà a quelle esistenti e{" "}
              <strong>rafforzerà il segnale</strong> per questo contatto.
            </p>
          </div>
        )}
        {priorSearch === "no_search" && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-base mt-0.5">🔎</span>
            <p className="text-xs text-slate-600">
              In futuro potrai usare ScamReact per verificare un contatto{" "}
              <strong>prima</strong> di rispondere — stiamo costruendo questa
              funzione.
            </p>
          </div>
        )}
      </div>

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
  contactEvidence,
  channel,
  consent,
  setConsent,
  onBack,
  onSubmit,
  loading,
  error,
}) {
  const selectedChannel = CHANNELS.find((c) => c.id === channel);

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

      {/* Contact evidence recap */}
      {contactEvidence && selectedChannel && (
        <div className="flex items-center gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <span className="text-base">
            {selectedChannel.type === "phone" ? "📱" : "🌐"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-800">
              {selectedChannel.type === "phone"
                ? "Numero segnalato"
                : "Sito segnalato"}
            </p>
            <p className="text-xs font-mono text-blue-700 truncate">
              {contactEvidence}
            </p>
          </div>
          <span className="text-[10px] text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
            pubblico
          </span>
        </div>
      )}

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
  contactEvidence: "",
  age: "",
  location: "",
  amountRange: "na",
  priorSearch: null, // "found" | "not_found" | "no_search"
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
          contactEvidence: form.contactEvidence || undefined,
          amountRange: form.amountRange,
          priorSearch: form.priorSearch || undefined,
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
            setChannel={(ch) => {
              set("channel")(ch);
              // Reset evidence solo se il nuovo canale non raccoglie prove
              const newCh = CHANNELS.find((c) => c.id === ch);
              if (!newCh || newCh.type === "none") set("contactEvidence")("");
            }}
            contactEvidence={form.contactEvidence}
            setContactEvidence={set("contactEvidence")}
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
            priorSearch={form.priorSearch}
            setPriorSearch={set("priorSearch")}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <StepConfirm
            redacted={redacted}
            contactEvidence={form.contactEvidence}
            channel={form.channel}
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
