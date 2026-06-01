import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'

// A winding "road" that weaves across the page with plenty of turns.
function buildPath(w, h) {
  if (!w || !h) return ''
  const M = w * 0.5
  const cols = [M, w * 0.86, w * 0.14, w * 0.78, w * 0.28, w * 0.9, w * 0.1, w * 0.6]
  const step = 360
  const n = Math.max(4, Math.round(h / step))
  const dy = h / n
  let prevX = M
  let d = `M ${M} 0`
  for (let i = 1; i <= n; i++) {
    const yTo = Math.min(h, dy * i)
    const yc = yTo - dy * 0.55
    const nx = cols[i % cols.length]
    d += ` C ${prevX} ${yc}, ${nx} ${yc}, ${nx} ${yTo}`
    prevX = nx
  }
  return d
}

// Top-down car that drives along the path; faces +x at angle 0.
function Car() {
  return (
    <g>
      {/* wheels */}
      <rect x="-9" y="-9.5" width="6" height="3" rx="1.5" fill="#111" />
      <rect x="3" y="-9.5" width="6" height="3" rx="1.5" fill="#111" />
      <rect x="-9" y="6.5" width="6" height="3" rx="1.5" fill="#111" />
      <rect x="3" y="6.5" width="6" height="3" rx="1.5" fill="#111" />
      {/* body */}
      <rect x="-12" y="-7" width="24" height="14" rx="4.5" fill="#F31E7A" stroke="#111" strokeWidth="1.5" />
      {/* windshield toward the front */}
      <rect x="2" y="-4.5" width="6" height="9" rx="2" fill="#111" opacity="0.85" />
      {/* rear window */}
      <rect x="-8" y="-4" width="4" height="8" rx="1.5" fill="#111" opacity="0.3" />
      {/* headlight */}
      <circle cx="11" cy="0" r="1.3" fill="#fff" />
    </g>
  )
}

export default function ScrollPath() {
  const [size, setSize] = useState({ w: 0, h: 0 })
  const pathRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const angle = useMotionValue(0)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 })

  useEffect(() => {
    const measure = () => setSize({ w: window.innerWidth, h: document.documentElement.scrollHeight })
    measure()
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    const id = setTimeout(measure, 600)
    return () => {
      window.removeEventListener('resize', measure)
      ro.disconnect()
      clearTimeout(id)
    }
  }, [])

  const d = useMemo(() => buildPath(size.w, size.h), [size.w, size.h])

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
      {/* faint full guide road */}
      <path d={d} stroke="#F31E7A" strokeOpacity="0.12" strokeWidth="2.5" strokeLinecap="round" />
      {/* bright trail that paints behind the car as you scroll */}
      <motion.path
        ref={pathRef}
        d={d}
        stroke="#F31E7A"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ pathLength: progress, filter: 'drop-shadow(0 2px 6px rgba(243,30,122,0.35))' }}
      />

      {/* the car, on a puck with a hairline ring so it reads on any background */}
      <motion.g style={{ x, y }}>
        <circle r="22" fill="#fff" stroke="#111" strokeOpacity="0.85" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 3px 9px rgba(17,17,17,0.22))' }} />
        <motion.g style={{ rotate: angle }}>
          <g transform="scale(1.35)">
            <Car />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  )
}
