// Islamic geometric decorations: background pattern (8-point "khatam" stars) + star ornament

const starPoints = (cx, cy, R, r) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = ((i * 22.5 - 90) * Math.PI) / 180
    const rad = i % 2 ? r : R
    return `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`
  }).join(' ')

const T = 60 // tile size
const C = T / 2
const R = 22
const STAR = starPoints(C, C, R, R * 0.7654)
const INNER = starPoints(C, C, 9, 9 * 0.7654)
const d = R * Math.SQRT1_2 // diagonal tip offset

export function IslamicBackground() {
  return (
    <svg className="islamic-bg" aria-hidden="true">
      <defs>
        <pattern id="khatam" width={T} height={T} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <polygon points={STAR} />
            <polygon points={INNER} />
            {/* lines from straight tips to tile edges */}
            <path d={`M${C},${C - R} V0 M${C},${C + R} V${T} M${C - R},${C} H0 M${C + R},${C} H${T}`} />
            {/* lines from diagonal tips to corner squares */}
            <path
              d={`M${C + d},${C - d} L${T - 6},6 M${C + d},${C + d} L${T - 6},${T - 6} M${C - d},${C + d} L6,${T - 6} M${C - d},${C - d} L6,6`}
            />
            {[[0, 0], [T, 0], [0, T], [T, T]].map(([x, y], i) => (
              <rect key={i} x={x - 6} y={y - 6} width="12" height="12" transform={`rotate(0 ${x} ${y})`} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#khatam)" />
    </svg>
  )
}

export function Star({ className = '' }) {
  return (
    <svg className={`star-orn ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <polygon points={starPoints(20, 20, 18, 18 * 0.7654)} />
      <circle cx="20" cy="20" r="5" />
    </svg>
  )
}
