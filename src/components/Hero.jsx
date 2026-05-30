import { motion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import TiltQuoteCard from './TiltQuoteCard.jsx'

function Check() {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-penny-500 text-white">
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
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

        {/* Right: interactive 3D live quote visual */}
        <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
          <TiltQuoteCard />
        </div>
      </div>
    </section>
  )
}
