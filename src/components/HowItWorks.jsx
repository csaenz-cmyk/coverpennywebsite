import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'

const ease = [0.23, 1, 0.32, 1]

// Distinct mini illustration per step.
function StepArt({ index }) {
  if (index === 0) {
    return (
      <div className="relative flex h-32 items-center justify-center">
        <div className="w-36 rounded-2xl border border-ink/10 bg-white p-3 shadow-soft">
          <div className="h-1.5 w-2/3 rounded-full bg-ink/10" />
          <div className="mt-3 flex items-center justify-between rounded-lg border-2 border-penny-500 px-2 py-1.5">
            <span className="font-mono text-sm font-bold text-penny-500">90210</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-penny-500 text-white">
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full rounded-full bg-ink/10" />
        </div>
      </div>
    )
  }
  if (index === 1) {
    return (
      <div className="relative flex h-32 items-center justify-center">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={`h-7 w-7 rounded-lg ${i % 3 === 0 ? 'bg-penny-500' : 'border border-ink/10 bg-white'}`} />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="relative flex h-32 items-center justify-center">
      <div className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-white shadow-soft">
        <span className="font-mono text-sm font-bold tracking-wider">COVERED</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-penny-500">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const t = useT()
  const { openQuote } = useQuote()
  const reduce = useReducedMotion()
  const steps = t('how.steps')

  return (
    <section id="how" className="bg-paper py-20 sm:py-28">
      <div className="section">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease }}
            className="display text-[clamp(2.5rem,6vw,4.5rem)] text-ink"
          >
            {t('how.title1')} <span className="text-penny-500">{t('how.title2')}</span>
          </motion.h2>
          <button onClick={() => openQuote()} className="btn-ghost shrink-0">
            {t('how.skip')}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
            >
              <div className="flex items-center gap-4">
                <span className="display text-6xl text-penny-500">{s.n}</span>
                <span className="h-px flex-1 bg-ink/15" />
              </div>
              <StepArt index={i} />
              <h3 className="mt-4 text-2xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-ink-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
