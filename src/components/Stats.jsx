import { useT } from '../i18n/LanguageContext.jsx'
import Reveal from './Reveal.jsx'

export default function Stats() {
  const t = useT()
  const items = t('stats.items')

  return (
    <section className="bg-ink py-16 text-white sm:py-20">
      <div className="section">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <div className="display text-4xl text-penny-500 sm:text-5xl">{s.value}</div>
              <div className="mt-2 px-2 font-mono text-xs uppercase tracking-widest text-white/60">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
