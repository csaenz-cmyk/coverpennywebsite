import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'

// Build a winding vertical path that weaves left/center/right down the page.
function buildPath(w, h) {
  if (!w || !h) return ''
  const L = w * 0.1
  const R = w * 0.9
  const M = w * 0.5
  const cols = [M, R, w * 0.18, w * 0.82, L, M] // varied weave, not a strict zig-zag
  const step = 480
  const n = Math.max(3, Math.round(h / step))
  const dy = h / n
  let prevX = M
  let d = `M ${M} 0`
  for (let i = 1; i <= n; i++) {
    const yTo = Math.min(h, dy * i)
    const yc = yTo - dy * 0.5
    const nx = cols[i % cols.length]
    // S-curve into each waypoint
    d += ` C ${prevX} ${yc}, ${nx} ${yc}, ${nx} ${yTo}`
    prevX = nx
  }
  return d
}

export default function ScrollPath() {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const pathRef = useRef(null)
  const markerX = useMotionValue(0)
  const markerY = useMotionValue(0)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  // Measure the full document so the SVG can span every section.
  useEffect(() => {
    const measure = () =>
      setSize({ w: window.innerWidth, h: document.documentElement.scrollHeight })
    measure()
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    const id = setTimeout(measure, 600) // after fonts/layout settle
    return () => {
      window.removeEventListener('resize', measure)
      ro.disconnect()
      clearTimeout(id)
    }
  }, [])

  const d = useMemo(() => buildPath(size.w, size.h), [size.w, size.h])

  // Move the coin marker along the curve as progress changes.
  useEffect(() => {
    const place = (p) => {
      const path = pathRef.current
      if (!path) return
      const len = path.getTotalLength()
      if (!len) return
      const pt = path.getPointAtLength(len * Math.min(1, Math.max(0, p)))
      markerX.set(pt.x)
      markerY.set(pt.y)
    }
    place(progress.get())
    const unsub = progress.on('change', place)
    return () => unsub()
  }, [d, progress, markerX, markerY])

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
      {/* faint full guide */}
      <path d={d} stroke="#F31E7A" strokeOpacity="0.1" strokeWidth="2.5" strokeLinecap="round" />
      {/* drawn portion follows scroll */}
      <motion.path
        ref={pathRef}
        d={d}
        stroke="#F31E7A"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ pathLength: progress, filter: 'drop-shadow(0 2px 6px rgba(243,30,122,0.35))' }}
      />
      {/* traveling coin marker */}
      <motion.g style={{ x: markerX, y: markerY }}>
        <circle r="13" fill="#F31E7A" />
        <circle r="13" fill="none" stroke="#fff" strokeWidth="2" strokeOpacity="0.25" />
        <circle r="7.5" fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="0" y1="-13" x2="0" y2="-8" stroke="#fff" strokeWidth="2" />
      </motion.g>
    </svg>
  )
}
