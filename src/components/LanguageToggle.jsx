import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLanguage()
  const options = ['en', 'es']

  return (
    <div
      className={`inline-flex items-center rounded-full border border-ink/15 bg-white/70 p-0.5 font-mono text-xs ${className}`}
      role="group"
      aria-label="Language"
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setLang(opt)}
          aria-pressed={lang === opt}
          className={`rounded-full px-2.5 py-1 uppercase tracking-wider transition-colors ${
            lang === opt ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
