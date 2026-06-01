import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'

const ORDER = ['auto', 'home', 'business', 'moto']
const ease = [0.23, 1, 0.32, 1]

function Row({ typeKey, index }) {
  const t = useT()
  const { openQuote } = useQuote()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const c = t(`coverage.types.${typeKey}`)

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      className="group border-t border-ink/15 last:border-b"
    >
      <button
        type="button"
        onClick={() => openQuote(typeKey)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="flex w-full items-center gap-4 py-6 text-left sm:gap-6 sm:py-7"
      >
        <span className="text-3xl transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-rotate-12 sm:text-4xl">
          {c.emoji}
        </span>

        <span className="flex min-w-0 flex-1 items-baseline gap-3 sm:gap-5">
          <span className="display text-3xl text-ink transition-colors group-hover:text-penny-500 sm:text-5xl">
            {c.name}
          </span>
          <span className="leader hidden text-ink sm:block" />
          <span className="hidden shrink-0 text-right font-mono text-sm text-ink-muted sm:block">
            {t('coverage.from')}
          </span>
        </span>

        <span className="shrink-0 text-right">
          <span className="display text-3xl text-ink sm:text-4xl">${c.price}</span>
          <span className="font-mono text-xs text-ink-muted">{t('coverage.perMo')}</span>
        </span>

        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 sm:flex">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-6 pl-12 text-ink-soft sm:pl-[3.75rem]">
              <span className="text-base text-ink-muted">{c.desc}</span>
              {c.bullets.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-sm">
                  <span className="h-1 w-1 rounded-full bg-penny-500" />
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Coverage() {
  const t = useT()
  const reduce = useReducedMotion()

  return (
    <section id="coverage" className="bg-white py-20 sm:py-28">
      <div className="section">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 max-w-3xl"
        >
          <h2 className="display text-[clamp(2.5rem,6vw,4.5rem)] text-ink">
            {t('coverage.title1')} <span data-road="loop" className="text-penny-500">{t('coverage.title2')}</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-ink-soft text-balance">{t('coverage.subtitle')}</p>
        </motion.div>

        <div>
          {ORDER.map((key, i) => (
            <Row key={key} typeKey={key} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
