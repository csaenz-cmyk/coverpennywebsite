import { useT, useLanguage } from '../i18n/LanguageContext.jsx'

export default function SavingsTicker() {
  const t = useT()
  const { lang } = useLanguage()
  const items = t('ticker.items')
  const loop = [...items, ...items]

  return (
    <div className="bg-ink py-3.5 text-white">
      <div className="flex items-center gap-4">
        <span className="ml-5 hidden shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-penny-400 sm:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-penny-400" />
          {t('ticker.label')}
        </span>
        <div className="group relative flex-1 overflow-hidden no-scrollbar">
          <div key={lang} className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
            {loop.map((item, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap font-mono text-[13px] text-white/75">
                <span className="text-penny-400">+</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
