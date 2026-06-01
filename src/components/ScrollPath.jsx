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

// Road runs down the left/right margins (out of the text) and only crosses
// the middle on diagonals. At each loop word it detours to the word's edge.
function buildSpine(w, h, anchors) {
  if (!w || !h) return ''
  const rng = makeRng(98765)
  const mobile = w < 640
  const left = [mobile ? 0.03 : 0.05, mobile ? 0.11 : 0.16]
  const right = [mobile ? 0.89 : 0.84, mobile ? 0.97 : 0.95]
  const gap = mobile ? 230 : 300

  const pts = [{ x: w * 0.5, y: 0 }]
  let y = 0
  let k = 0
  while (y < h - 120) {
    y += gap + rng() * (gap * 0.7)
    const band = Math.floor(k / 2) % 2 ? right : left // stay 2 steps per side
    const x = (band[0] + rng() * (band[1] - band[0])) * w
    pts.push({ x, y: Math.min(h, y) })
    k++
  }
  for (const a of anchors) pts.push({ x: a.x + a.rad, y: a.y })
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

// Car position for a given scroll progress: follow the spine, but trace a full
// circle around any loop word as we pass it (then continue).
function carPoint(p, path, len, loops) {
  const at = Math.min(1, Math.max(0, p)) * len
  const pt = path.getPointAtLength(at)
  let cx = pt.x
  let cy = pt.y
  for (const a of loops) {
    const band = a.rad * 2.2
    const t = (pt.y - (a.y - band)) / (2 * band)
    if (t > 0 && t < 1) {
      const wgt = Math.sin(Math.PI * t)
      const th = 2 * Math.PI * t
      const ox = a.x + a.rad * Math.cos(th)
      const oy = a.y + a.rad * Math.sin(th)
      cx = cx * (1 - wgt) + ox * wgt
      cy = cy * (1 - wgt) + oy * wgt
      break
    }
  }
  return { x: cx, y: cy }
}

function Stop({ x, y, emoji, label, scale }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <line x1="0" y1="0" x2="0" y2="-24" stroke="#9a0a48" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="2 3" />
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

// Pink road: white casing + pink surface + white dashes => visible on white,
// pink and black backgrounds.
function RoadStrokes({ d, circle }) {
  const Tag = circle ? 'circle' : 'path'
  const c = circle ? { cx: circle.x, cy: circle.y, r: circle.r, fill: 'none' } : { d }
  return (
    <>
      <Tag {...c} stroke="#ffffff" strokeOpacity="0.85" strokeWidth="8.5" strokeLinecap="round" />
      <Tag {...c} stroke="#F31E7A" strokeWidth="5.5" strokeLinecap="round" />
      <Tag {...c} stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="7 9" />
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
        let rad = Math.min(80, Math.max(34, Math.min(r.width, r.height) / 2 + 12))
        rad = Math.min(rad, w * 0.2)
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

  useEffect(() => {
    const place = (p) => {
      const path = pathRef.current
      if (!path) return
      const len = path.getTotalLength()
      if (!len) return
      const c = carPoint(p, path, len, loopsRef.current)
      const c2 = carPoint(Math.min(1, p + 0.0015), path, len, loopsRef.current)
      x.set(c.x)
      y.set(c.y)
      angle.set((Math.atan2(c2.y - c.y, c2.x - c.x) * 180) / Math.PI)
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

      {/* the volumetric 3D car */}
      <motion.div style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-30">
        <Car3D angle={angle} size={carSize} />
      </motion.div>
    </>
  )
}
