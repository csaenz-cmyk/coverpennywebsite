import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import QuoteWizard from './QuoteWizard.jsx'

export default function QuoteModal({ open, onClose, initialType }) {
  const panelRef = useRef(null)

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={panelRef}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative z-10 flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-4xl bg-cream-light shadow-soft sm:rounded-4xl"
          >
            {/* Reset wizard state every time the modal opens (keyed by initialType) */}
            <QuoteWizard key={open ? initialType || 'all' : 'closed'} initialType={initialType} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
