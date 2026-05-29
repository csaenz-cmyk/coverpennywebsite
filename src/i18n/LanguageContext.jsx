import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { en } from './en.js'
import { es } from './es.js'

const dictionaries = { en, es }
const STORAGE_KEY = 'coverpenny:lang'

const LanguageContext = createContext(null)

/** Resolve a dotted key path ("hero.title") against a nested dictionary. */
function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), dict)
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem(STORAGE_KEY) || 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  // t() returns whatever the key resolves to: string, array, or object.
  // Falls back to English, then to the key itself.
  const t = (path) => {
    const value = resolve(dictionaries[lang], path)
    if (value !== undefined) return value
    const fallback = resolve(dictionaries.en, path)
    return fallback !== undefined ? fallback : path
  }

  const toggle = () => setLang((prev) => (prev === 'en' ? 'es' : 'en'))

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

/** Convenience hook: returns the t() translator function. */
export function useT() {
  return useLanguage().t
}
