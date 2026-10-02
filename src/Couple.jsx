// Animated scene outside a mosque courtyard (inspired by the Blue Mosque photo).
// The groom (black suit) and the bride (white dress + Spanish-style hijab) walk toward
// each other in front of the fountain pavilion until their hands meet; then a garland of
// red & white flowers blooms in an arch above them.

const SKIN_G = '#e9b893'
const SKIN_B = '#f0c3a0'
const HAIR = '#1b120d'
const SUIT = '#111114'
const LAPEL = '#2a2a31'
const DRESS = '#ffffff'
const LACE = '#e3d3bf'
const WINE = '#7b1e2e'
const GOLD = '#c39a5b'

// Colours sampled from the photo
const STONE = '#f4eadc'
const STONE_SH = '#e8d8c2'
const STONE_DK = '#d9c3a6'
const DOME = '#c2a882'
const ROSE = '#8a2a3a'
const WIN = '#6b2230'
const LINE = '#d5c0a3'

// ---- perspective helpers (low camera, vanishing point behind the fountain) ----
const VP = { x: 160, y: 210 }
const P = (x0, y0, s) => [VP.x + (x0 - VP.x) * s, VP.y + (y0 - VP.y) * s]
const pt = (a) => `${a[0].toFixed(1)},${a[1].toFixed(1)}`
const BACK = 0.35 // depth of the back arcade

const HEART = 'M0,3 C0,-3 -9,-3 -9,3 C-9,9 0,13 0,17 C0,13 9,9 9,3 C9,-3 0,-3 0,3 Z'

// Side arcade arches receding toward the back
const ARCH_SEGMENTS = [[1.0, 0.8], [0.8, 0.65], [0.65, 0.54], [0.54, 0.46], [0.46, 0.4], [0.4, 0.355]]
function archPath(x0, sa, sb) {
  const d = (sa - sb) * 0.12
  const a = sa - d
  const b = sb + d
  const m = (a + b) / 2
  return `M${pt(P(x0, 330, a))} L${pt(P(x0, 205, a))} Q${pt(P(x0, 160, a))} ${pt(P(x0, 148, m))} Q${pt(P(x0, 160, b))} ${pt(P(x0, 205, b))} L${pt(P(x0, 330, b))} Z`
}
function archTop(x0, sa, sb) {
  const d = (sa - sb) * 0.12
  const a = sa - d
  const b = sb + d
  const m = (a + b) / 2
  return `M${pt(P(x0, 205, a))} Q${pt(P(x0, 160, a))} ${pt(P(x0, 148, m))} Q${pt(P(x0, 160, b))} ${pt(P(x0, 205, b))}`
}

// ...and add a garland of red & white flowers that blooms in an arch above the couple
const GARLAND = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14
  const ang = Math.PI * (1.12 + 0.76 * t) // from lower-left, over the top, to lower-right
  return {
    x: 160 + 120 * Math.cos(ang),
    y: 236 + 132 * Math.sin(ang),
    c: i % 2 ? 'white' : 'red',
    sc: 0.95 + (i % 3) * 0.12,
    rot: (i * 47) % 360,
    d: 3.8 + Math.abs(t - 0.5) * 2.2, // blooms from the top outward
  }
})
const VINE = `M${GARLAND.map((f) => `${f.x.toFixed(1)},${f.y.toFixed(1)}`).join(' L')}`

function Blossom({ x, y, c, sc, rot, d }) {
  const petal = c === 'red' ? '#8a1c2e' : '#ffffff'
  const edge = c === 'red' ? '#5e1020' : '#dccbb2'
  const center = c === 'red' ? '#f3d58a' : '#d9b25a'
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc.toFixed(2)})`}>
      <g className="bloom" style={{ animationDelay: `${d}s` }}>
        <ellipse cx="-7" cy="3" rx="5" ry="2.2" fill="#5f8a54" transform="rotate(-25)" />
        <ellipse cx="7" cy="3" rx="5" ry="2.2" fill="#5f8a54" transform="rotate(25)" />
        <g transform={`rotate(${rot})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-4.5" rx="3.8" ry="5.2" fill={petal} stroke={edge} strokeWidth="0.6" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="2.4" fill={center} />
      </g>
    </g>
  )
}

// Ottoman minaret: slim shaft, carved balconies, lead-grey pointed cap
function Minaret({ x, base, top, w, lean = 0, balconies }) {
  const capH = w * 3.2
  return (
    <g transform={`rotate(${lean} ${x} ${base})`}>
      <line x1={x} y1={top - 8} x2={x} y2={top} stroke={GOLD} strokeWidth={w * 0.14} />
      <circle cx={x} cy={top - 4} r={w * 0.14} fill={GOLD} />
      <path d={`M${x - w / 2},${top + capH} L${x},${top} L${x + w / 2},${top + capH} Z`} fill={DOME} />
      <rect x={x - w / 2} y={top + capH} width={w} height={base - top - capH} fill={STONE} />
      <rect x={x + w * 0.12} y={top + capH} width={w * 0.38} height={base - top - capH} fill={STONE_SH} />
      {balconies.map((by) => (
        <g key={by}>
          <rect x={x - w * 0.85} y={by} width={w * 1.7} height={w * 0.55} fill={STONE} stroke={LINE} strokeWidth="0.4" />
          <path d={`M${x - w * 0.85},${by + w * 0.55} L${x - w / 2},${by + w * 1.2} L${x + w / 2},${by + w * 1.2} L${x + w * 0.85},${by + w * 0.55} Z`} fill={STONE_SH} />
        </g>
      ))}
    </g>
  )
}

function SmallDome({ cx, by, r, h }) {
  return (
    <g>
      <path d={`M${cx - r},${by} Q${cx - r},${by - h} ${cx},${by - h} Q${cx + r},${by - h} ${cx + r},${by} Z`} fill="url(#domeG)" />
      <line x1={cx} y1={by - h} x2={cx} y2={by - h - r * 0.5} stroke={GOLD} strokeWidth={Math.max(0.4, r * 0.08)} />
    </g>
  )
}
function Groom() {
  return (
    <g transform="translate(194 0)">
      <path d="M-14,297 L16,297 L34,330 L-26,330 Z" fill="#3b2410" opacity="0.16" filter="url(#soft)" />
      <ellipse cx="0" cy="298" rx="20" ry="3.5" fill="#2a1a0c" opacity="0.3" />
      <g className="bob">
        <g className="leg">
          <rect x="-13" y="212" width="11" height="84" rx="3" fill={SUIT} />
          <ellipse cx="-8" cy="297" rx="8" ry="3.5" fill="#000" />
        </g>
        <g className="leg leg-b">
          <rect x="2" y="212" width="11" height="84" rx="3" fill={SUIT} />
          <ellipse cx="8" cy="297" rx="8" ry="3.5" fill="#000" />
        </g>
        <g transform="translate(26 148)">
          <g className="arm swing-arm">
            <rect x="-4.5" y="0" width="9" height="56" rx="4.5" fill={SUIT} />
            <circle cx="0" cy="58" r="4.5" fill={SKIN_G} />
          </g>
        </g>
        <path d="M-24,150 Q-25,146 -19,145 L19,145 Q25,146 24,150 L27,218 L-27,218 Z" fill={SUIT} />
        {/* warm rim light from the mosque door */}
        <path d="M-24,150 Q-25,146 -19,145 L-17,146 L-22,216 L-27,218 Z" fill="#ffe7b8" opacity="0.1" />
        <path d="M-9,145 L9,145 L0,182 Z" fill="#fff" />
        <path d="M-9,145 L0,182 L-15,162 Z" fill={LAPEL} />
        <path d="M9,145 L0,182 L15,162 Z" fill={LAPEL} />
        <path d="M-7,147 L0,151 L7,147 L7,155 L0,151 L-7,155 Z" fill={WINE} />
        <circle cx="0" cy="192" r="1.7" fill="#555" />
        <circle cx="0" cy="204" r="1.7" fill="#555" />
        <circle cx="15" cy="163" r="3.6" fill={WINE} />
        <circle cx="15" cy="163" r="1.5" fill="#fff" />
        <g transform="translate(-26 148)">
          <g className="arm swing-arm reach" style={{ '--end': '11deg' }}>
            <rect x="-4.5" y="0" width="9" height="51" rx="4.5" fill={SUIT} />
            <rect x="-4.5" y="44" width="9" height="4" fill="#fff" />
            <circle cx="0" cy="53" r="4.6" fill={SKIN_G} />
          </g>
        </g>
        <rect x="-4" y="138" width="8" height="9" fill={SKIN_G} />
        <g className="lean-left">
          <g transform="translate(0 146) scale(1.18) translate(0 -146)">
            <ellipse cx="-15" cy="128" rx="2.6" ry="3.6" fill={SKIN_G} />
            <ellipse cx="15" cy="128" rx="2.6" ry="3.6" fill={SKIN_G} />
            <circle cx="0" cy="127" r="15" fill={SKIN_G} />
            {/* neat hair with a cute swoop */}
            <path d="M-15.6,126 Q-17.5,106 0,107 Q17.5,106 15.6,126 Q13.5,115 6,113.5 Q1,118.5 -8,116.5 Q-13,118.5 -15.6,126 Z" fill={HAIR} />
            <path d="M-2,108 Q6,108.5 10,113" stroke="#3a2a20" strokeWidth="1" fill="none" />
            <g className="blink">
              <ellipse cx="-5.2" cy="127.5" rx="1.9" ry="2.3" fill={HAIR} />
              <ellipse cx="5.2" cy="127.5" rx="1.9" ry="2.3" fill={HAIR} />
              <circle cx="-4.6" cy="126.6" r="0.7" fill="#fff" />
              <circle cx="5.8" cy="126.6" r="0.7" fill="#fff" />
            </g>
            <path d="M-7.5,122.6 Q-5.2,121.4 -3,122.4 M7.5,122.6 Q5.2,121.4 3,122.4" stroke={HAIR} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <ellipse cx="-8.6" cy="132.5" rx="2.6" ry="1.6" fill="#f2a08f" opacity="0.5" />
            <ellipse cx="8.6" cy="132.5" rx="2.6" ry="1.6" fill="#f2a08f" opacity="0.5" />
            <path d="M-3.6,133.4 Q0,136.6 3.6,133.4" stroke="#8a3b2a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  )
}

function Bride() {
  return (
    <g transform="translate(126 0)">
      <path d="M-24,297 L24,297 L32,330 L-40,330 Z" fill="#3b2410" opacity="0.14" filter="url(#soft)" />
      <ellipse cx="0" cy="298" rx="34" ry="4" fill="#2a1a0c" opacity="0.22" />
      <g className="bob">
        <path className="veil" d="M-6,118 Q-38,152 -46,264 Q-31,258 -16,264 Q-13,190 4,124 Z" fill="#ffffff" opacity="0.8" stroke={LACE} strokeWidth="0.8" />
        <g className="skirt">
          <path d="M-12,194 Q-30,242 -52,298 L52,298 Q30,242 12,194 Z" fill="url(#silk)" stroke={LACE} strokeWidth="1.2" />
          <path d="M-31,262 Q0,272 31,262" stroke={LACE} strokeWidth="1.2" fill="none" />
          <path d="M-42,284 Q0,296 42,284" stroke={LACE} strokeWidth="1.2" fill="none" />
          <path d="M2,198 Q18,240 34,296" stroke="#ffffff" strokeWidth="4" opacity="0.4" fill="none" />
        </g>
        <path d="M-12,151 Q-13,147 -8,146 L8,146 Q13,147 12,151 L11,196 L-11,196 Z" fill={DRESS} stroke={LACE} strokeWidth="1.2" />
        <rect x="-12" y="190" width="24" height="5" rx="2" fill={WINE} />
        <path d="M-11,154 Q-20,178 -14,195" stroke={LACE} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M-11,154 Q-20,178 -14,195" stroke={DRESS} strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="-14" cy="198" r="4" fill={SKIN_B} />
        <g transform="translate(-14 202)">
          <ellipse cx="-9" cy="2" rx="6" ry="2.6" fill="#2f6b3a" transform="rotate(-25)" />
          <ellipse cx="9" cy="2" rx="6" ry="2.6" fill="#2f6b3a" transform="rotate(25)" />
          <path d="M-2,6 L-5,20 M2,6 L5,20" stroke={WINE} strokeWidth="2" />
          <circle cx="-6" cy="-1" r="5.5" fill="#c1121f" />
          <circle cx="6" cy="-1" r="5.5" fill="#fff" stroke={LACE} strokeWidth="0.8" />
          <circle cx="0" cy="-7" r="5.5" fill="#fff" stroke={LACE} strokeWidth="0.8" />
          <circle cx="0" cy="3" r="5" fill="#9e0b1e" />
        </g>
        <g transform="translate(11 152)">
          <g className="arm swing-arm reach" style={{ '--end': '-24deg' }}>
            <rect x="-3.5" y="0" width="7" height="50" rx="3.5" fill={DRESS} stroke={LACE} strokeWidth="1" />
            <circle cx="0" cy="52" r="4.2" fill={SKIN_B} />
          </g>
        </g>
        {/* loose hijab drape falling over the outer shoulder (static) */}
        <g transform="translate(0 150) scale(1.18) translate(0 -150)">
          <path d="M-12,128 Q-29,142 -25,176 Q-19,180 -13,174 Q-16,152 -3,138 Z" fill="url(#silk)" stroke={LACE} strokeWidth="1" />
          <path d="M-17,146 Q-21,160 -19,173" stroke={LACE} strokeWidth="0.8" fill="none" />
        </g>
        <g className="lean-right">
          <g transform="translate(0 150) scale(1.18) translate(0 -150)">
            {/* Spanish hijab: soft volume at the back of the head */}
            <ellipse cx="3" cy="111" rx="14" ry="9" fill="url(#silk)" stroke={LACE} strokeWidth="1" />
            {/* main wrap around the head, framing the face */}
            <path d="M-17,131 C-19,107 19,105 17,130 C17,140 13,147 6,150 L-8,150 C-14,146 -17,139 -17,131 Z" fill="url(#silk)" stroke={LACE} strokeWidth="1.2" />
            {/* cute round face */}
            <ellipse cx="0" cy="132" rx="11.2" ry="12.6" fill={SKIN_B} />
            {/* soft folded edge across the forehead */}
            <path d="M-12.4,130 C-12,115 12,115 12.4,130 C10,120.5 -10,120.5 -12.4,130 Z" fill="#fff" stroke={LACE} strokeWidth="0.8" />
            <path d="M-9,121.5 Q0,117.5 9,121.5" stroke={LACE} strokeWidth="0.7" fill="none" />
            {/* the wrap crosses under the chin and is tucked at the side */}
            <path d="M-11.5,136 C-10,145 -4,148.5 2,148 C8,147.5 12,143 13.5,135 C16,146 10,154 0,154.5 C-8,154.5 -13,147 -11.5,136 Z" fill="url(#silk)" stroke={LACE} strokeWidth="0.8" />
            <path d="M-8,150.5 Q2,152 11,145 M-5,153 Q5,153 12,148" stroke={LACE} strokeWidth="0.7" fill="none" />
            {/* little flower pin on the side */}
            <g transform="translate(12.5 126)">
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-2.2" rx="1.7" ry="2.4" fill="#a8364a" transform={`rotate(${a})`} />
              ))}
              <circle r="1.3" fill="#f3d58a" />
            </g>
            {/* pearl crown */}
            {[-7, -3.5, 0, 3.5, 7].map((x, i) => (
              <circle key={x} cx={x} cy={118.6 - (i === 2 ? 1.8 : i % 2 ? 0.9 : 0)} r={i === 2 ? 1.7 : 1.2} fill="#f6e2a4" stroke="#d1ad5f" strokeWidth="0.4" />
            ))}
            {/* big sparkly eyes */}
            <g className="blink blink-b">
              <ellipse cx="-4.6" cy="132" rx="2.1" ry="2.7" fill="#3b2317" />
              <ellipse cx="4.6" cy="132" rx="2.1" ry="2.7" fill="#3b2317" />
              <circle cx="-3.9" cy="131" r="0.9" fill="#fff" />
              <circle cx="5.3" cy="131" r="0.9" fill="#fff" />
              <circle cx="-5.1" cy="133.2" r="0.45" fill="#fff" />
              <circle cx="4.1" cy="133.2" r="0.45" fill="#fff" />
              <path d="M-6.8,130.2 L-8.2,129 M-6.4,129.2 L-7.4,127.8 M6.8,130.2 L8.2,129 M6.4,129.2 L7.4,127.8" stroke="#3b2317" strokeWidth="0.7" strokeLinecap="round" />
            </g>
            <path d="M-6.8,127 Q-4.6,126 -2.6,126.8 M6.8,127 Q4.6,126 2.6,126.8" stroke="#6b4632" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <ellipse cx="-7.4" cy="137" rx="2.8" ry="1.7" fill="#f28b95" opacity="0.55" />
            <ellipse cx="7.4" cy="137" rx="2.8" ry="1.7" fill="#f28b95" opacity="0.55" />
            <circle cx="0" cy="135.2" r="0.6" fill="#d99a7c" />
            <path d="M-2.6,138.4 Q0,141 2.6,138.4" stroke="#c04456" strokeWidth="1.3" fill="#e46a7a" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  )
}


export default function Couple() {
  const floor = [P(-30, 330, 1), P(-30, 330, BACK), P(350, 330, BACK), P(350, 330, 1)].map(pt).join(' ')

  return (
    <svg className="couple" viewBox="0 0 320 320" role="img" aria-label="A cinematic scene outside a mosque: the groom and bride walk toward each other in the marble courtyard until their hands meet, and flowers grow around them">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7f0e6" stopOpacity="0" />
          <stop offset="100%" stopColor="#efe2cf" />
        </linearGradient>
        <radialGradient id="sun">
          <stop offset="0%" stopColor="#fff7ea" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff7ea" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="domeG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e4d3b8" />
          <stop offset="55%" stopColor="#cbb08b" />
          <stop offset="100%" stopColor="#b0946e" />
        </linearGradient>
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1e5d4" />
          <stop offset="100%" stopColor="#f5ecdf" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sheen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e2cfbd" />
          <stop offset="100%" stopColor={STONE} />
        </linearGradient>
        <linearGradient id="wallR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#e2cfbd" />
          <stop offset="100%" stopColor={STONE} />
        </linearGradient>
        <linearGradient id="archShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdb59f" />
          <stop offset="100%" stopColor="#e8dacb" />
        </linearGradient>
        <linearGradient id="silk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#efe5d8" />
        </linearGradient>
        <linearGradient id="flareG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff1c9" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff8e4" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff1c9" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="flareCore">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffe3a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
          <stop offset="62%" stopColor="#3a2c22" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a2c22" stopOpacity="0.42" />
        </radialGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="bokeh" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id="floorClip">
          <polygon points={floor} />
        </clipPath>
      </defs>

      {/* ===== BACK LAYER: sky, minarets, domes, back arcade ===== */}
      <g className="layer layer-back">
        <rect x="-40" y="-40" width="400" height="300" fill="url(#sky)" />
        <circle cx="160" cy="60" r="150" fill="url(#sun)" className="sun" />

        {/* birds crossing the sky */}
        {[[70, 0], [52, 2.5], [88, 5], [40, 8]].map(([y, d], i) => (
          <g key={i} transform={`translate(0 ${y})`}>
            <g className="bird-path" style={{ animationDelay: `${d}s` }}>
              <path className="bird" style={{ animationDelay: `${d / 3}s` }} d="M-5,0 Q-2.5,-3 0,0 Q2.5,-3 5,0" stroke="#8a6f5a" strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>
          </g>
        ))}

        {/* back minarets */}
        <Minaret x={112} base={180} top={84} w={5.5} balconies={[118, 146]} />
        <Minaret x={208} base={180} top={84} w={5.5} balconies={[118, 146]} />

        {/* mosque: cascade of domes */}
        <g className="mosque">
          <rect x="98" y="126" width="124" height="54" fill={STONE} />
          <rect x="166" y="126" width="56" height="54" fill={STONE_SH} opacity="0.6" />
          {Array.from({ length: 11 }, (_, i) => (
            <path key={i} d={`M${103 + i * 11},152 v-7 q2.5,-4 5,0 v7 Z`} fill={WIN} opacity="0.75" />
          ))}
          <SmallDome cx={108} by={128} r={10} h={9} />
          <SmallDome cx={212} by={128} r={10} h={9} />
          <rect x="118" y="98" width="12" height="30" fill={STONE} />
          <rect x="190" y="98" width="12" height="30" fill={STONE_SH} />
          <SmallDome cx={124} by={99} r={7} h={7} />
          <SmallDome cx={196} by={99} r={7} h={7} />
          <SmallDome cx={136} by={128} r={20} h={15} />
          <SmallDome cx={184} by={128} r={20} h={15} />
          <rect x="128" y="100" width="64" height="16" fill={STONE} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${131 + i * 6.8},113 v-6 q2,-3.5 4,0 v6 Z`} className="window" />
          ))}
          <SmallDome cx={160} by={128} r={24} h={13} />
          <path d="M124,101 Q124,70 160,68 Q196,70 196,101 Z" fill="url(#domeG)" />
          <path d="M132,92 Q140,76 158,72" stroke="#f1e4cf" strokeWidth="1.2" fill="none" opacity="0.7" />
          <line x1="160" y1="68" x2="160" y2="54" stroke={GOLD} strokeWidth="1.4" />
          <circle cx="160" cy="60" r="1.6" fill={GOLD} />
          <circle cx="160" cy="55" r="1.2" fill={GOLD} />
        </g>

        {/* back arcade with rose-striped arches */}
        <rect x="90" y="180" width="140" height="72" fill={STONE} />
        <rect x="90" y="180" width="140" height="3" fill={STONE_DK} />
        {Array.from({ length: 7 }, (_, i) => (
          <SmallDome key={i} cx={100 + i * 20} by={181} r={8.5} h={7} />
        ))}
        {Array.from({ length: 6 }, (_, i) => {
          const x = 95 + i * 22
          const top = `M${x},214 Q${x},199 ${x + 10},195 Q${x + 20},199 ${x + 20},214`
          return (
            <g key={i}>
              <path d={`M${x},252 V214 Q${x},199 ${x + 10},195 Q${x + 20},199 ${x + 20},214 V252 Z`} fill="url(#archShade)" />
              <path d={top} stroke={STONE} strokeWidth="2.6" fill="none" />
              <path d={top} stroke={ROSE} strokeWidth="2.6" fill="none" strokeDasharray="2.4 2.4" />
              <rect x={x + 6} y="226" width="8" height="13" fill={WIN} opacity="0.8" />
              <rect x={x + 21} y="196" width="1.6" height="56" fill={STONE_DK} />
            </g>
          )
        })}

        {/* front minarets – tall, leaning outward like a wide-angle lens */}
        <Minaret x={52} base={205} top={-14} w={11} lean={-3} balconies={[42, 84, 130]} />
        <Minaret x={268} base={205} top={-14} w={11} lean={3} balconies={[42, 84, 130]} />
      </g>

      {/* ===== MID LAYER: marble floor, side arcades, fountain pavilion ===== */}
      <g className="layer layer-mid">
        <polygon points={floor} fill="url(#floorG)" />
        <g clipPath="url(#floorClip)" stroke={LINE} strokeWidth="0.7" opacity="0.8">
          {Array.from({ length: 11 }, (_, i) => {
            const x0 = -30 + i * 38
            return <line key={i} x1={P(x0, 330, 1)[0]} y1={P(x0, 330, 1)[1]} x2={P(x0, 330, BACK)[0]} y2={P(x0, 330, BACK)[1]} />
          })}
          {[0.93, 0.78, 0.66, 0.57, 0.5, 0.44, 0.39].map((s) => (
            <line key={s} x1={P(-30, 330, s)[0]} y1={P(-30, 330, s)[1]} x2={P(350, 330, s)[0]} y2={P(350, 330, s)[1]} />
          ))}
        </g>
        <ellipse cx="160" cy="292" rx="150" ry="26" fill="url(#sheen)" />

        {/* side arcades */}
        {[
          [-30, 'url(#wallL)'],
          [350, 'url(#wallR)'],
        ].map(([x0, fill]) => {
          const wall = [P(x0, 120, 1), P(x0, 120, BACK), P(x0, 330, BACK), P(x0, 330, 1)].map(pt).join(' ')
          return (
            <g key={x0}>
              <polygon points={wall} fill={fill} />
              {ARCH_SEGMENTS.map(([a, b], i) => (
                <g key={i}>
                  <path d={archPath(x0, a, b)} fill="url(#archShade)" />
                  <path d={archTop(x0, a, b)} stroke={STONE} strokeWidth={3.2 * a} fill="none" />
                  <path d={archTop(x0, a, b)} stroke={ROSE} strokeWidth={3.2 * a} fill="none" strokeDasharray={`${3 * a} ${3 * a}`} />
                </g>
              ))}
              <line x1={P(x0, 128, 1)[0]} y1={P(x0, 128, 1)[1]} x2={P(x0, 128, BACK)[0]} y2={P(x0, 128, BACK)[1]} stroke={STONE_DK} strokeWidth="1.2" />
              {ARCH_SEGMENTS.map(([a, b], i) => {
                const m = (a + b) / 2
                const [cx, by] = P(x0, 121, m)
                return <SmallDome key={i} cx={cx} by={by} r={17 * m} h={13 * m} />
              })}
            </g>
          )
        })}


        {/* ablution fountain pavilion (şadırvan) behind the couple */}
        <g className="fountain">
          <rect x="122" y="266" width="76" height="7" fill={STONE_DK} />
          <rect x="132" y="244" width="56" height="22" fill="#b79c80" />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={134 + i * 5} y1="244" x2={134 + i * 5} y2="266" stroke="#8f7660" strokeWidth="0.8" />
          ))}
          {[126, 145, 171, 190].map((x) => (
            <rect key={x} x={x} y="226" width="4.5" height="40" fill={STONE} stroke={LINE} strokeWidth="0.4" />
          ))}
          <path d="M149,244 V236 Q149,228 158,226 Q167,228 171,236 V244 Z" fill="#6b5545" />
          <rect x="118" y="218" width="84" height="9" fill={STONE} stroke={LINE} strokeWidth="0.5" />
          <path d="M114,219 L206,219 L196,211 L124,211 Z" fill={DOME} />
          <path d="M134,212 Q134,193 160,191 Q186,193 186,212 Z" fill="url(#domeG)" />
          <line x1="160" y1="191" x2="160" y2="183" stroke={GOLD} strokeWidth="1.2" />
        </g>

      </g>

      {/* ===== COUPLE LAYER ===== */}
      <g className="layer layer-couple">
        <g transform="translate(160 288) scale(0.8) translate(-160 -300)">
          <g className="walk-from-right"><Groom /></g>
          <g className="walk-from-left"><Bride /></g>

          <g transform="translate(158 200)">
            <circle r="10" className="meet-ring" fill="none" stroke="#f3d58a" strokeWidth="2" />
            <circle r="10" className="meet-ring two" fill="none" stroke="#f3d58a" strokeWidth="1.5" />
          </g>
          <g transform="translate(158 166)">
            <path className="meet-heart" d={HEART} fill="#7b1e2e" stroke="#fff" strokeWidth="1" />
          </g>
        </g>


        {Array.from({ length: 12 }, (_, i) => (
          <circle
            key={i}
            className="dust"
            cx={30 + ((i * 47) % 260)}
            cy={90 + ((i * 53) % 170)}
            r={0.6 + (i % 3) * 0.4}
            fill="#fffaf0"
            style={{ animationDelay: `${(i * 0.5) % 6}s`, animationDuration: `${5 + (i % 4)}s` }}
          />
        ))}
      </g>

      {/* flower garland blooming above the couple when their hands meet */}
      <path className="vine" d={VINE} pathLength="1" fill="none" stroke="#6f9463" strokeWidth="1.6" strokeLinecap="round" />
      {GARLAND.map((f, i) => (
        <Blossom key={i} {...f} />
      ))}

      {/* little hearts floating up after the hands meet */}
      {[0, 1.2, 2.4].map((d, i) => (
        <g key={i} transform={`translate(${150 + i * 8} 150)`}>
          <path className="float-heart" style={{ animationDelay: `${4.3 + d}s` }} d={HEART} fill={i === 1 ? '#a8364a' : '#7b1e2e'} />
        </g>
      ))}
    </svg>
  )
}
