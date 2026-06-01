import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import Car3D from './Car3D.jsx'

function makeRng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

// Monotonic weaving spine (so the car stays in sync with scroll). It also
// skirts the edge of each loop word so the road appears to curve around it.
function buildSpine(w, h, anchors) {
  if (!w || !h) return ''
  const rng = makeRng(98765)
  const minX = w * 0.12
  const maxX = w * 0.88
  const gap = w < 640 ? 220 : 300

  const pts = [{ x: w * 0.5, y: 0 }]
  let y = 0
  while (y < h - 120) {
    y += gap + rng() * (gap * 0.8)
    pts.push({ x: minX + rng() * (maxX - minX), y: Math.min(h, y) })
  }
  for (const a of anchors) pts.push({ x: a.x + a.rad * 0.95, y: a.y })
  pts.sort((a, b) => a.y - b.y)

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  let prev = pts[0]
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]
    const midY = (prev.y + p.y) / 2
    d += ` C ${prev.x.toFixed(1)} ${midY.toFixed(1)}, ${p.x.toFixed(1)} ${midY.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    prev = p
  }
  return d
}

function Stop({ x, y, emoji, label, scale }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <line x1="0" y1="0" x2="0" y2="-24" stroke="#111" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="2 3" />
      <g transform="translate(0 -40)">
        <rect x="-15" y="-15" width="30" height="30" rx="9" fill="#fff" stroke="#111" strokeOpacity="0.12" strokeWidth="1" style={{ filter: 'drop-shadow(0 4px 10px rgba(17,17,17,0.16))' }} />
        <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fontSize="16">{emoji}</text>
        {label && (
          <text x="0" y="26" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontSize="8" letterSpacing="1" fill="#9a0a48">
            {label}
          </text>
        )}
      </g>
    </g>
  )
}

// Road styling reused for the spine and the roundabouts.
function RoadStrokes({ d, circle }) {
  const Tag = circle ? 'circle' : 'path'
  const common = circle ? { cx: circle.x, cy: circle.y, r: circle.r, fill: 'none' } : { d }
  return (
    <>
      <Tag {...common} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="9" strokeLinecap="round" />
      <Tag {...common} stroke="#1b1b1b" strokeOpacity="0.82" strokeWidth="6" strokeLinecap="round" />
      <Tag {...common} stroke="#ffd23f" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="7 9" />
    </>
  )
}

const STOP_DEFS = [
  { t: 0.24, emoji: '⛽', label: 'GAS' },
  { t: 0.5, emoji: '🚧', label: 'OBRA' },
  { t: 0.76, emoji: '🛞', label: 'LLANTAS' },
]

export default function ScrollPath() {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [loops, setLoops] = useState([])
  const pathRef = useRef(null)
  const loopsRef = useRef([])
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const angle = useMotionValue(0)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 })

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth
      setSize({ w, h: document.documentElement.scrollHeight })
      const sx = window.scrollX
      const sy = window.scrollY
      const found = [...document.querySelectorAll('[data-road="loop"]')].map((el) => {
        const r = el.getBoundingClientRect()
        let rad = Math.min(86, Math.max(36, Math.min(r.width, r.height) / 2 + 12))
        rad = Math.min(rad, w * 0.22)
        return { x: r.left + sx + r.width / 2, y: r.top + sy + r.height / 2, rad }
      })
      loopsRef.current = found
      setLoops(found)
    }
    measure()
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    const id = setTimeout(measure, 700)
    return () => {
      window.removeEventListener('resize', measure)
      ro.disconnect()
      clearTimeout(id)
    }
  }, [])

  const isMobile = size.w > 0 && size.w < 640
  const carSize = isMobile ? 44 : 66
  const stopScale = isMobile ? 0.8 : 1

  const d = useMemo(() => buildSpine(size.w, size.h, loops), [size.w, size.h, loops])

  const stops = useMemo(() => {
    if (!d) return []
    try {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', d)
      const total = path.getTotalLength()
      if (!total) return []
      return STOP_DEFS.map((s) => {
        const pt = path.getPointAtLength(total * s.t)
        return { x: pt.x, y: pt.y, emoji: s.emoji, label: s.label }
      })
    } catch {
      return []
    }
  }, [d])

  // Drive the car: follow the spine (tracks scroll) + a full 360° spin as it
  // passes each loop word.
  useEffect(() => {
    const place = (p) => {
      const path = pathRef.current
      if (!path) return
      const len = path.getTotalLength()
      if (!len) return
      const at = Math.min(1, Math.max(0, p)) * len
      const pt = path.getPointAtLength(at)
      const ahead = path.getPointAtLength(Math.min(len, at + 2))
      let ang = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI
      for (const a of loopsRef.current) {
        const band = (a.rad || 60) * 1.8
        const t = (pt.y - (a.y - band)) / (2 * band)
        ang += 360 * Math.min(1, Math.max(0, t))
      }
      x.set(pt.x)
      y.set(pt.y)
      angle.set(ang)
    }
    place(progress.get())
    const unsub = progress.on('change', place)
    return () => unsub()
  }, [d, progress, x, y, angle])

  if (!d) return null

  return (
    <>
      <svg
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        className="pointer-events-none absolute left-0 top-0 z-20"
        style={{ height: size.h }}
        fill="none"
        aria-hidden="true"
      >
        {/* roundabouts around the key words */}
        {loops.map((a, i) => (
          <RoadStrokes key={`loop${i}`} circle={{ x: a.x, y: a.y, r: a.rad }} />
        ))}
        {/* the road (spine) */}
        <path ref={pathRef} d={d} stroke="transparent" strokeWidth="1" />
        <RoadStrokes d={d} />

        {stops.map((s, i) => (
          <Stop key={i} {...s} scale={stopScale} />
        ))}
      </svg>

      {/* the volumetric 3D car, positioned + yawed (and spinning at words) */}
      <motion.div style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-30">
        <Car3D angle={angle} size={carSize} />
      </motion.div>
    </>
  )
}
