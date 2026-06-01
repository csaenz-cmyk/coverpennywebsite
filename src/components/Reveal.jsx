import { motion, useReducedMotion } from 'framer-motion'

// Fades + lifts children into view as they scroll into the viewport.
// Reveals enhance an already-visible default: with reduced motion we render
// the final state immediately (no gated visibility).
export default function Reveal({ children, delay = 0, className = '', y = 24 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}
