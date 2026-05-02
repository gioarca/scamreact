import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Mail,
  Phone,
  Globe,
  X,
  Check,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react";

// ─────────────────────────────────────────────
// DATI
// ─────────────────────────────────────────────

const STATS = [
  { label: "Richieste analizzate", value: "8.412", icon: "📊" },
  { label: "Truffe rilevate", value: "1.243", icon: "🚨" },
  { label: "Tasso di rilevamento", value: "94,7%", icon: "🎯" },
];

const BENEFITS = [
  { text: "Analisi del testo e della fonte (email, numero, sito)", icon: "🔍" },
  { text: "Punteggio di rischio con spiegazione dei segnali", icon: "📈" },
  { text: "Storico delle verifiche effettuate", icon: "🗂️" },
];

const INITIAL_FORM = {
  srcEmail: "",
  srcPhone: "",
  srcWebsite: "",
  srcMessage: "",
  userEmail: "",
};

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function Field({ label, optional, hint, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
        {optional && (
          <span className="text-slate-400 font-normal ml-1">(opzionale)</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
          <Lock size={10} className="flex-shrink-0" /> {hint}
        </p>
      )}
    </div>
  );
}

function InputWithIcon({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={13}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        className="w-full pl-9 pr-3 h-10 rounded-xl border-2 border-slate-200 text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
        {...props}
      />
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

// ─────────────────────────────────────────────
// MODALE WAITLIST
// ─────────────────────────────────────────────

function WaitlistModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    // TODO: await fetch("/api/waitlist", { method: "POST", body: JSON.stringify(form) })
    await new Promise((r) => setTimeout(r, 700)); // simula latenza
    console.log("Waitlist:", form);
    setLoading(false);
    onSuccess(form.userEmail);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{
          animation: "srModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          maxHeight: "92vh",
        }}
      >
        {/* Handle mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header fisso */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Sparkles size={16} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Accesso anticipato
              </h2>
              <p className="text-[11px] text-slate-400">
                Ti avvisiamo al lancio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body scrollabile */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {/* Avviso privacy */}
          <div className="flex items-start gap-2.5 p-3 bg-teal-50 border border-teal-200 rounded-xl mb-5">
            <Lock size={13} className="text-teal-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-teal-800 leading-relaxed">
              Puoi condividere un contatto sospetto che hai già ricevuto. Nessun
              dato personale tuo viene salvato.
            </p>
          </div>

          {/* Sorgente sospetta */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Contatto sospetto ricevuto
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
            <Field label="Email mittente sospetta" optional>
              <InputWithIcon
                icon={Mail}
                type="email"
                placeholder="noreply@fake-bank.it"
                value={form.srcEmail}
                onChange={(e) => set("srcEmail", e.target.value)}
              />
            </Field>
            <Field label="Numero sospetto" optional>
              <InputWithIcon
                icon={Phone}
                type="tel"
                placeholder="+39 333 000 0000"
                value={form.srcPhone}
                onChange={(e) => set("srcPhone", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Sito web sospetto" optional>
            <InputWithIcon
              icon={Globe}
              type="url"
              placeholder="www.sito-sospetto.com"
              value={form.srcWebsite}
              onChange={(e) => set("srcWebsite", e.target.value)}
            />
          </Field>

          <Field label="Testo del messaggio ricevuto" optional>
            <textarea
              rows={3}
              placeholder="Incolla qui il messaggio sospetto che hai ricevuto…"
              value={form.srcMessage}
              onChange={(e) => set("srcMessage", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 transition-colors resize-none"
            />
          </Field>

          <Divider label="il tuo contatto" />

          <Field
            label="La tua email"
            optional
            hint="Solo per avvisarti al lancio. Zero spam, promesso."
          >
            <InputWithIcon
              icon={Mail}
              type="email"
              placeholder="la-tua@email.it"
              value={form.userEmail}
              onChange={(e) => set("userEmail", e.target.value)}
            />
          </Field>
        </div>

        {/* Footer fisso */}
        <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60 transition-all shadow-md shadow-teal-100"
          >
            {loading ? (
              <>
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
                Invio in corso…
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Voglio provare per primo
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes srModalIn {
          from { transform: translateY(48px) scale(0.97); opacity: 0; }
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
    // Naviga alla ThankYouPage passando fonte="waitlist" e l'email
    // ThankYouPage legge location.state per attivare i confetti
    navigate("/grazie", {
      state: {
        source: "waitlist",
        email: email || null,
        confetti: true,
      },
    });
  }

  return (
    <div className="py-8 space-y-8">
      {/* ── KPI ── */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Dashboard · Scamreact
        </p>
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm group hover:border-teal-200 hover:shadow-teal-50 transition-all"
            >
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature card ── */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Prossimamente
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Accent bar */}
          <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300" />

          <div className="p-5 sm:p-6 space-y-5">
            {/* Badge + heading */}
            <div className="flex items-start gap-4 justify-between">
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  In sviluppo · Accesso anticipato
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1.5">
                  Verifica richiesta
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Incolla un messaggio sospetto ricevuto: Scamreact analizza
                  testo e fonte per dirti se è una truffa, prima che tu
                  risponda.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-100">
                <Search size={20} className="text-white" />
              </div>
            </div>

            {/* Benefits */}
            <ul className="space-y-2.5">
              {BENEFITS.map((b) => (
                <li key={b.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0 text-sm">
                    {b.icon}
                  </div>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Anteprima */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Anteprima funzione
                </p>
              </div>

              {/* Messaggio finto */}
              <div className="bg-white rounded-xl border-l-[3px] border-red-300 px-3 py-3 shadow-sm">
                <p className="text-xs text-slate-500 italic leading-relaxed">
                  "Congratulazioni! Sei stato selezionato per ricevere un
                  rimborso di €840. Clicca qui entro 24 ore per riscuotere…"
                </p>
              </div>

              {/* Verdetto */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Probabile truffa
                </span>
                <span className="text-xs font-bold text-slate-700">
                  97<span className="font-normal text-slate-400">/100</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ⚡ Urgenza artificiale · rimborso non richiesto · link sospetto
              </p>

              <div className="h-px bg-slate-200" />

              {/* Campi disabilitati — preview */}
              <p className="text-[10px] text-slate-400 font-medium">
                Fonte del messaggio (attiva al lancio)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    icon: Mail,
                    ph: "noreply@fake-bank.it",
                    label: "Email mittente",
                  },
                  { icon: Phone, ph: "+39 02 0000000", label: "Numero" },
                ].map(({ icon: Icon, ph, label }) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-400 mb-1">{label}</p>
                    <div className="relative">
                      <Icon
                        size={11}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                      <input
                        disabled
                        placeholder={ph}
                        className="w-full h-8 pl-7 pr-2 rounded-xl border border-slate-200 text-xs text-slate-300 bg-white/80 placeholder:text-slate-300 cursor-not-allowed"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] text-slate-400 mb-1">
                  Sito web sospetto
                </p>
                <div className="relative">
                  <Globe
                    size={11}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    disabled
                    placeholder="www.rimborso-immediato.it"
                    className="w-full h-8 pl-7 pr-2 rounded-xl border border-slate-200 text-xs text-slate-300 bg-white/80 placeholder:text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 mb-1">
                  Testo del messaggio
                </p>
                <textarea
                  disabled
                  rows={2}
                  placeholder="Incolla qui il testo ricevuto…"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-300 bg-white/80 placeholder:text-slate-300 resize-none cursor-not-allowed"
                />
              </div>

              <p className="text-[10px] text-slate-400 italic">
                La fonte aiuta l'AI a rilevare pattern ricorrenti tra le
                segnalazioni.
              </p>
            </div>

            {/* Contatore interesse */}
            <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-2xl">
              <div className="flex -space-x-2">
                {["#0f6e56", "#1d9e75", "#5dcaa5", "#9fe1cb"].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: c, zIndex: 4 - i }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-teal-800 font-medium">
                <span className="font-black text-teal-700">47 persone</span>{" "}
                hanno già richiesto l'accesso anticipato
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-between w-full px-5 py-4 rounded-2xl text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] transition-all shadow-md shadow-teal-100 group"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} />
                Voglio provare per primo
              </span>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
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
