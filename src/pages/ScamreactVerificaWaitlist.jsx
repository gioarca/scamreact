import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  Search,
  Mail,
  Phone,
  Globe,
  X,
  ChevronRight,
  Sparkles,
  Lock,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";

// ─────────────────────────────────────────────
// DATI
// ─────────────────────────────────────────────

const STATS = [
  {
    label: "Richieste analizzate",
    value: "8.412",
    icon: TrendingUp,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    label: "Truffe rilevate",
    value: "1.243",
    icon: Shield,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    label: "Tasso rilevamento",
    value: "94,7%",
    icon: Clock,
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
];

const BENEFITS = [
  { text: "Analisi del testo e della fonte (email, numero, sito)", icon: "🔍" },
  { text: "Punteggio di rischio con spiegazione dei segnali", icon: "📈" },
  { text: "Storico delle verifiche effettuate", icon: "🗂️" },
];

// ─────────────────────────────────────────────
// PRIMITIVI
// ─────────────────────────────────────────────

function Field({ label, optional, hint, children }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wide">
        {label}
        {optional && (
          <span className="text-slate-400 font-normal ml-1.5">(opzionale)</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          <Lock size={10} className="flex-shrink-0" />
          {hint}
        </p>
      )}
    </div>
  );
}

function InputWithIcon({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-all"
        {...props}
      />
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

// ─────────────────────────────────────────────
// MODALE WAITLIST
// ─────────────────────────────────────────────
//
// Usa emailjs.sendForm() che legge i valori direttamente
// dagli attributi `name` degli input nel DOM — stesso
// pattern di BorgoForm. I name dei campi devono corrispondere
// esattamente alle variabili del tuo template EmailJS:
//   {{src_email}}, {{src_phone}}, {{src_website}},
//   {{src_message}}, {{user_email}}
//
// ⚠️  Non scrivere mai queste chiavi direttamente nel codice.
//     Crea un file .env nella root del progetto con:
//
//       VITE_EMAILJS_SERVICE_ID=service_abc123
//       VITE_EMAILJS_TEMPLATE_ID=template_xyz789
//       VITE_EMAILJS_PUBLIC_KEY=nBwk1Dh-6_dCdi75H
//
//     Assicurati che .env sia nel .gitignore.
//     Vite espone solo le variabili con prefisso VITE_ al frontend.

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function WaitlistModal({ onClose, onSuccess }) {
  // Ref al <form> HTML — emailjs.sendForm() ne legge i campi via DOM
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Teniamo ancora lo stato React per il valore dell'email utente,
  // che serve passare a onSuccess() per personalizzare la ThankYouPage.
  const [userEmail, setUserEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    emailjs
      .sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setLoading(false);
        // Passa l'email a onSuccess così ThankYouPage può
        // personalizzare il messaggio ("ti contatteremo su ...")
        onSuccess(userEmail);
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        setError("Invio fallito. Riprova tra qualche secondo.");
        setLoading(false);
      });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(10,16,30,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          maxHeight: "94vh",
          animation: "modalIn 0.32s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Striscia colorata in cima */}
        <div className="h-1.5 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400 flex-shrink-0" />

        {/* Handle drag mobile */}
        <div className="flex justify-center pt-2 pb-0 sm:hidden flex-shrink-0">
          <div className="w-8 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 flex-shrink-0">
          <div>
            <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest mb-1">
              Accesso anticipato
            </p>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Voglio provare per primo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — è un vero <form> HTML così emailjs.sendForm()
              può leggere i campi tramite i loro attributi `name` */}
        <form
          ref={formRef}
          id="waitlist-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto px-7 flex-1"
        >
          <p className="text-sm text-slate-500 leading-relaxed mb-6 pb-6 border-b border-slate-100">
            Registra il tuo interesse — ti avvisiamo tra i primi quando la
            funzione Verifica sarà disponibile. Puoi anche condividere un
            contatto sospetto che hai ricevuto: ci aiuta a migliorare il
            rilevamento.
          </p>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Contatto sospetto (opzionale)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            {/* name="src_email" → variabile {{src_email}} nel template EmailJS */}
            <Field label="Email mittente" optional>
              <InputWithIcon
                icon={Mail}
                type="email"
                name="src_email"
                placeholder="noreply@fake-bank.it"
              />
            </Field>
            {/* name="src_phone" → {{src_phone}} */}
            <Field label="Numero di telefono" optional>
              <InputWithIcon
                icon={Phone}
                type="tel"
                name="src_phone"
                placeholder="+39 333 000 0000"
              />
            </Field>
          </div>

          {/* name="src_website" → {{src_website}} */}
          <Field label="Sito web sospetto" optional>
            <InputWithIcon
              icon={Globe}
              type="url"
              name="src_website"
              placeholder="www.sito-sospetto.com"
            />
          </Field>

          {/* name="src_message" → {{src_message}} */}
          <Field label="Messaggio ricevuto" optional>
            <textarea
              name="src_message"
              rows={3}
              placeholder="Incolla qui il testo del messaggio sospetto…"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-all resize-none"
            />
          </Field>

          <Divider label="il tuo contatto" />

          {/* name="user_email" → {{user_email}} nel template.
              Teniamo anche onChange per passare il valore a onSuccess(). */}
          <Field
            label="La tua email"
            optional
            hint="Solo per avvisarti al lancio. Zero spam, mai."
          >
            <InputWithIcon
              icon={Mail}
              type="email"
              name="user_email"
              placeholder="la-tua@email.it"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Field>

          {/* Messaggio di errore se EmailJS fallisce */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              ⚠️ {error}
            </p>
          )}

          <div className="h-2" />
        </form>

        {/* Footer — il button è type="submit" così triggera onSubmit del form */}
        <div className="px-7 py-5 border-t border-slate-100 flex-shrink-0 bg-white">
          <button
            type="submit"
            form="waitlist-form"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {loading ? (
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <Sparkles size={15} />
            )}
            {loading ? "Invio in corso…" : "Invia richiesta"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { transform: translateY(40px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPALE
// ─────────────────────────────────────────────

export default function ScamreactVerificaWaitlist() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  function handleSuccess(email) {
    setModalOpen(false);
    navigate("/grazie", {
      state: { source: "waitlist", email: email || null, confetti: true },
    });
  }

  return (
    /*
      Padding orizzontale generoso: px-6 su mobile, px-0 su container
      così il contenuto respira su tutti gli schermi.
    */
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12 space-y-14">
      {/* ── INTESTAZIONE EDITORIALE ── */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-teal-600 uppercase tracking-[0.15em]">
          Dashboard · Scamreact
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
          Riconosci una truffa
          <br />
          <span className="text-teal-600">prima di caderne vittima.</span>
        </h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-lg">
          Stiamo costruendo uno strumento che analizza messaggi sospetti e ti
          dice — in pochi secondi — se stai per essere truffato.
        </p>
      </div>

      {/* ── KPI ── */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="group">
            <div
              className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}
            >
              <Icon size={16} className={color} strokeWidth={2} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {value}
            </div>
            <div className="text-xs text-slate-400 leading-snug">{label}</div>
          </div>
        ))}
      </div>

      {/* ── SEZIONE PROSSIMAMENTE ── */}
      <div className="space-y-8">
        {/* Etichetta sezione */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">
            Prossimamente
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Card principale */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* Header card con sfondo leggero */}
          <div className="px-7 pt-8 pb-7 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-100">
                <Search size={24} className="text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  In sviluppo · Accesso anticipato
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2 leading-tight">
                  Verifica richiesta
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Incolla un messaggio sospetto: Scamreact analizza testo e
                  fonte e ti dice se è una truffa prima che tu risponda.
                </p>
              </div>
            </div>
          </div>

          {/* Body card */}
          <div className="px-7 py-7 space-y-7">
            {/* Benefits */}
            <ul className="space-y-3.5">
              {BENEFITS.map((b) => (
                <li key={b.text} className="flex items-center gap-4">
                  <span className="text-lg leading-none flex-shrink-0">
                    {b.icon}
                  </span>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Anteprima — stile terminale/documento */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              {/* Barra titolo stile editor */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-[11px] text-slate-400 font-mono ml-1">
                  anteprima funzione
                </span>
              </div>

              <div className="bg-slate-950 px-5 py-5 space-y-4">
                {/* Messaggio in ingresso */}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
                    Messaggio ricevuto
                  </p>
                  <div className="bg-slate-800 rounded-xl px-4 py-3 border-l-2 border-slate-600">
                    <p className="text-xs text-slate-300 leading-relaxed italic font-mono">
                      "Congratulazioni! Sei stato selezionato per ricevere un
                      rimborso di €840. Clicca qui entro 24 ore per riscuotere…"
                    </p>
                  </div>
                </div>

                {/* Analisi */}
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-mono">
                    Analisi Scamreact
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Probabile truffa
                    </span>
                    <span className="text-xs font-black text-rose-400 font-mono">
                      97<span className="text-rose-600 font-normal">/100</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono leading-relaxed">
                    → urgenza artificiale &nbsp;·&nbsp; rimborso non richiesto
                    &nbsp;·&nbsp; link sospetto
                  </p>
                </div>

                {/* Campi fonte disabilitati */}
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[10px] text-slate-600 font-mono mb-3">
                    // fonte (disponibile al lancio)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { ph: "email mittente…" },
                      { ph: "numero telefono…" },
                    ].map(({ ph }) => (
                      <input
                        key={ph}
                        disabled
                        placeholder={ph}
                        className="h-7 px-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-700 placeholder:text-slate-700 font-mono cursor-not-allowed"
                      />
                    ))}
                  </div>
                  <input
                    disabled
                    placeholder="sito web sospetto…"
                    className="mt-2 w-full h-7 px-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-700 placeholder:text-slate-700 font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 py-5 border-t border-b border-slate-100">
              {/* Avatars */}
              <div className="flex -space-x-2.5 flex-shrink-0">
                {["#0f6e56", "#1d9e75", "#5dcaa5", "#9fe1cb", "#c7f2e6"].map(
                  (c, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: c, zIndex: 5 - i }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ),
                )}
              </div>
              <p className="text-sm text-slate-600 leading-snug">
                <span className="font-bold text-slate-900">47 persone</span>{" "}
                hanno già richiesto l'accesso anticipato alla funzione Verifica.
              </p>
            </div>

            {/* CTA principale */}
            <button
              onClick={() => setModalOpen(true)}
              className="group flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.99] transition-all"
            >
              <span className="flex items-center gap-3">
                <Sparkles size={17} />
                <span className="font-bold text-sm">
                  Voglio provare per primo
                </span>
              </span>
              <ChevronRight
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            {/* Note sotto la CTA */}
            <p className="text-center text-xs text-slate-400">
              Gratuito · Nessun account richiesto · Zero spam
            </p>
          </div>
        </div>
      </div>

      {/* Modale */}
      {modalOpen && (
        <WaitlistModal
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
