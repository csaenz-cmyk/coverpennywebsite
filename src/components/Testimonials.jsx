import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'

const ease = [0.23, 1, 0.32, 1]

function Avatar({ name, dark }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
        dark ? 'bg-white text-ink' : 'bg-ink text-white'
      }`}
    >
      {name.charAt(0)}
    </span>
  )
}

export default function Testimonials() {
  const t = useT()
  const reduce = useReducedMotion()
  const items = t('testimonials.items')
  const [featured, ...rest] = items

  const fade = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, delay, ease },
  })

  return (
    <section id="reviews" className="bg-white py-20 sm:py-28">
      <div className="section">
        <motion.h2 {...fade()} className="display max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] text-ink">
          {t('testimonials.title1')} <span className="text-penny-500">{t('testimonials.title2')}</span>
        </motion.h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Featured — drenched pink */}
          <motion.figure
            {...fade(0.05)}
            className="flex flex-col justify-between rounded-3xl bg-penny-500 p-8 text-ink sm:p-10"
          >
            <div>
              <span className="text-lg">★★★★★</span>
              <blockquote className="mt-5 text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                “{featured.quote}”
              </blockquote>
            </div>
            <figcaption className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={featured.name} />
                <div>
                  <div className="font-bold text-ink">{featured.name}</div>
                  <div className="text-sm text-ink/70">{featured.location}</div>
                </div>
              </div>
              <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs font-bold text-penny-400">
                {featured.saved}
              </span>
            </figcaption>
          </motion.figure>

          {/* The rest — stacked */}
          <div className="grid gap-5">
            {rest.map((r, i) => (
              <motion.figure key={r.name} {...fade(0.12 + i * 0.08)} className="card flex flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-penny-500">★★★★★</span>
                  <span className="rounded-full bg-penny-50 px-3 py-1 font-mono text-xs font-bold text-penny-600">
                    {r.saved}
                  </span>
                </div>
                <blockquote className="mt-3 flex-1 text-lg text-ink">“{r.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Avatar name={r.name} />
                  <div>
                    <div className="font-semibold text-ink">{r.name}</div>
                    <div className="text-sm text-ink-muted">{r.location}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
