import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { CARRIERS } from '../lib/carriers.js'
import CarrierMark from './CarrierMark.jsx'

const ease = [0.23, 1, 0.32, 1]

function Pill({ c }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5 rounded-full border border-ink/12 bg-white px-5 py-3">
      <CarrierMark shape={c.shape} tone={c.tone} />
      <span className="whitespace-nowrap text-base font-semibold text-ink">{c.name}</span>
    </span>
  )
}

function Track({ reverse }) {
  const loop = [...CARRIERS, ...CARRIERS]
  return (
    <div
      className={`flex w-max gap-3 pr-3 hover:[animation-play-state:paused] ${
        reverse ? 'animate-marquee-reverse' : 'animate-marquee'
      }`}
    >
      {loop.map((c, i) => (
        <Pill key={`${c.id}-${i}`} c={c} />
      ))}
    </div>
  )
}

export default function Carriers() {
  const t = useT()
  const reduce = useReducedMotion()

  return (
    <section id="carriers" className="overflow-hidden bg-white py-20 sm:py-28">
      <div className="section">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl"
        >
          <h2 className="display text-[clamp(2.5rem,6vw,4.5rem)] text-ink">
            {t('carriers.title1')} <span className="text-penny-500">{t('carriers.title2')}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft text-balance">{t('carriers.subtitle')}</p>
        </motion.div>
      </div>

      {/* Full-bleed moving marquees */}
      <div className="relative mt-12 space-y-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Track />
        <Track reverse />
      </div>
    </section>
  )
}
