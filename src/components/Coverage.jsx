import { motion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import Reveal from './Reveal.jsx'

const ORDER = ['auto', 'home', 'business', 'moto']

function CheckDot() {
  return (
    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-penny-500 text-white">
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

function Card({ typeKey, index }) {
  const t = useT()
  const { openQuote } = useQuote()
  const c = t(`coverage.types.${typeKey}`)

  return (
    <motion.button
      type="button"
      onClick={() => openQuote(typeKey)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="card card-hover group flex flex-col p-6 text-left sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-penny-100 text-3xl">
          {c.emoji}
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{t('coverage.from')}</div>
          <div className="font-sans text-2xl font-extrabold text-ink">
            ${c.price}
            <span className="text-sm font-medium text-ink-muted">{t('coverage.perMo')}</span>
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-2xl font-extrabold text-ink">{c.name}</h3>
      <p className="mt-1 text-ink-muted">{c.desc}</p>

      <ul className="mt-5 space-y-2.5">
        {c.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <CheckDot />
            {b}
          </li>
        ))}
      </ul>

      <span className="mt-6 inline-flex items-center gap-2 font-semibold text-penny-500">
        {t('coverage.start')} {c.name.toLowerCase()} {t('coverage.quote')}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </motion.button>
  )
}

export default function Coverage() {
  const t = useT()

  return (
    <section id="coverage" className="bg-grid bg-white py-20 sm:py-28">
      <div className="section">
        <Reveal>
          <p className="eyebrow eyebrow-dot">{t('coverage.eyebrow')}</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-6xl">
            {t('coverage.title1')} <span className="text-penny-500">{t('coverage.title2')}</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink-soft text-balance">{t('coverage.subtitle')}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {ORDER.map((key, i) => (
            <Card key={key} typeKey={key} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
