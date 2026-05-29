import { motion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { CARRIERS } from '../lib/carriers.js'
import CarrierMark from './CarrierMark.jsx'
import Reveal from './Reveal.jsx'

export default function Carriers() {
  const t = useT()

  return (
    <section id="carriers" className="bg-cream-light py-20 sm:py-28">
      <div className="section">
        <Reveal className="text-center">
          <p className="eyebrow eyebrow-dot justify-center">{t('carriers.eyebrow')}</p>
          <h2 className="display mx-auto mt-4 max-w-3xl text-4xl text-ink sm:text-5xl">
            {t('carriers.title1')} <span className="text-penny-500">{t('carriers.title2')}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft text-balance">{t('carriers.subtitle')}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CARRIERS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-ink/5 bg-white px-4 py-5 shadow-soft"
            >
              <CarrierMark shape={c.shape} tone={c.tone} />
              <span className="text-sm font-semibold text-ink">{c.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
