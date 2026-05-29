import { useT, useLanguage } from '../i18n/LanguageContext.jsx'

export default function SavingsTicker() {
  const t = useT()
  const { lang } = useLanguage()
  const items = t('ticker.items')
  // Duplicate the list so the marquee can loop seamlessly (-50% translate).
  const loop = [...items, ...items]

  return (
    <div className="border-y border-ink/5 bg-penny-50 py-4">
      <div className="flex items-center gap-4">
        <span className="eyebrow eyebrow-dot ml-5 hidden shrink-0 sm:inline-flex">{t('ticker.label')}</span>
        <div className="group relative flex-1 overflow-hidden no-scrollbar">
          {/* key on lang forces a clean restart when switching languages */}
          <div key={lang} className="flex w-max animate-marquee gap-8 group-hover:[animation-play-state:paused]">
            {loop.map((item, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap text-sm text-ink-soft">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-penny-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
