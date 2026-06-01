import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import TiltQuoteCard from './TiltQuoteCard.jsx'
import Coin from './Coin.jsx'
import Coin3D from './Coin3D.jsx'

const ease = [0.23, 1, 0.32, 1]

export default function Hero() {
  const t = useT()
  const { openQuote } = useQuote()
  const reduce = useReducedMotion()
  const [tap, compare, covered] = t('hero.title')
  const badges = t('hero.badges')

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* Light texture + soft pink glow */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-penny-100/60 blur-3xl" />
      <Coin
        spin
        stroke="#F31E7A"
        className="pointer-events-none absolute -left-44 top-24 h-[34rem] w-[34rem] opacity-[0.07]"
      />

      <div className="section relative grid items-center gap-12 pb-16 pt-28 sm:pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-24">
        {/* Left: copy */}
        <div>
          <motion.div
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-soft"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-penny-500" />
            {t('hero.eyebrow')}
          </motion.div>

          <motion.h1
            {...rise(0.06)}
            className="display mt-7 text-[clamp(3rem,8.5vw,5.75rem)] leading-[0.98] text-ink"
          >
            {tap}
            <br />
            <span className="text-penny-500">{compare}</span>
            <br />
            {covered}
          </motion.h1>

          <motion.p {...rise(0.14)} className="mt-8 max-w-md text-lg font-medium text-ink-soft text-balance">
            {t('hero.subtitle')}
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
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

          <motion.ul {...rise(0.28)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5">
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-penny-500" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {b}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right: interactive 3D live quote card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto"
        >
          {/* Real 3D object: a spinning penny */}
          <Coin3D size={120} className="absolute -left-8 -top-12 z-10 hidden drop-shadow-xl sm:block" />
          <TiltQuoteCard />
        </motion.div>
      </div>
    </section>
  )
}
