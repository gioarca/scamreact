import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

// ─────────────────────────────────────────────
// CONFETTI CANVAS
// Intensità configurabile: normale (segnalazione) o burst (waitlist)
// ─────────────────────────────────────────────

function Particles({ burst = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = burst
      ? [
          "#0f6e56",
          "#1d9e75",
          "#5dcaa5",
          "#9fe1cb",
          "#e1f5ee",
          "#facc15",
          "#fb923c",
          "#f472b6",
          "#a78bfa",
        ]
      : [
          "#0f6e56",
          "#1d9e75",
          "#5dcaa5",
          "#9fe1cb",
          "#e1f5ee",
          "#facc15",
          "#fb923c",
        ];

    const count = burst ? 120 : 60;

    const particles = Array.from({ length: count }, (_, i) => ({
      x: burst ? Math.random() * canvas.width : Math.random() * canvas.width,
      // In burst mode i primi 40 partono dal centro per l'effetto esplosione iniziale
      y: burst && i < 40 ? canvas.height * 0.35 : -20 - Math.random() * 200,
      r: burst ? 4 + Math.random() * 7 : 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: burst
        ? i < 40
          ? -8 - Math.random() * 8
          : 1.5 + Math.random() * 3
        : 1.2 + Math.random() * 2.5,
      swing: (Math.random() * 3 - 1.5) * (burst ? 1.5 : 1),
      angle: Math.random() * Math.PI * 2,
      rot: (Math.random() - 0.5) * (burst ? 0.18 : 0.12),
      opacity: 0.8 + Math.random() * 0.2,
      shape: ["rect", "circle", "triangle"][
        Math.floor(Math.random() * (burst ? 3 : 2))
      ],
      gravity: burst && i < 40 ? 0.18 : 0,
      vx: burst && i < 40 ? (Math.random() - 0.5) * 14 : 0,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        // Fisica burst: esplosione iniziale poi caduta
        if (p.gravity > 0) {
          p.speed += p.gravity;
          p.x += p.vx;
          p.vx *= 0.98;
        }
        p.y += p.speed;
        p.x += Math.sin(p.angle) * p.swing * 0.6;
        p.angle += 0.04;
        p.angle += p.rot;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.speed = 1.5 + Math.random() * 2.5;
          p.gravity = 0;
          p.vx = 0;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "triangle") {
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.lineTo(p.r, p.r);
          ctx.lineTo(-p.r, p.r);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [burst]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ opacity: burst ? 0.75 : 0.55 }}
    />
  );
}

// ─────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────

function CountUp({ end, duration = 1800 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return <>{val.toLocaleString("it-IT")}</>;
}

// ─────────────────────────────────────────────
// STAT BADGE
// ─────────────────────────────────────────────

function StatBadge({ value, label, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className="flex flex-col items-center px-5 py-4 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <span className="text-3xl font-black text-white tracking-tight">
        {visible ? <CountUp end={value} /> : "0"}
      </span>
      <span className="text-[11px] text-teal-200 mt-1 font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// COPY BUTTON
// ─────────────────────────────────────────────

function CopyButton() {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard?.writeText("https://scamreact.it").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: copied ? "rgba(29,158,117,0.25)" : "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: copied ? "#9fe1cb" : "white",
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copiato!" : "Copia link"}
    </button>
  );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

export default function ThankYouPage() {
  const { state } = useLocation();
  const isWaitlist = state?.source === "waitlist";
  const hasConfetti = state?.confetti === true;
  const userEmail = state?.email;

  const [heroVisible, setHeroVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroVisible(true), 100);
    const t2 = setTimeout(() => setCardVisible(true), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Testi contestuali in base alla fonte
  const copy = isWaitlist
    ? {
        badge: "Iscrizione ricevuta",
        h1First: "Sei in lista.",
        h1Second: "Ti ricordiamo noi.",
        sub: "Sei tra i primi a voler testare la funzione Verifica. Appena pronta, sarai tra i primi a sapere.",
        sub2: userEmail
          ? `Ti contatteremo su ${userEmail} non appena la funzione sarà disponibile.`
          : "Ti contatteremo non appena la funzione sarà disponibile.",
        stepTitle: "Cosa succede adesso?",
        steps: [
          {
            text: "La tua richiesta di accesso anticipato è stata registrata",
            color: "#1d9e75",
          },
          {
            text: "Quando la funzione Verifica sarà pronta, ti avvisiamo per primi",
            color: "#0f6e56",
          },
          {
            text: "Il tuo feedback nei beta test migliorerà lo strumento per tutti",
            color: "#085041",
          },
        ],
      }
    : {
        badge: "Segnalazione ricevuta",
        h1First: "Grazie per",
        h1Second: "proteggerci.",
        sub: "La tua segnalazione è stata registrata in modo sicuro e anonimo.",
        sub2: "Ogni voce conta. Insieme costruiamo una rete di difesa collettiva contro le truffe online.",
        stepTitle: "Cosa succede adesso?",
        steps: [
          {
            text: "La segnalazione viene analizzata e aggiunta al database pubblico",
            color: "#1d9e75",
          },
          {
            text: "Altri utenti potranno trovare questo schema di truffa e difendersi",
            color: "#0f6e56",
          },
          {
            text: "I dati aggregati aiutano a identificare nuove ondate di truffe",
            color: "#085041",
          },
        ],
      };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0a1628" }}
    >
      {/* ── HERO ── */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Sfondo radiale */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isWaitlist
              ? "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(91,33,182,0.35) 0%, rgba(15,110,86,0.25) 40%, rgba(10,22,40,0) 70%)"
              : "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(15,110,86,0.45) 0%, rgba(10,22,40,0) 70%)",
          }}
        />

        {/* Confetti — burst se da waitlist */}
        <Particles burst={hasConfetti || isWaitlist} />

        {/* Contenuto hero */}
        <div
          className="relative z-10 text-center max-w-lg mx-auto"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* Icona */}
          <div className="flex justify-center mb-8">
            <div
              className="relative"
              style={{ animation: "floatShield 3s ease-in-out infinite" }}
            >
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{
                  background: isWaitlist
                    ? "linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #1d9e75 100%)"
                    : "linear-gradient(135deg, #0f6e56 0%, #1d9e75 100%)",
                  boxShadow: isWaitlist
                    ? "0 0 60px rgba(124,58,237,0.5), 0 0 120px rgba(29,158,117,0.2)"
                    : "0 0 60px rgba(29,158,117,0.5), 0 0 120px rgba(29,158,117,0.2)",
                }}
              >
                {isWaitlist ? (
                  <Sparkles size={48} color="white" strokeWidth={1.5} />
                ) : (
                  <ShieldCheck size={48} color="white" strokeWidth={2} />
                )}
              </div>
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  border: `2px solid rgba(${isWaitlist ? "124,58,237" : "29,158,117"},0.5)`,
                  animation: "pulseRing 2s ease-out infinite",
                }}
              />
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  border: `2px solid rgba(${isWaitlist ? "124,58,237" : "29,158,117"},0.3)`,
                  animation: "pulseRing 2s ease-out 0.6s infinite",
                }}
              />
            </div>
          </div>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{
              background: "rgba(29,158,117,0.2)",
              border: "1px solid rgba(29,158,117,0.4)",
              color: "#5dcaa5",
            }}
          >
            {copy.badge}
          </div>

          {/* Titolo */}
          <h1
            className="font-black text-white mb-4 leading-none"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
              letterSpacing: "-0.03em",
            }}
          >
            {copy.h1First}
            <br />
            <span style={{ color: isWaitlist ? "#a78bfa" : "#5dcaa5" }}>
              {copy.h1Second}
            </span>
          </h1>

          <p
            className="text-lg leading-relaxed mb-2"
            style={{ color: "#9fe1cb" }}
          >
            {copy.sub}
          </p>
          <p className="text-base" style={{ color: "rgba(159,225,203,0.6)" }}>
            {copy.sub2}
          </p>
        </div>

        {/* Stats */}
        <div
          className="relative z-10 grid grid-cols-3 gap-3 max-w-sm mx-auto w-full mt-12"
          style={{
            opacity: heroVisible ? 1 : 0,
            transition: "opacity 0.5s ease 0.4s",
          }}
        >
          <StatBadge value={3847} label="segnalazioni totali" delay={700} />
          <StatBadge value={12} label="truffe identificate" delay={900} />
          <StatBadge value={94} label="utenti protetti oggi" delay={1100} />
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{
            animation: "bounce 2s ease-in-out infinite",
            color: "rgba(93,202,165,0.4)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 14l-6-6h12l-6 6z" />
          </svg>
        </div>
      </div>

      {/* ── CARD AZIONI ── */}
      <div
        className="relative z-10 px-4 pb-16"
        style={{
          background: "#0d1f38",
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="max-w-lg mx-auto pt-12 space-y-4">
          {/* Cosa succede ora */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h2 className="text-white font-bold text-base mb-4">
              {copy.stepTitle}
            </h2>
            <div className="space-y-3">
              {copy.steps.map(({ text, color }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white mt-0.5"
                    style={{ background: color }}
                  >
                    {i + 1}
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(159,225,203,0.8)" }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Condividi */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(29,158,117,0.12)",
              border: "1px solid rgba(29,158,117,0.25)",
            }}
          >
            <h2 className="text-white font-bold text-base mb-1">
              Diffondi il progetto
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: "rgba(159,225,203,0.7)" }}
            >
              Più persone conoscono ScamReact, più la rete di protezione si
              allarga.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://wa.me/?text=Ho%20scoperto%20ScamReact.it%20%E2%80%94%20uno%20strumento%20gratuito%20per%20difenderci%20dalle%20truffe%20online.%20Vale%20la%20pena%20conoscerlo!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#25D366", color: "white" }}
              >
                <Share2 size={14} />
                WhatsApp
              </a>
              <CopyButton />
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {isWaitlist ? (
              <Link
                to="/verifica"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Torna alla pagina Verifica
              </Link>
            ) : (
              <Link
                to="/#form"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Nuova segnalazione
              </Link>
            )}
            <Link
              to="/scams"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #0f6e56 0%, #1d9e75 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(15,110,86,0.4)",
              }}
            >
              Sfoglia le truffe
              <ArrowRight size={14} />
            </Link>
          </div>

          <p
            className="text-center text-xs pt-4"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            {isWaitlist
              ? "Email usata solo per notifica lancio · zero spam"
              : "Nessun dato personale è stato salvato · segnalazione anonima"}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes floatShield {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </div>
  );
}
