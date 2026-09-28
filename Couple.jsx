// Animated bride & groom under a rose arch (pure SVG + CSS animations)
const SKIN = '#f0c3a0'
const HAIR_G = '#2b1a12'
const HAIR_B = '#3b2317'
const SUIT = '#17171d'
const DRESS = '#fffaf3'

// Roses placed along the arch
const roses = []
for (let i = 0; i <= 12; i++) {
  const a = Math.PI + (i / 12) * Math.PI // 180° -> 360°
  roses.push({ x: 160 + 120 * Math.cos(a), y: 140 + 120 * Math.sin(a), d: 1.4 + i * 0.09 })
}
;[170, 205, 240, 275].forEach((y, i) => {
  roses.push({ x: 40, y, d: 1.2 - i * 0.1 })
  roses.push({ x: 280, y, d: 1.2 - i * 0.1 })
})

const HEART = 'M0,3 C0,-3 -9,-3 -9,3 C-9,9 0,13 0,17 C0,13 9,9 9,3 C9,-3 0,-3 0,3 Z'

export default function Couple() {
  return (
    <svg className="couple" viewBox="0 0 320 300" role="img" aria-label="Animated bride and groom under a rose arch">
      <defs>
        <radialGradient id="glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="160" cy="175" r="150" fill="url(#glow)" className="glow" />

      {/* Arch */}
      <path
        className="arch"
        d="M40,292 L40,140 A120,120 0 0 1 280,140 L280,292"
        pathLength="1"
        fill="none"
        stroke="#e3b95f"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {roses.map((r, i) => (
        <g key={i} transform={`translate(${r.x} ${r.y})`}>
          <g className="rose" style={{ animationDelay: `${r.d}s` }}>
            <ellipse cx="-7" cy="4" rx="6" ry="2.6" fill="#2f6b3a" transform="rotate(-30)" />
            <ellipse cx="7" cy="4" rx="6" ry="2.6" fill="#2f6b3a" transform="rotate(30)" />
            <circle r="7.5" fill="#d0142a" />
            <circle r="4.5" fill="#9e0b1e" />
            <circle r="1.8" fill="#6d0714" />
          </g>
        </g>
      ))}

      {/* Sparkles */}
      {[[70, 70], [250, 60], [30, 110], [292, 115], [160, 8]].map(([x, y], i) => (
        <path
          key={i}
          className="sparkle"
          style={{ animationDelay: `${2 + i * 0.5}s` }}
          transform={`translate(${x} ${y})`}
          d="M0,-7 L1.6,-1.6 L7,0 L1.6,1.6 L0,7 L-1.6,1.6 L-7,0 L-1.6,-1.6 Z"
          fill="#ffe7b3"
        />
      ))}

      {/* Ground shadow */}
      <ellipse cx="160" cy="292" rx="95" ry="6" fill="#000" opacity="0.25" className="shadow" />

      {/* ---------- GROOM ---------- */}
      <g className="walk-left">
        <g transform="translate(125 0)">
          <g className="bob">
            <g className="leg leg-a">
              <rect x="-13" y="210" width="11" height="78" rx="3" fill={SUIT} />
              <ellipse cx="-8" cy="289" rx="8" ry="3.5" fill="#050507" />
            </g>
            <g className="leg leg-b">
              <rect x="2" y="210" width="11" height="78" rx="3" fill={SUIT} />
              <ellipse cx="8" cy="289" rx="8" ry="3.5" fill="#050507" />
            </g>
            <g className="arm-swing">
              <rect x="-31" y="148" width="9" height="58" rx="4.5" fill={SUIT} />
              <circle cx="-26.5" cy="208" r="4.5" fill={SKIN} />
            </g>
            <path d="M-24,150 Q-25,146 -19,145 L19,145 Q25,146 24,150 L27,216 L-27,216 Z" fill={SUIT} />
            <path d="M-9,145 L9,145 L0,180 Z" fill="#fff" />
            <path d="M-9,145 L0,180 L-15,160 Z" fill="#2c2c38" />
            <path d="M9,145 L0,180 L15,160 Z" fill="#2c2c38" />
            <path d="M-7,147 L0,151 L7,147 L7,155 L0,151 L-7,155 Z" fill="#d0142a" />
            <circle cx="0" cy="190" r="1.7" fill="#555" />
            <circle cx="0" cy="202" r="1.7" fill="#555" />
            <circle cx="-15" cy="162" r="3.6" fill="#d0142a" />
            <g className="arm-reach">
              <rect x="22" y="148" width="9" height="58" rx="4.5" fill={SUIT} />
              <circle cx="26.5" cy="208" r="4.5" fill={SKIN} />
            </g>
            <rect x="-4" y="138" width="8" height="9" fill={SKIN} />
            <g className="head-lean-right">
              <circle cx="0" cy="127" r="15" fill={SKIN} />
              <path d="M-15.5,127 Q-17,107 0,108 Q17,107 15.5,127 Q12,115 0,116 Q-12,115 -15.5,127 Z" fill={HAIR_G} />
              <circle cx="-5" cy="128" r="1.4" fill={HAIR_G} />
              <circle cx="5" cy="128" r="1.4" fill={HAIR_G} />
              <path d="M-4.5,134 Q0,137.5 4.5,134" stroke="#8a3b2a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>

      {/* ---------- BRIDE ---------- */}
      <g className="walk-right">
        <g transform="translate(197 0)">
          <g className="bob">
            <path className="veil" d="M5,121 Q34,150 42,250 Q28,244 14,250 Q12,185 -3,128 Z" fill="#ffffff" opacity="0.8" />
            <g className="skirt">
              <path d="M-12,194 Q-30,240 -50,290 L50,290 Q30,240 12,194 Z" fill={DRESS} stroke="#e8d6c2" strokeWidth="1" />
              <path d="M-30,262 Q0,272 30,262" stroke="#ead9c6" strokeWidth="1.2" fill="none" />
              <path d="M-40,280 Q0,292 40,280" stroke="#ead9c6" strokeWidth="1.2" fill="none" />
            </g>
            <path d="M-12,151 Q-13,147 -8,146 L8,146 Q13,147 12,151 L11,196 L-11,196 Z" fill={DRESS} stroke="#e8d6c2" strokeWidth="1" />
            <rect x="-12" y="189" width="24" height="6" rx="2" fill="#d0142a" />
            <path d="M-12,153 Q-21,178 -3,196" stroke={SKIN} strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M12,153 Q21,178 3,196" stroke={SKIN} strokeWidth="6" fill="none" strokeLinecap="round" />
            <g className="bouquet" transform="translate(0 199)">
              <ellipse cx="-9" cy="2" rx="6" ry="2.6" fill="#2f6b3a" transform="rotate(-25)" />
              <ellipse cx="9" cy="2" rx="6" ry="2.6" fill="#2f6b3a" transform="rotate(25)" />
              <path d="M-2,6 L-5,20 M2,6 L5,20" stroke="#d0142a" strokeWidth="2" />
              <circle cx="-6" cy="-1" r="5.5" fill="#d0142a" />
              <circle cx="6" cy="-1" r="5.5" fill="#b3101f" />
              <circle cx="0" cy="-7" r="5.5" fill="#e63946" />
              <circle cx="0" cy="3" r="5" fill="#c1121f" />
            </g>
            <rect x="-3.5" y="140" width="7" height="8" fill={SKIN} />
            <g className="head-lean-left">
              <circle cx="11" cy="119" r="7" fill={HAIR_B} />
              <circle cx="0" cy="131" r="14" fill={SKIN} />
              <path d="M-14.5,133 Q-17,112 0,113 Q17,112 14.5,133 Q10,120 0,121 Q-10,120 -14.5,133 Z" fill={HAIR_B} />
              <circle cx="-6" cy="116" r="1.6" fill="#ffe08a" />
              <circle cx="0" cy="114" r="2" fill="#ffe08a" />
              <circle cx="6" cy="116" r="1.6" fill="#ffe08a" />
              <circle cx="-5" cy="132" r="1.3" fill={HAIR_B} />
              <circle cx="5" cy="132" r="1.3" fill={HAIR_B} />
              <circle cx="-8" cy="136" r="2.4" fill="#f28b95" opacity="0.6" />
              <circle cx="8" cy="136" r="2.4" fill="#f28b95" opacity="0.6" />
              <path d="M-4,138 Q0,141 4,138" stroke="#b0303f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>

      {/* Floating hearts between them */}
      {[0, 1.1, 2.2].map((d, i) => (
        <g key={i} transform={`translate(${152 + i * 8} 118)`}>
          <path className="float-heart" style={{ animationDelay: `${3 + d}s` }} d={HEART} fill={i === 1 ? '#e63946' : '#d0142a'} />
        </g>
      ))}
    </svg>
  )
}
