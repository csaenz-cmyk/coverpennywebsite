import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import TiltQuoteCard from './TiltQuoteCard.jsx'
import Coin from './Coin.jsx'

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
    <section id="top" className="relative overflow-hidden bg-penny-500 text-ink">
      {/* Coin motifs drenched into the pink */}
      <Coin
        spin
        stroke="#111111"
        className="pointer-events-none absolute -left-40 top-10 h-[36rem] w-[36rem] opacity-[0.06]"
      />
      <Coin
        stroke="#ffffff"
        className="pointer-events-none absolute -right-24 -bottom-32 h-[28rem] w-[28rem] opacity-20"
      />

      <div className="section relative grid items-center gap-12 pb-16 pt-28 sm:pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-24">
        {/* Left: copy */}
        <div>
          <motion.div {...rise(0)} className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-penny-400" />
            {t('hero.eyebrow')}
          </motion.div>

          <motion.h1 {...rise(0.06)} className="display mt-6 text-[clamp(3rem,9vw,6rem)] text-ink">
            {tap}
            <br />
            <span className="relative inline-block text-white">
              {compare}
              <svg viewBox="0 0 320 14" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full text-ink">
                <path d="M3 9 C 90 3, 230 3, 317 8" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            <br />
            {covered}
          </motion.h1>

          <motion.p {...rise(0.14)} className="mt-7 max-w-md text-lg font-medium text-ink/80 text-balance">
            {t('hero.subtitle')}
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button onClick={() => openQuote()} className="btn-dark text-base">
              {t('hero.cta')}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <div className="flex items-center gap-2 font-mono text-sm text-ink/70">
              <span className="text-ink">★★★★★</span>
              {t('hero.rating')}
            </div>
          </motion.div>

          <motion.ul {...rise(0.28)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5">
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-semibold text-ink/85">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink" fill="none" stroke="currentColor" strokeWidth="3">
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
          <TiltQuoteCard />
        </motion.div>
      </div>
    </section>
  )
}
