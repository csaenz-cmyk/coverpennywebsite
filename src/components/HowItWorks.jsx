import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import Reveal from './Reveal.jsx'

// Little decorative illustration per step.
function StepArt({ index }) {
  if (index === 0) {
    return (
      <div className="relative mx-auto flex h-36 w-full max-w-xs items-center justify-center">
        <div className="absolute h-28 w-40 rounded-full bg-penny-100" />
        <div className="relative w-32 rounded-2xl bg-white p-3 shadow-soft">
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
      <div className="relative mx-auto flex h-36 w-full max-w-xs items-center justify-center">
        <div className="absolute h-28 w-40 rounded-full bg-penny-100" />
        <div className="relative grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className={`h-7 w-7 rounded-lg ${i % 3 === 0 ? 'bg-penny-500' : 'bg-white shadow-soft'}`}
            />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="relative mx-auto flex h-36 w-full max-w-xs items-center justify-center">
      <div className="absolute h-28 w-40 rounded-full bg-penny-100" />
      <div className="relative flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-white shadow-soft">
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
  const steps = t('how.steps')

  return (
    <section id="how" className="bg-paper py-20 sm:py-28">
      <div className="section">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow eyebrow-dot">{t('how.eyebrow')}</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-6xl">
              {t('how.title1')} <br className="hidden sm:block" />
              <span className="text-penny-500">{t('how.title2')}</span>
            </h2>
          </div>
          <button onClick={() => openQuote()} className="btn-ghost">
            {t('how.skip')}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="card flex h-full flex-col p-7">
                <span className="font-mono text-sm font-bold text-penny-500">{s.n}</span>
                <StepArt index={i} />
                <h3 className="mt-6 text-xl font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 text-ink-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
