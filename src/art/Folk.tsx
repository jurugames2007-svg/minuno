export function Maria({ size = 90, wave = false }: { size?: number; wave?: boolean }) {
  return (
    <svg width={size * 0.55} height={size} viewBox="0 0 56 100" style={{ overflow: "visible" }}>
      <g style={{ transformOrigin: "28px 96px", animation: "bob 3.4s ease-in-out infinite" }}>
        <rect x="18" y="74" width="7" height="20" rx="2" fill="#5a3a6a" />
        <rect x="31" y="74" width="7" height="20" rx="2" fill="#5a3a6a" />
        <rect x="16" y="92" width="10" height="4" rx="1" fill="#3a2010" />
        <rect x="30" y="92" width="10" height="4" rx="1" fill="#3a2010" />
        <path d="M12 40 Q28 32 44 40 L46 76 Q28 82 10 76 Z" fill="#7a3a6a" stroke="#3a1830" strokeWidth="1.1" />
        <path d="M16 40 Q28 48 40 40 L38 50 Q28 56 18 50 Z" fill="#c9a86a" />
        <path d={wave ? "M44 42 Q54 28 50 18" : "M44 42 Q52 56 48 68"} stroke="#7a3a6a" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <circle cx={wave ? 50 : 48} cy={wave ? 18 : 68} r="3" fill="#e8c8a0" />
        <path d="M12 42 Q6 56 10 68" stroke="#7a3a6a" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <circle cx="10" cy="68" r="3" fill="#e8c8a0" />
        <circle cx="28" cy="22" r="11" fill="#e8c8a0" stroke="#7a4410" strokeWidth="0.7" />
        <path d="M17 20 Q18 8 28 7 Q38 8 39 20 Q40 26 36 28 Q32 14 28 14 Q24 14 20 28 Q16 24 17 20 Z" fill="#e8e4dc" />
        <circle cx="24" cy="22" r="1.2" fill="#3a1a08" />
        <circle cx="32" cy="22" r="1.2" fill="#3a1a08" />
        <path d="M24 28 q4 3 8 0" stroke="#7a4410" strokeWidth="1" fill="none" />
        <circle cx="23" cy="26" r="1.4" fill="#ff8fa0" opacity="0.5" />
        <circle cx="33" cy="26" r="1.4" fill="#ff8fa0" opacity="0.5" />
      </g>
    </svg>
  );
}

export function Abu({ size = 90 }: { size?: number }) {
  return (
    <svg width={size * 0.55} height={size} viewBox="0 0 56 100" style={{ overflow: "visible" }}>
      <g style={{ transformOrigin: "28px 96px", animation: "bob 3.8s ease-in-out infinite" }}>
        <rect x="18" y="74" width="7" height="20" rx="2" fill="#3a5a3a" />
        <rect x="31" y="74" width="7" height="20" rx="2" fill="#3a5a3a" />
        <rect x="16" y="92" width="10" height="4" rx="1" fill="#2a1408" />
        <rect x="30" y="92" width="10" height="4" rx="1" fill="#2a1408" />
        <path d="M12 38 Q28 30 44 38 L46 76 Q28 84 10 76 Z" fill="#2e6a3a" stroke="#145018" strokeWidth="1.1" />
        <path d="M18 38 Q28 46 38 38 L36 48 Q28 52 20 48 Z" fill="#fff3d6" />
        <circle cx="28" cy="58" r="2.2" fill="#d7d2c4" stroke="#2a2a2a" strokeWidth="0.5" />
        <path d="M44 40 Q52 54 48 68" stroke="#2e6a3a" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <circle cx="48" cy="68" r="3" fill="#e0b894" />
        <path d="M12 40 Q6 54 10 68" stroke="#2e6a3a" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <circle cx="10" cy="68" r="3" fill="#e0b894" />
        <circle cx="28" cy="20" r="11" fill="#e0b894" stroke="#7a4410" strokeWidth="0.7" />
        <path d="M17 18 Q16 6 28 5 Q40 6 39 18 Q38 12 28 11 Q18 12 17 18 Z" fill="#4a2a12" />
        <path d="M16 22 Q14 34 18 40 M40 22 Q42 34 38 40" stroke="#4a2a12" strokeWidth="2.4" fill="none" />
        <circle cx="24" cy="20" r="1.15" fill="#1a0a04" />
        <circle cx="32" cy="20" r="1.15" fill="#1a0a04" />
        <path d="M24 26 q4 2.4 8 0" stroke="#7a3410" strokeWidth="1" fill="none" />
        <path d="M20 16 q3 -2 6 0 M30 16 q3 -2 6 0" stroke="#3a1a08" strokeWidth="0.7" fill="none" />
      </g>
    </svg>
  );
}
