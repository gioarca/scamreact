import React, { useState, useEffect } from "react";

// ============================================================================
// CONFIG
// ============================================================================

const STORAGE_KEY = "scamreact_verify_voted";
const COUNTER_KEY = "scamreact_verify_count";
const BASE_COUNT = 47; // seed credibile per il lancio

// ============================================================================
// UTILITIES
// ============================================================================

function getCount() {
  try {
    const stored = localStorage.getItem(COUNTER_KEY);
    return stored ? parseInt(stored, 10) : BASE_COUNT;
  } catch {
    return BASE_COUNT;
  }
}

function hasVoted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveVote() {
  try {
    const next = getCount() + 1;
    localStorage.setItem(COUNTER_KEY, String(next));
    localStorage.setItem(STORAGE_KEY, "1");
    return next;
  } catch {
    return getCount() + 1;
  }
}

// ============================================================================
// ANIMATED COUNTER
// ============================================================================

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let start = display;
    if (start === value) return;
    const step = value > start ? 1 : -1;
    const interval = setInterval(() => {
      start += step;
      setDisplay(start);
      if (start === value) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [value]);

  return <span>{display}</span>;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function VerifyPage() {
  const [count, setCount] = useState(BASE_COUNT);
  const [voted, setVoted] = useState(false);
  const [justVoted, setJustVoted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(getCount());
    setVoted(hasVoted());
  }, []);

  function handleVote() {
    if (voted) return;
    const next = saveVote();
    setCount(next);
    setVoted(true);
    setJustVoted(true);
  }

  return (
    <section className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-20">
      {/* Card principale */}
      <div className="w-full max-w-lg">
        {/* Badge WIP */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            In costruzione
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-5">🔍</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            Verifica un contatto
            <br />
            <span className="text-teal-600">prima di rispondere</span>
          </h1>
          <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed">
            Stai per ricevere un pagamento sospetto? Hai ricevuto un SMS strano?
            Presto potrai cercare numeri, email e siti web già segnalati dalla
            community.
          </p>
        </div>

        {/* Feature preview pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { icon: "📱", text: "Numeri di telefono" },
            { icon: "📧", text: "Indirizzi email" },
            { icon: "🌐", text: "Siti web" },
            { icon: "📊", text: "Storico segnalazioni" },
          ].map((f) => (
            <div
              key={f.text}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm"
            >
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Counter + CTA card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Counter */}
          <div className="px-6 pt-8 pb-6 text-center border-b border-slate-100">
            <div
              className={`text-6xl font-black tracking-tight mb-1 transition-colors duration-500 ${
                justVoted ? "text-teal-600" : "text-slate-900"
              }`}
            >
              <AnimatedNumber value={count} />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {count === 1
                ? "persona vuole questa funzione"
                : "persone vogliono questa funzione"}
            </p>
          </div>

          {/* CTA */}
          <div className="px-6 py-6 space-y-3">
            {!voted ? (
              <>
                <button
                  onClick={handleVote}
                  className="w-full py-4 rounded-xl font-bold text-base bg-teal-600 text-white hover:bg-teal-700 active:scale-95 transition-all shadow-sm shadow-teal-200"
                >
                  🙋 Anch'io la voglio
                </button>
                <p className="text-center text-xs text-slate-400">
                  Nessun account richiesto · voto anonimo
                </p>
              </>
            ) : (
              <div
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-300 ${
                  justVoted
                    ? "border-teal-300 bg-teal-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <span className="text-2xl">{justVoted ? "🎉" : "✓"}</span>
                <p className="text-sm font-semibold text-slate-700">
                  {justVoted
                    ? "Voto registrato, grazie!"
                    : "Hai già votato da questo dispositivo"}
                </p>
                <p className="text-xs text-slate-400 text-center max-w-xs">
                  Ti terremo aggiornato quando la funzione sarà disponibile.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Divider con testo */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">
            Nel frattempo
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Fallback utile */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-700 mb-3">
            Puoi già controllare un contatto su queste fonti esterne:
          </p>
          {[
            {
              name: "Commissariato di P.S. Online",
              url: "https://www.commissariatodips.it",
              desc: "Portale ufficiale della Polizia Postale",
              icon: "🛡️",
            },
            {
              name: "Truecaller",
              url: "https://www.truecaller.com",
              desc: "Ricerca numeri di telefono sospetti",
              icon: "📞",
            },
            {
              name: "VirusTotal",
              url: "https://www.virustotal.com",
              desc: "Analisi URL e siti web malevoli",
              icon: "🔬",
            },
          ].map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition-all group"
            >
              <span className="text-xl shrink-0">{r.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {r.name}
                </span>
                <span className="block text-[11px] text-slate-400">
                  {r.desc}
                </span>
              </div>
              <svg
                className="w-4 h-4 text-slate-300 group-hover:text-teal-400 shrink-0 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ))}
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <a
            href="/#form"
            className="text-sm text-slate-400 hover:text-teal-600 transition-colors font-medium"
          >
            ← Torna a segnalare una truffa
          </a>
        </div>
      </div>
    </section>
  );
}
