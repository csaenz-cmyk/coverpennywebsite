import { createContext, useCallback, useContext, useState } from 'react'
import QuoteModal from './QuoteModal.jsx'

const QuoteContext = createContext(null)

export function QuoteProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [coverageType, setCoverageType] = useState(null)

  const openQuote = (type = null) => {
    setCoverageType(type)
    setOpen(true)
  }
  const closeQuote = () => setOpen(false)

  return (
    <QuoteContext.Provider value={{ openQuote, closeQuote }}>
      {children}
      <QuoteModal open={open} onClose={closeQuote} initialType={coverageType} />
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used within a QuoteProvider')
  return ctx
}
