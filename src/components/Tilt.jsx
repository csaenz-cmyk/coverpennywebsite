import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Reusable 3D tilt wrapper — children rotate toward the cursor.
export default function Tilt({ children, max = 8, className = '', perspective = 900 }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const spring = { stiffness: 200, damping: 18, mass: 0.3 }
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), spring)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), spring)

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div style={{ perspective }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}
