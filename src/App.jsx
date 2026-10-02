import { useCallback, useEffect, useRef, useState } from 'react'
import Couple from './Couple.jsx'
import Petals from './Petals.jsx'
import { IslamicBackground, Star } from './Islamic.jsx'

// ---- Edit your details here ----
const EVENT = {
  groom: 'Ahmed',
  bride: 'Nada',
  dayName: 'Friday',
  dateLabel: '18 December 2026',
  timeLabel: '3:00 PM — 6:00 PM',
  venue: 'Villa Rihana',
  // Egypt is UTC+2 in December
  start: new Date('2026-12-18T15:00:00+02:00'),
  mapsUrl:
    'https://www.google.com/maps/place/Villa+Rihana/data=!4m2!3m1!1s0x0:0x383f54fc06dc5a10',
  mapsEmbed: 'https://maps.google.com/maps?q=Villa%20Rihana&z=15&output=embed',
}

// Surah Ar-Rum 30:21
const AYA =
  'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً'

const AUTO_OPEN_SECONDS = 3
const pad = (n) => String(n).padStart(2, '0')

// Fade/slide elements in as they scroll into view
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// Word-by-word reveal (keeps Arabic letters connected)
function Words({ text, delay = 0, step = 0.12 }) {
  const words = text.split(' ')
  return words.map((w, i) => (
    <span key={i} className="word" style={{ animationDelay: `${delay + i * step}s` }}>
      {i === 0 && <span className="bracket">﴿</span>}
      {w}
      {i === words.length - 1 ? <span className="bracket">﴾</span> : ' '}
    </span>
  ))
}

// Card that tilts in 3D following the finger / mouse
function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const p = e.touches ? e.touches[0] : e
    const x = (p.clientX - r.left) / r.width - 0.5
    const y = (p.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--rx', `${-y * 10}deg`)
    ref.current.style.setProperty('--ry', `${x * 12}deg`)
    ref.current.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    ref.current.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const reset = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }
  return (
    <div ref={ref} className={`tilt ${className}`} onMouseMove={move} onMouseLeave={reset} onTouchMove={move} onTouchEnd={reset}>
      {children}
    </div>
  )
}

function Countdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, EVENT.start.getTime() - now)
  if (diff === 0) return <p className="today">Today is the day! 💍</p>
  const units = [
    ['Days', Math.floor(diff / 86400000)],
    ['Hours', Math.floor(diff / 3600000) % 24],
    ['Minutes', Math.floor(diff / 60000) % 60],
    ['Seconds', Math.floor(diff / 1000) % 60],
  ]
  return (
    <div className="countdown">
      {units.map(([label, value]) => (
        <div className="unit" key={label}>
          <span className="num" key={value}>{pad(value)}</span>
          <span className="lbl">{label}</span>
        </div>
      ))}
    </div>
  )
}

function Envelope({ onOpen }) {
  const [opening, setOpening] = useState(false)
  const [left, setLeft] = useState(AUTO_OPEN_SECONDS)
  const started = useRef(false)

  const open = useCallback(() => {
    if (started.current) return
    started.current = true
    setOpening(true)
    setTimeout(onOpen, 1700)
  }, [onOpen])

  // Opens by itself after 3 seconds if nobody taps
  useEffect(() => {
    if (opening) return
    if (left === 0) {
      open()
      return
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left, opening, open])

  return (
    <div className={`intro ${opening ? 'leaving' : ''}`}>
      <Star className="intro-star" />
      <p className="intro-top">Wedding Invitation</p>
      <button className={`envelope ${opening ? 'open' : ''}`} onClick={open} aria-label="Open the invitation">
        <span className="env-back" />
        <span className="env-letter">
          <span className="letter-names">{EVENT.groom} &amp; {EVENT.bride}</span>
          <span className="letter-date">{EVENT.dateLabel}</span>
        </span>
        <span className="env-front" />
        <span className="env-flap" />
        <span className="seal">A&amp;N</span>
        {opening && (
          <span className="burst" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i key={i} style={{ '--a': `${i * 20}deg`, '--d': `${60 + (i % 3) * 30}px` }}>{i % 2 ? '✦' : '♥'}</i>
            ))}
          </span>
        )}
      </button>
      <p className="tap">Tap the seal to open</p>
      <div className={`auto ${opening ? 'done' : ''}`}>
        <span>or it opens automatically in</span>
        <span className="auto-num">{left}</span>
      </div>
      <span className="auto-bar"><span /></span>
    </div>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const [scene, setScene] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    if (!opened) return
    const t = setTimeout(() => setScene(true), 600)
    const onScroll = () => heroRef.current?.style.setProperty('--sy', window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [opened])

  return (
    <>
      <IslamicBackground />
            <Petals />
      {!opened && <Envelope onOpen={() => setOpened(true)} />}

      {opened && (
        <main className="page">
          <section className="hero" ref={heroRef}>
            <div lang="ar" dir="rtl" className="quran">
              <p className="bismillah fade-up" style={{ animationDelay: '0.1s' }}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <div className="aya-frame fade-up" style={{ animationDelay: '0.3s' }}>
                <Star className="aya-star" />
                <p className="aya">
                  <Words text={AYA} delay={0.6} step={0.11} />
                </p>
                <p className="aya-ref" dir="ltr" lang="en">Surah Ar-Rum · 30:21</p>
              </div>
            </div>

            <div className="hero-scene">
              {scene && <Couple />}
            </div>

            <p className="kicker fade-up" style={{ animationDelay: '2.2s' }}>
              With joy and love, we invite you to the wedding of
            </p>
            <h1 className="names">
              <span className="name write" style={{ animationDelay: '2.6s' }}>{EVENT.groom}</span>
              <span className="and fade-up" style={{ animationDelay: '3.2s' }}>&amp;</span>
              <span className="name write" style={{ animationDelay: '3.5s' }}>{EVENT.bride}</span>
            </h1>
            <div className="divider draw"><Star className="divider-star" /></div>
            <p className="invite fade-up" style={{ animationDelay: '4.2s' }}>
              Your presence will complete our joy
            </p>
            <a href="#date" className="scroll-hint fade-up" style={{ animationDelay: '4.6s' }} aria-label="Scroll down">
              <span />
            </a>
          </section>

          <section className="section" id="date">
            <Reveal>
              <Star className="sec-star" />
              <p className="section-kicker">Save the Date</p>
            </Reveal>
            <Reveal delay={150}>
              <TiltCard className="date-card">
                <span className="shine" />
                <span className="day-name">{EVENT.dayName}</span>
                <div className="date-row">
                  <span className="side">December</span>
                  <span className="big">18</span>
                  <span className="side">2026</span>
                </div>
                <span className="time">{EVENT.timeLabel}</span>
              </TiltCard>
            </Reveal>
            <Reveal delay={300}><p className="count-title">Counting down to our day</p></Reveal>
            <Reveal delay={400}><Countdown /></Reveal>
          </section>

          <section className="section">
            <Reveal>
              <Star className="sec-star" />
              <p className="section-kicker">The Venue</p>
              <h2 className="venue">{EVENT.venue}</h2>
            </Reveal>
            <Reveal delay={200}>
              <div className="map">
                <iframe title="Villa Rihana map" src={EVENT.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </Reveal>
            <Reveal delay={350}>
              <a className="btn" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">Get Directions</a>
            </Reveal>
          </section>

          <footer className="footer">
            <Reveal>
              <div className="beat">♥</div>
              <p className="closing">We can’t wait to celebrate with you</p>
              <p className="sign">{EVENT.groom} &amp; {EVENT.bride} · {EVENT.dateLabel}</p>
            </Reveal>
          </footer>
        </main>
      )}
    </>
  )
}
