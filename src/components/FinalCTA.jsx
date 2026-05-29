import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import Reveal from './Reveal.jsx'

export default function FinalCTA() {
  const t = useT()
  const { openQuote } = useQuote()

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="section">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-penny-500 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-white/10" />

            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/80">{t('finalCta.eyebrow')}</p>
              <h2 className="display mx-auto mt-4 max-w-2xl text-4xl sm:text-6xl">
                {t('finalCta.title1')} <span className="text-ink">{t('finalCta.title2')}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/90 text-balance">{t('finalCta.subtitle')}</p>
              <button
                onClick={() => openQuote()}
                className="btn mt-9 bg-white px-8 py-4 text-base text-penny-600 shadow-soft hover:-translate-y-0.5 hover:bg-cream-light"
              >
                {t('finalCta.cta')}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <p className="mt-6 text-sm text-white/80">{t('finalCta.note')}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
