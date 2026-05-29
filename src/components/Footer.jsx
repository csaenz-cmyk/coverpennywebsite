import { useState } from 'react'
import { useT } from '../i18n/LanguageContext.jsx'
import Logo from './Logo.jsx'

export default function Footer() {
  const t = useT()
  const [subscribed, setSubscribed] = useState(false)
  const columns = ['coverage', 'company', 'support', 'legal']

  const onSubscribe = (e) => {
    e.preventDefault()
    setSubscribed(true)
  }

  return (
    <footer className="bg-ink text-white">
      <div className="section py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <a href="#top" className="text-2xl text-white" aria-label="Coverpenny home">
              <Logo />
            </a>
            <p className="mt-4 max-w-sm text-white/60">{t('footer.tagline')}</p>

            <div className="mt-8 max-w-sm">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-penny-500">
                {t('footer.newsletter.eyebrow')}
              </p>
              <p className="mt-2 text-sm text-white/60">{t('footer.newsletter.desc')}</p>
              {subscribed ? (
                <p className="mt-4 font-semibold text-penny-400">{t('footer.newsletter.thanks')}</p>
              ) : (
                <form onSubmit={onSubscribe} className="mt-4 flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder={t('footer.newsletter.placeholder')}
                    className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-penny-500 focus:outline-none"
                  />
                  <button type="submit" className="btn bg-penny-500 px-5 py-2.5 text-sm text-white hover:bg-penny-600">
                    {t('footer.newsletter.button')}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => {
              const data = t(`footer.columns.${col}`)
              return (
                <div key={col}>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-white/40">{data.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {data.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm text-white/70 transition-colors hover:text-penny-400">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center">
          <p>{t('footer.copyright')}</p>
          <p className="inline-flex items-center gap-1.5">
            {t('footer.madeWith')}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-penny-500" />
            {t('footer.madeWithRest')}
          </p>
        </div>
      </div>
    </footer>
  )
}
