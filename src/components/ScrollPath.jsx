import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'

// Small seeded RNG so the road shape is stable between renders.
function makeRng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

// Build a winding road that weaves down the page and loops around the
// elements tagged [data-road="loop"] (key words like savings / today).
function buildPath(w, h, loops) {
  if (!w || !h) return ''
  const rng = makeRng(98765)
  const minX = w * 0.12
  const maxX = w * 0.88

  // algorithmic waypoints, varied (not a repeating zig-zag)
  const pts = []
  let y = 0
  pts.push({ x: w * 0.5, y: 0 })
  while (y < h - 120) {
    y += 280 + rng() * 260
    pts.push({ x: minX + rng() * (maxX - minX), y: Math.min(h, y) })
  }
  // merge loop anchors by y
  for (const l of loops) pts.push({ ...l, loop: true })
  pts.sort((a, b) => a.y - b.y)

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  let prev = pts[0]
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]
    if (p.loop) {
      const top = { x: p.x, y: p.y - p.rad }
      const midY = (prev.y + top.y) / 2
      d += ` C ${prev.x.toFixed(1)} ${midY.toFixed(1)}, ${top.x.toFixed(1)} ${midY.toFixed(1)}, ${top.x.toFixed(1)} ${top.y.toFixed(1)}`
      // full circle around the word (two arcs)
      d += ` A ${p.rad} ${p.rad} 0 1 1 ${p.x.toFixed(1)} ${(p.y + p.rad).toFixed(1)}`
      d += ` A ${p.rad} ${p.rad} 0 1 1 ${top.x.toFixed(1)} ${top.y.toFixed(1)}`
      prev = top
    } else {
      const midY = (prev.y + p.y) / 2
      d += ` C ${prev.x.toFixed(1)} ${midY.toFixed(1)}, ${p.x.toFixed(1)} ${midY.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
      prev = p
    }
  }
  return d
}

// A glossy, shaded 3D-ish car with tail lights. Faces +x (travel direction).
function Car() {
  return (
    <g>
      {/* drop shadow */}
      <ellipse cx="0" cy="3" rx="18" ry="10" fill="#111" opacity="0.16" />
      {/* wheels */}
      <rect x="-10" y="-11" width="7" height="3.5" rx="1.75" fill="#0b0b0b" />
      <rect x="4" y="-11" width="7" height="3.5" rx="1.75" fill="#0b0b0b" />
      <rect x="-10" y="7.5" width="7" height="3.5" rx="1.75" fill="#0b0b0b" />
      <rect x="4" y="7.5" width="7" height="3.5" rx="1.75" fill="#0b0b0b" />
      {/* tail lights (rear, -x) with glow */}
      <rect x="-17" y="-6" width="4" height="3.5" rx="1.5" fill="#ff2d2d" />
      <rect x="-17" y="2.5" width="4" height="3.5" rx="1.5" fill="#ff2d2d" />
      <rect x="-18.5" y="-6.5" width="3" height="13" rx="1.5" fill="#ff2d2d" opacity="0.35" />
      {/* body */}
      <rect x="-15" y="-8" width="30" height="16" rx="6" fill="url(#carBody)" stroke="#9a0a48" strokeWidth="1" />
      {/* gloss highlight */}
      <rect x="-12" y="-6.5" width="24" height="4" rx="2" fill="#fff" opacity="0.28" />
      {/* cabin / glass */}
      <rect x="-6" y="-5.5" width="12" height="11" rx="3" fill="url(#carGlass)" />
      <rect x="-4.5" y="-4.5" width="3.5" height="9" rx="1.5" fill="#fff" opacity="0.18" />
      {/* headlights (front, +x) */}
      <rect x="13.5" y="-6" width="2.5" height="3" rx="1" fill="#fff7d6" />
      <rect x="13.5" y="3" width="2.5" height="3" rx="1" fill="#fff7d6" />
    </g>
  )
}

// A roadside pit stop (gas / work / coffee).
function Stop({ x, y, emoji, label }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="0" y1="0" x2="0" y2="-26" stroke="#111" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="2 3" />
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

const STOP_DEFS = [
  { t: 0.26, emoji: '⛽', label: 'GAS' },
  { t: 0.54, emoji: '🚧', label: 'WORK' },
  { t: 0.78, emoji: '☕', label: 'STOP' },
]

export default function ScrollPath() {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [loops, setLoops] = useState([])
  const pathRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const angle = useMotionValue(0)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 })

  // Measure page + the key words to loop around.
  useEffect(() => {
    const measure = () => {
      setSize({ w: window.innerWidth, h: document.documentElement.scrollHeight })
      const sx = window.scrollX
      const sy = window.scrollY
      const found = [...document.querySelectorAll('[data-road="loop"]')].map((el) => {
        const r = el.getBoundingClientRect()
        const rad = Math.min(92, Math.max(42, Math.min(r.width, r.height) / 2 + 16))
        return { x: r.left + sx + r.width / 2, y: r.top + sy + r.height / 2, rad }
      })
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

  const d = useMemo(() => buildPath(size.w, size.h, loops), [size.w, size.h, loops])

  // Precompute stop positions from the path geometry.
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

  // Drive the car along the road.
  useEffect(() => {
    const place = (p) => {
      const path = pathRef.current
      if (!path) return
      const len = path.getTotalLength()
      if (!len) return
      const at = Math.min(1, Math.max(0, p)) * len
      const pt = path.getPointAtLength(at)
      const ahead = path.getPointAtLength(Math.min(len, at + 2))
      x.set(pt.x)
      y.set(pt.y)
      angle.set((Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI)
    }
    place(progress.get())
    const unsub = progress.on('change', place)
    return () => unsub()
  }, [d, progress, x, y, angle])

  if (!d) return null

  return (
    <svg
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
      style={{ height: size.h }}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="carBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7db0" />
          <stop offset="0.55" stopColor="#f31e7a" />
          <stop offset="1" stopColor="#c50e5e" />
        </linearGradient>
        <linearGradient id="carGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#0d0d0d" />
        </linearGradient>
      </defs>

      {/* road bed */}
      <path d={d} stroke="#F31E7A" strokeOpacity="0.1" strokeWidth="7" strokeLinecap="round" />
      {/* tire tracks (dashed tread) */}
      <path d={d} stroke="#111" strokeOpacity="0.28" strokeWidth="2" strokeDasharray="5 9" strokeLinecap="round" />
      {/* bright painted trail behind the car */}
      <motion.path
        ref={pathRef}
        d={d}
        stroke="#F31E7A"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ pathLength: progress, filter: 'drop-shadow(0 2px 6px rgba(243,30,122,0.35))' }}
      />

      {/* roadside stops */}
      {stops.map((s, i) => (
        <Stop key={i} {...s} />
      ))}

      {/* the 3D car on a puck */}
      <motion.g style={{ x, y }}>
        <circle r="22" fill="#fff" stroke="#111" strokeOpacity="0.8" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 3px 9px rgba(17,17,17,0.22))' }} />
        <motion.g style={{ rotate: angle }}>
          <Car />
        </motion.g>
      </motion.g>
    </svg>
  )
}
