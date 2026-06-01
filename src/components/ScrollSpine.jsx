import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

// A fixed vertical rail that fills with pink and rides a coin marker down
// the page as the user scrolls — a cinematic reading-progress thread.
export default function ScrollSpine() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const top = useTransform(progress, [0, 1], ['0%', '100%'])
  const rotate = useTransform(progress, [0, 1], [0, 540])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-6 top-0 z-30 hidden h-screen w-7 xl:block"
    >
      {/* faint full-height track */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/12" />

      {/* pink fill from the top, grows with scroll */}
      <motion.div
        style={{ scaleY: progress }}
        className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 origin-top bg-penny-500"
      />

      {/* descending coin marker */}
      <motion.div style={{ top }} className="absolute left-1/2 -ml-3 -mt-3">
        <motion.div style={{ rotate }} className="relative">
          <span className="absolute inset-0 -m-1.5 rounded-full bg-penny-500/20 blur-[3px]" />
          <svg width="24" height="24" viewBox="0 0 24 24" className="relative">
            <circle cx="12" cy="12" r="11" fill="#F31E7A" />
            <circle cx="12" cy="12" r="7" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.75" />
            <line x1="12" y1="2" x2="12" y2="5" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}
