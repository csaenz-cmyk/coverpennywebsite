import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../../i18n/LanguageContext.jsx'
import CarrierMark from '../CarrierMark.jsx'

export default function QuoteResults({ quotes, coverageType, onRestart, onClose }) {
  const t = useT()
  const [selected, setSelected] = useState(null)
  const features = t(`coverage.types.${coverageType}.bullets`)

  return (
    <>
      <div className="px-6 pt-4 sm:px-8">
        <h3 className="text-2xl font-extrabold text-ink">{t('quote.results.title')}</h3>
        <p className="mt-1 text-ink-muted">{t('quote.results.subtitle')}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5 sm:px-8">
        {quotes.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-3xl border p-4 transition-colors sm:p-5 ${
              q.best ? 'border-penny-500 bg-penny-50' : 'border-ink/10 bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-soft">
                  <CarrierMark shape={q.shape} tone={q.tone} size={20} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{q.name}</span>
                    {q.best && (
                      <span className="rounded-full bg-penny-500 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">
                        {t('quote.results.best')}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-ink-muted">★ {q.rating}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-ink">
                  ${q.monthly}
                  <span className="text-sm font-medium text-ink-muted">{t('quote.results.perMo')}</span>
                </div>
                <div className="font-mono text-[11px] text-ink-muted">
                  ${q.annual.toLocaleString()} {t('quote.results.perYr')}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              {features.map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <span className="h-1 w-1 rounded-full bg-penny-500" />
                  {f}
                </span>
              ))}
            </div>

            <button
              onClick={() => setSelected(q)}
              className={`mt-4 w-full rounded-full py-2.5 text-sm font-semibold transition-colors ${
                q.best ? 'bg-penny-500 text-white hover:bg-penny-600' : 'border border-ink/15 text-ink hover:border-ink/40'
              }`}
            >
              {t('quote.results.select')}
            </button>
          </motion.div>
        ))}

        <p className="pt-2 text-center text-xs text-ink-muted">{t('quote.results.disclaimer')}</p>
      </div>

      <div className="border-t border-ink/5 px-6 py-4 sm:px-8">
        <button onClick={onRestart} className="btn-ghost w-full py-2.5 text-sm">
          {t('quote.results.restart')}
        </button>
      </div>

      {/* Selection confirmation */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-cream-light/95 p-8 text-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-sm"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-penny-100">
                <CarrierMark shape={selected.shape} tone={selected.tone} size={28} />
              </div>
              <h4 className="mt-5 text-2xl font-extrabold text-ink">{t('quote.results.confirmTitle')}</h4>
              <p className="mt-2 text-ink-muted">
                {selected.name} · ${selected.monthly}
                {t('quote.results.perMo')}
              </p>
              <p className="mt-3 text-sm text-ink-muted">{t('quote.results.confirmBody')}</p>
              <button onClick={onClose} className="btn-primary mt-6 px-7 py-3 text-sm">
                {t('quote.results.confirmClose')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
