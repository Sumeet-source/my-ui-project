import { useState, useEffect, useRef } from "react";

const INFINITY_PATH =
  "M10,30 C10,16 25,16 32,30 C39,44 54,44 54,30 C54,16 39,16 32,30 C25,44 10,44 10,30 Z";

export default function AnimatedInfinityLogo({ className = "", style = {} }) {
  const [drawn, setDrawn] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const pathRef = useRef(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reduceMotion.current) {
      setDrawn(true);
      return;
    }
    setDrawn(false);
    const t = setTimeout(() => setDrawn(true), 120);
    return () => clearTimeout(t);
  }, [trigger]);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;

    if (reduceMotion.current) {
      el.style.transition = "none";
      el.style.strokeDashoffset = drawn ? "0" : `${len}`;
      return;
    }

    if (!drawn) {
      el.style.transition = "none";
      el.style.strokeDashoffset = `${len}`;
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!pathRef.current) return;
          pathRef.current.style.transition =
            "stroke-dashoffset 1.3s cubic-bezier(0.65,0,0.35,1)";
          pathRef.current.style.strokeDashoffset = "0";
        });
      });
    }
  }, [drawn]);

  const replay = () => setTrigger((t) => t + 1);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        cursor: "pointer",
        ...style,
      }}
      role="button"
      tabIndex={0}
      aria-label="Infinity logo. Press to replay the draw-in animation."
      onMouseEnter={replay}
      onClick={replay}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          replay();
        }
      }}
    >
      <style>{`
        @keyframes flowDash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -48; }
        }
        .flow-path {
          animation: flowDash 2.2s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .flow-path { animation: none !important; }
        }
        .infinity-logo-root:focus-visible {
          outline: 2px solid #4A4A4A;
          outline-offset: 14px;
          border-radius: 4px;
        }
      `}</style>

      <div
        className="infinity-logo-root"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 64 60"
          style={{
            width: "100%",
            height: "100%",
            filter: "none",
            transition: "filter 0.7s ease",
          }}
        >
          <defs>
            <linearGradient id="emberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {/* 🟢 Color ko #4A4A4A (Medium Gray / Light Black) kar diya */}
              <stop offset="0%" stopColor="#4A4A4A" />
              <stop offset="100%" stopColor="#4A4A4A" />
            </linearGradient>
          </defs>

          {/* faint base track (slightly darker gray) */}
          <path
            d={INFINITY_PATH}
            fill="none"
            stroke="#2A2B2E"
            strokeWidth="6" // 🟢 Patla kiya (8 se 6)
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* animated draw-in stroke (Thin & Light Gray) */}
          <path
            ref={pathRef}
            d={INFINITY_PATH}
            fill="none"
            stroke="url(#emberGradient)"
            strokeWidth="6" // 🟢 Patla kiya (8 se 6)
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* continuous flowing spark trail (Patla aur same color) */}
          <path
            d={INFINITY_PATH}
            fill="none"
            stroke="#555555" 
            strokeWidth="2" // 🟢 Patla kiya (2.8 se 2)
            strokeLinecap="round"
            strokeDasharray="9 15"
            className={drawn ? "flow-path" : ""}
            style={{
              opacity: drawn ? 0.85 : 0,
              transition: "opacity 0.6s ease 1s",
            }}
          />
        </svg>
      </div>
    </div>
  );
}