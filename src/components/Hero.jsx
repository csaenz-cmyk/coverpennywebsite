import { motion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import CarrierMark from './CarrierMark.jsx'

function Check() {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-penny-500 text-white">
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

// Decorative "live quote" panel — communicates the product at a glance.
function QuotePanel() {
  const rows = [
    { name: 'Throttle Mutual', shape: 'half', tone: 'penny', price: 47, best: true },
    { name: 'Pinecrest', shape: 'circle', tone: 'ink', price: 49 },
    { name: 'Maple Reserve', shape: 'triangle', tone: 'ink', price: 52 },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative"
    >
      <div className="animate-float-slow rounded-3xl border border-ink bg-white p-5 shadow-hard">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-penny-500 align-middle" />
            Live quote
          </span>
          <span className="chip">60s</span>
        </div>

        <div className="mt-4 space-y-2.5">
          {rows.map((r) => (
            <div
              key={r.name}
              className={`flex items-center justify-between rounded-2xl border p-3 ${
                r.best ? 'border-penny-500 bg-penny-50' : 'border-ink/10 bg-white'
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
                  <div className="font-mono text-[10px] text-ink-muted">★ 4.{r.best ? 9 : 6}</div>
                </div>
              </div>
              <div className="text-lg font-extrabold text-ink">
                ${r.price}
                <span className="text-[11px] font-medium text-ink-muted">/mo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating savings badge */}
      <div className="absolute -bottom-5 -left-5 rotate-[-6deg] rounded-2xl border border-ink bg-ink px-4 py-2 text-white shadow-hard-pink">
        <div className="font-mono text-[10px] uppercase tracking-widest text-white/60">You save</div>
        <div className="text-xl font-extrabold text-penny-400">$487/yr</div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const t = useT()
  const { openQuote } = useQuote()
  const [tap, compare, covered] = t('hero.title')
  const badges = t('hero.badges')

  return (
    <section id="top" className="relative overflow-hidden bg-white pt-28 pb-16 sm:pt-32 sm:pb-24">
      {/* Texture + soft color */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -right-40 -top-32 h-[40rem] w-[40rem] rounded-full bg-penny-100/70 blur-3xl" />

      <div className="section relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div>
          <motion.p
            className="eyebrow eyebrow-dot"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('hero.eyebrow')}
          </motion.p>

          <motion.h1
            className="display mt-5 text-[3.25rem] leading-[0.92] text-ink sm:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            {tap}{' '}
            <span className="relative whitespace-nowrap text-penny-500">
              {compare}
              <svg
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-penny-500"
              >
                <path d="M2 8 C 80 2, 220 2, 298 7" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>{' '}
            {covered}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-md text-lg text-ink-soft text-balance"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <button onClick={() => openQuote()} className="btn-primary text-base">
              {t('hero.cta')}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <div className="flex items-center gap-2 font-mono text-sm text-ink-muted">
              <span className="text-penny-500">★★★★★</span>
              {t('hero.rating')}
            </div>
          </motion.div>

          <motion.ul
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                <Check />
                {b}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right: live quote visual */}
        <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
          <QuotePanel />
        </div>
      </div>
    </section>
  )
}
