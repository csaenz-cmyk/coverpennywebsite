import { useT } from '../i18n/LanguageContext.jsx'
import Reveal from './Reveal.jsx'

export default function Testimonials() {
  const t = useT()
  const items = t('testimonials.items')

  return (
    <section id="reviews" className="bg-penny-100 py-20 sm:py-28">
      <div className="section">
        <Reveal>
          <p className="eyebrow eyebrow-dot">{t('testimonials.eyebrow')}</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-6xl">
            {t('testimonials.title1')} <br className="hidden sm:block" />
            <span className="text-penny-500">{t('testimonials.title2')}</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map((r, i) => (
            <Reveal key={r.name} delay={(i % 2) * 0.1}>
              <figure className="card flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="text-penny-500">★★★★★</span>
                  <span className="rounded-full bg-penny-100 px-3 py-1 font-mono text-xs font-bold text-penny-600">
                    {r.saved}
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 text-lg text-ink">“{r.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-bold text-white">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{r.name}</div>
                    <div className="text-sm text-ink-muted">{r.location}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
