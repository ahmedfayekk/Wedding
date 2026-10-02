import { useEffect, useRef } from 'react'

// Canvas of falling petals and little hearts in soft pastel colours
export default function Petals({ count = 26 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const colors = ['#7b1e2e', '#a8364a', '#e8d5ba', '#ffffff', '#c9a46a', '#d9c3a6']
    let w, h, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.width = window.innerWidth * dpr
      h = canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const make = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20 * dpr,
      size: (5 + Math.random() * 7) * dpr,
      speed: (0.35 + Math.random() * 0.8) * dpr,
      drift: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04,
      flip: Math.random() * Math.PI * 2,
      color: colors[(Math.random() * colors.length) | 0],
      alpha: 0.55 + Math.random() * 0.4,
      heart: Math.random() < 0.4,
    })
    const petals = Array.from({ length: count }, () => make(true))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of petals) {
        p.y += p.speed
        p.drift += 0.012
        p.x += Math.sin(p.drift) * 0.7 * dpr
        p.rot += p.spin
        p.flip += 0.03
        if (p.y > h + 20 * dpr) Object.assign(p, make(false))

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.scale(p.heart ? 1 : 1, p.heart ? 0.75 + 0.25 * Math.cos(p.flip) : Math.cos(p.flip))
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        if (p.heart) {
          const s = p.size * 0.9
          ctx.moveTo(0, s * 0.35)
          ctx.bezierCurveTo(-s * 1.2, -s * 0.5, -s * 0.5, -s * 1.3, 0, -s * 0.55)
          ctx.bezierCurveTo(s * 0.5, -s * 1.3, s * 1.2, -s * 0.5, 0, s * 0.35)
        } else {
          ctx.moveTo(0, -p.size)
          ctx.bezierCurveTo(p.size, -p.size * 0.6, p.size * 0.8, p.size * 0.7, 0, p.size)
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.7, -p.size, -p.size * 0.6, 0, -p.size)
        }
        ctx.fill()
        ctx.restore()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return <canvas ref={ref} className="petals" aria-hidden="true" />
}
