import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import Coin from './Coin.jsx'

const ease = [0.23, 1, 0.32, 1]

export default function FinalCTA() {
  const t = useT()
  const { openQuote } = useQuote()
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-penny-500 py-24 text-ink sm:py-32">
      <Coin spin stroke="#111111" className="pointer-events-none absolute -left-24 -bottom-28 h-[26rem] w-[26rem] opacity-[0.07]" />
      <Coin stroke="#ffffff" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 opacity-20" />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
        className="section relative text-center"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-ink/70">{t('finalCta.eyebrow')}</p>
        <h2 className="display mx-auto mt-5 max-w-3xl text-[clamp(2.75rem,8vw,6rem)] text-ink">
          {t('finalCta.title1')} <span className="text-white">{t('finalCta.title2')}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-ink/80 text-balance">{t('finalCta.subtitle')}</p>
        <button onClick={() => openQuote()} className="btn-dark mx-auto mt-10 text-base">
          {t('finalCta.cta')}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p className="mt-6 text-sm font-medium text-ink/70">{t('finalCta.note')}</p>
      </motion.div>
    </section>
  )
}
