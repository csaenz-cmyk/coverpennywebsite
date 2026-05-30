import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import CarrierMark from './CarrierMark.jsx'

const ROWS = [
  { name: 'Throttle Mutual', shape: 'half', tone: 'penny', price: 47, rating: '4.9', best: true },
  { name: 'Pinecrest', shape: 'circle', tone: 'ink', price: 49, rating: '4.6' },
  { name: 'Maple Reserve', shape: 'triangle', tone: 'ink', price: 52, rating: '4.6' },
]

// Interactive 3D tilt card that follows the cursor, with layered depth + glare.
export default function TiltQuoteCard() {
  const ref = useRef(null)
  const mx = useMotionValue(0) // -0.5 .. 0.5
  const my = useMotionValue(0)

  const spring = { stiffness: 150, damping: 16, mass: 0.4 }
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), spring)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), spring)

  // Glare follows the cursor.
  const glareX = useTransform(mx, [-0.5, 0.5], ['10%', '90%'])
  const glareY = useTransform(my, [-0.5, 0.5], ['0%', '100%'])
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.55), transparent 45%)`

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
    <div style={{ perspective: 1100 }} className="select-none">
      <div className="animate-float-slow">
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={reset}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative"
        >
          {/* Card body */}
          <div className="relative overflow-hidden rounded-3xl border border-ink bg-white p-5 shadow-hard">
            <div style={{ transform: 'translateZ(40px)' }} className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-penny-500 align-middle" />
                Live quote
              </span>
              <span className="chip">60s</span>
            </div>

            <div className="mt-4 space-y-2.5" style={{ transformStyle: 'preserve-3d' }}>
              {ROWS.map((r, i) => (
                <div
                  key={r.name}
                  style={{ transform: `translateZ(${r.best ? 55 : 30 - i * 6}px)` }}
                  className={`flex items-center justify-between rounded-2xl border p-3 ${
                    r.best ? 'border-penny-500 bg-penny-50 shadow-card' : 'border-ink/10 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-soft">
                      <CarrierMark shape={r.shape} tone={r.tone} size={16} />
                    </span>
                    <div className="leading-tight">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
                        {r.name}
                        {r.best && (
                          <span className="rounded-full bg-penny-500 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-ink-muted">★ {r.rating}</div>
                    </div>
                  </div>
                  <div className="text-lg font-extrabold text-ink">
                    ${r.price}
                    <span className="text-[11px] font-medium text-ink-muted">/mo</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Moving glare */}
            <motion.div style={{ background: glare }} className="pointer-events-none absolute inset-0" />
          </div>

          {/* Savings badge — pops furthest out of the screen */}
          <div
            style={{ transform: 'translateZ(90px)' }}
            className="absolute -bottom-5 -left-5 rotate-[-6deg] rounded-2xl border border-ink bg-ink px-4 py-2 text-white shadow-hard-pink"
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/60">You save</div>
            <div className="text-xl font-extrabold text-penny-400">$487/yr</div>
          </div>

          {/* Floating pink dot accent */}
          <div
            style={{ transform: 'translateZ(120px)' }}
            className="absolute -right-3 -top-3 h-5 w-5 rounded-full bg-penny-500 shadow-card"
          />
        </motion.div>
      </div>
    </div>
  )
}
