import { useEffect, useRef, useState } from 'react'
import Couple from './Couple.jsx'
import Petals from './Petals.jsx'

// ---- Edit your details here ----
const EVENT = {
  groom: 'Ahmed',
  bride: 'Nada',
  dayName: 'Friday',
  timeLabel: '3:00 PM — 6:00 PM',
  venue: 'Villa Rihana',
  // Egypt is UTC+2 in December
  start: new Date('2026-12-18T15:00:00+02:00'),
  end: new Date('2026-12-18T18:00:00+02:00'),
  mapsUrl:
    'https://www.google.com/maps/place/Villa+Rihana/data=!4m2!3m1!1s0x0:0x383f54fc06dc5a10',
  mapsEmbed: 'https://maps.google.com/maps?q=Villa%20Rihana&z=15&output=embed',
}

const pad = (n) => String(n).padStart(2, '0')
const toICSDate = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}00Z`

const title = `${EVENT.groom} & ${EVENT.bride}'s Wedding`
const googleCalUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  `&text=${encodeURIComponent(title)}` +
  `&dates=${toICSDate(EVENT.start)}/${toICSDate(EVENT.end)}` +
  `&location=${encodeURIComponent(EVENT.venue)}` +
  `&details=${encodeURIComponent('We can’t wait to celebrate with you! ' + EVENT.mapsUrl)}`

function downloadICS() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ahmed & Nada//Wedding//EN',
    'BEGIN:VEVENT',
    'UID:ahmed-nada-20261218@wedding',
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(EVENT.start)}`,
    `DTEND:${toICSDate(EVENT.end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${EVENT.venue}`,
    `DESCRIPTION:${EVENT.mapsUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'ahmed-nada-wedding.ics'
  a.click()
  URL.revokeObjectURL(a.href)
}

// Fade/slide elements in as they scroll into view
function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
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
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

// Letter-by-letter animated text
function SplitText({ text, delay = 0, step = 0.08, className = '' }) {
  return (
    <span className={`split ${className}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} className="char" aria-hidden="true" style={{ animationDelay: `${delay + i * step}s` }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

// Card that tilts in 3D following the mouse / finger
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
  const open = () => {
    if (opening) return
    setOpening(true)
    setTimeout(onOpen, 1700)
  }
  return (
    <div className={`intro ${opening ? 'leaving' : ''}`}>
      <p className="intro-top">You are invited</p>
      <button className={`envelope ${opening ? 'open' : ''}`} onClick={open} aria-label="Open invitation">
        <span className="env-back" />
        <span className="env-letter">
          <span className="letter-names">A &amp; N</span>
          <span className="letter-date">18 · 12 · 2026</span>
        </span>
        <span className="env-front" />
        <span className="env-flap" />
        <span className="seal">A&amp;N</span>
        {opening && (
          <span className="burst" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i key={i} style={{ '--a': `${i * 20}deg`, '--d': `${60 + (i % 3) * 30}px` }}>♥</i>
            ))}
          </span>
        )}
      </button>
      <p className="tap">Tap the seal to open</p>
    </div>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const heroRef = useRef(null)

  // Parallax for the hero scene
  useEffect(() => {
    if (!opened) return
    const onScroll = () => heroRef.current?.style.setProperty('--sy', window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [opened])

  return (
    <>
      <Petals />
      {!opened && <Envelope onOpen={() => setOpened(true)} />}

      {opened && (
        <main className="page">
          <section className="hero" ref={heroRef}>
            <div className="hero-scene">
              <Couple />
            </div>
            <p className="kicker fade-up" style={{ animationDelay: '0.6s' }}>
              Together with their families
            </p>
            <h1 className="names">
              <SplitText text={EVENT.groom} delay={1.2} />
              <span className="amp fade-up" style={{ animationDelay: '1.8s' }}>&amp;</span>
              <SplitText text={EVENT.bride} delay={2.1} />
            </h1>
            <div className="divider draw" />
            <p className="invite fade-up" style={{ animationDelay: '2.8s' }}>
              request the honour of your presence
              <br />
              as they celebrate their wedding
            </p>
            <a href="#date" className="scroll-hint fade-up" style={{ animationDelay: '3.4s' }} aria-label="Scroll down">
              <span />
            </a>
          </section>

          <section className="section" id="date">
            <Reveal><p className="section-kicker">Save the date</p></Reveal>
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
            <Reveal delay={550}>
              <div className="buttons">
                <a className="btn" href={googleCalUrl} target="_blank" rel="noreferrer">Add to Google Calendar</a>
                <button className="btn ghost" onClick={downloadICS}>Apple / Outlook</button>
              </div>
            </Reveal>
          </section>

          <section className="section">
            <Reveal>
              <p className="section-kicker">The venue</p>
              <h2 className="venue">{EVENT.venue}</h2>
            </Reveal>
            <Reveal delay={200}>
              <div className="map">
                <iframe title="Villa Rihana map" src={EVENT.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </Reveal>
            <Reveal delay={350}>
              <a className="btn" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">Get directions</a>
            </Reveal>
          </section>

          <footer className="footer">
            <Reveal>
              <div className="beat">♥</div>
              <p className="closing">We can’t wait to celebrate with you</p>
              <p className="sign">{EVENT.groom} &amp; {EVENT.bride} · 18.12.2026</p>
            </Reveal>
          </footer>
        </main>
      )}
    </>
  )
}
