import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../i18n/LanguageContext.jsx'
import { useQuote } from './quote/QuoteContext.jsx'
import Logo from './Logo.jsx'
import LanguageToggle from './LanguageToggle.jsx'

export default function Navbar() {
  const t = useT()
  const { openQuote } = useQuote()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#coverage', label: t('nav.coverage') },
    { href: '#how', label: t('nav.how') },
    { href: '#carriers', label: t('nav.carriers') },
    { href: '#reviews', label: t('nav.reviews') },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'border-b border-ink/10 bg-white/85 backdrop-blur-md' : ''
      }`}
    >
      <nav className="section flex h-16 items-center justify-between gap-4">
        <a href="#top" className="text-lg text-ink" aria-label="Coverpenny home">
          <Logo />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-penny-500"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <button onClick={() => openQuote()} className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            {t('nav.quote')}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 md:hidden"
            aria-label={t('nav.menu')}
            aria-expanded={menuOpen}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-4 bg-ink transition-transform ${menuOpen ? 'translate-y-[5px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 bottom-0 h-0.5 w-4 bg-ink transition-transform ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-ink/10 bg-white/95 backdrop-blur-md md:hidden"
          >
            <div className="section flex flex-col gap-1 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-white"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  openQuote()
                }}
                className="btn-primary mt-2 w-full"
              >
                {t('nav.quote')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
