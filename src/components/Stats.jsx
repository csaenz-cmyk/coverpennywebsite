import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import Coin from './Coin.jsx'
import Coin3D from './Coin3D.jsx'

const ease = [0.23, 1, 0.32, 1]

export default function Stats() {
  const t = useT()
  const reduce = useReducedMotion()
  const items = t('stats.items') // [carriers, savings, quote time, states]
  const hero = items[1] // average yearly savings — the dominant number
  const rest = [items[0], items[2], items[3]]

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <Coin stroke="#F31E7A" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 opacity-25" spin />
      <div className="animate-float-slow pointer-events-none absolute right-6 top-14 hidden lg:block xl:right-16">
        <Coin3D size={96} />
      </div>

      <div className="section relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="max-w-4xl"
        >
          <div className="display leading-[0.95] text-[clamp(3.5rem,13vw,9rem)] text-penny-400">{hero.value}</div>
          <p className="mt-2 max-w-xl text-2xl font-medium text-white/90 text-balance sm:text-3xl">
            {hero.label}.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3"
        >
          {rest.map((s) => (
            <div key={s.label} className="flex items-baseline gap-3 bg-ink px-6 py-6">
              <span className="display text-4xl text-white">{s.value}</span>
              <span className="font-mono text-xs uppercase tracking-wider text-white/55">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
