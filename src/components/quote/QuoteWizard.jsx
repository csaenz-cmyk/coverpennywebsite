import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../../i18n/LanguageContext.jsx'
import { getQuotes } from '../../lib/quoteService.js'
import Logo from '../Logo.jsx'
import QuoteResults from './QuoteResults.jsx'

const TYPES = ['auto', 'home', 'business', 'moto']
const STEPS = ['type', 'zip', 'details', 'contact']
const YEARS = Array.from({ length: 24 }, (_, i) => String(2026 - i))

function Label({ children }) {
  return <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-ink-muted">{children}</label>
}

const fieldClass =
  'w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-penny-500'

function TextInput(props) {
  return <input {...props} className={fieldClass} />
}

function Select({ options, placeholder, ...props }) {
  return (
    <select {...props} className={fieldClass}>
      <option value="">{placeholder || '—'}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

export default function QuoteWizard({ initialType, onClose }) {
  const t = useT()
  const [stepIndex, setStepIndex] = useState(initialType ? 1 : 0)
  const [phase, setPhase] = useState('form') // form | loading | results
  const [quotes, setQuotes] = useState([])

  const [coverageType, setCoverageType] = useState(initialType || null)
  const [zip, setZip] = useState('')
  const [details, setDetails] = useState({})
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [touched, setTouched] = useState(false)

  const step = STEPS[stepIndex]
  const setDetail = (key, value) => setDetails((d) => ({ ...d, [key]: value }))

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  const zipOk = /^\d{5}$/.test(zip)

  const isValid = useMemo(() => {
    if (step === 'type') return Boolean(coverageType)
    if (step === 'zip') return zipOk
    if (step === 'details') return true // details are optional but encouraged
    if (step === 'contact') return contact.name.trim().length > 1 && emailOk
    return true
  }, [step, coverageType, zipOk, contact, emailOk])

  const next = async () => {
    if (!isValid) {
      setTouched(true)
      return
    }
    setTouched(false)
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1)
      return
    }
    // Final step → fetch quotes
    setPhase('loading')
    const results = await getQuotes({ coverageType, zip, details, contact })
    setQuotes(results)
    setPhase('results')
  }

  const back = () => {
    setTouched(false)
    setStepIndex((i) => Math.max(0, i - 1))
  }

  const restart = () => {
    setPhase('form')
    setQuotes([])
    setStepIndex(initialType ? 1 : 0)
  }

  /* ---------- Results phase ---------- */
  if (phase === 'results') {
    return (
      <>
        <WizardHeader onClose={onClose} t={t} />
        <QuoteResults quotes={quotes} coverageType={coverageType} onRestart={restart} onClose={onClose} />
      </>
    )
  }

  /* ---------- Loading phase ---------- */
  if (phase === 'loading') {
    return (
      <>
        <WizardHeader onClose={onClose} t={t} />
        <LoadingScreen t={t} />
      </>
    )
  }

  /* ---------- Form phase ---------- */
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <>
      <WizardHeader onClose={onClose} t={t} />

      {/* Progress */}
      <div className="px-6 pt-1 sm:px-8">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-ink-muted">
          <span>
            {t('quote.step')} {stepIndex + 1} {t('quote.of')} {STEPS.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full rounded-full bg-penny-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Step body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'type' && <StepType t={t} value={coverageType} onChange={setCoverageType} />}
            {step === 'zip' && (
              <StepZip t={t} zip={zip} setZip={setZip} error={touched && !zipOk} />
            )}
            {step === 'details' && (
              <StepDetails t={t} coverageType={coverageType} details={details} setDetail={setDetail} />
            )}
            {step === 'contact' && (
              <StepContact t={t} contact={contact} setContact={setContact} touched={touched} emailOk={emailOk} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-3 border-t border-ink/5 px-6 py-4 sm:px-8">
        {stepIndex > 0 ? (
          <button onClick={back} className="btn-ghost px-5 py-2.5 text-sm">
            {t('quote.back')}
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={next}
          disabled={!isValid}
          className="btn-primary px-7 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stepIndex === STEPS.length - 1 ? t('quote.getQuotes') : t('quote.next')}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </>
  )
}

/* ---------------- Header ---------------- */
function WizardHeader({ onClose, t }) {
  return (
    <div className="flex items-center justify-between px-6 pt-5 sm:px-8">
      <span className="text-lg text-ink">
        <Logo />
      </span>
      <button
        onClick={onClose}
        aria-label={t('quote.close')}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white text-ink-muted transition-colors hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  )
}

/* ---------------- Steps ---------------- */
function StepHeading({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h3 className="text-2xl font-extrabold text-ink">{title}</h3>
      <p className="mt-1 text-ink-muted">{subtitle}</p>
    </div>
  )
}

function StepType({ t, value, onChange }) {
  return (
    <div>
      <StepHeading title={t('quote.step1.title')} subtitle={t('quote.step1.subtitle')} />
      <div className="grid grid-cols-2 gap-3">
        {TYPES.map((key) => {
          const c = t(`coverage.types.${key}`)
          const active = value === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`flex flex-col items-start gap-2 rounded-3xl border p-4 text-left transition-all ${
                active ? 'border-penny-500 bg-penny-50 shadow-card' : 'border-ink/10 bg-white hover:border-ink/25'
              }`}
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="font-bold text-ink">{c.name}</span>
              <span className="text-xs text-ink-muted">{c.desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepZip({ t, zip, setZip, error }) {
  return (
    <div>
      <StepHeading title={t('quote.step2.title')} subtitle={t('quote.step2.subtitle')} />
      <Label>{t('quote.step2.label')}</Label>
      <TextInput
        inputMode="numeric"
        maxLength={5}
        value={zip}
        autoFocus
        onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
        placeholder={t('quote.step2.placeholder')}
      />
      {error && <p className="mt-2 text-sm text-penny-600">{t('quote.step2.error')}</p>}
    </div>
  )
}

function StepDetails({ t, coverageType, details, setDetail }) {
  const d = t(`quote.step3.${coverageType}`)
  return (
    <div>
      <StepHeading title={t('quote.step3.title')} subtitle={t('quote.step3.subtitle')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {coverageType === 'auto' && (
          <>
            <div>
              <Label>{d.year}</Label>
              <Select options={YEARS} value={details.year || ''} onChange={(e) => setDetail('year', e.target.value)} />
            </div>
            <div>
              <Label>{d.make}</Label>
              <TextInput value={details.make || ''} onChange={(e) => setDetail('make', e.target.value)} placeholder={d.makePlaceholder} />
            </div>
            <div className="sm:col-span-2">
              <Label>{d.usage}</Label>
              <Select options={d.usageOptions} value={details.usage || ''} onChange={(e) => setDetail('usage', e.target.value)} />
            </div>
          </>
        )}
        {coverageType === 'home' && (
          <>
            <div>
              <Label>{d.type}</Label>
              <Select options={d.typeOptions} value={details.type || ''} onChange={(e) => setDetail('type', e.target.value)} />
            </div>
            <div>
              <Label>{d.year}</Label>
              <TextInput inputMode="numeric" value={details.year || ''} onChange={(e) => setDetail('year', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="2005" />
            </div>
            <div className="sm:col-span-2">
              <Label>{d.value}</Label>
              <TextInput value={details.value || ''} onChange={(e) => setDetail('value', e.target.value)} placeholder={d.valuePlaceholder} />
            </div>
          </>
        )}
        {coverageType === 'business' && (
          <>
            <div className="sm:col-span-2">
              <Label>{d.industry}</Label>
              <Select options={d.industryOptions} value={details.industry || ''} onChange={(e) => setDetail('industry', e.target.value)} />
            </div>
            <div>
              <Label>{d.employees}</Label>
              <TextInput inputMode="numeric" value={details.employees || ''} onChange={(e) => setDetail('employees', e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="5" />
            </div>
            <div>
              <Label>{d.revenue}</Label>
              <TextInput value={details.revenue || ''} onChange={(e) => setDetail('revenue', e.target.value)} placeholder={d.revenuePlaceholder} />
            </div>
          </>
        )}
        {coverageType === 'moto' && (
          <>
            <div>
              <Label>{d.year}</Label>
              <Select options={YEARS} value={details.year || ''} onChange={(e) => setDetail('year', e.target.value)} />
            </div>
            <div>
              <Label>{d.make}</Label>
              <TextInput value={details.make || ''} onChange={(e) => setDetail('make', e.target.value)} placeholder={d.makePlaceholder} />
            </div>
            <div className="sm:col-span-2">
              <Label>{d.style}</Label>
              <Select options={d.styleOptions} value={details.style || ''} onChange={(e) => setDetail('style', e.target.value)} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StepContact({ t, contact, setContact, touched, emailOk }) {
  const set = (key, value) => setContact((c) => ({ ...c, [key]: value }))
  return (
    <div>
      <StepHeading title={t('quote.step4.title')} subtitle={t('quote.step4.subtitle')} />
      <div className="space-y-4">
        <div>
          <Label>{t('quote.step4.name')}</Label>
          <TextInput value={contact.name} autoFocus onChange={(e) => set('name', e.target.value)} placeholder={t('quote.step4.namePlaceholder')} />
          {touched && contact.name.trim().length <= 1 && (
            <p className="mt-2 text-sm text-penny-600">{t('quote.required')}</p>
          )}
        </div>
        <div>
          <Label>{t('quote.step4.email')}</Label>
          <TextInput type="email" value={contact.email} onChange={(e) => set('email', e.target.value)} placeholder={t('quote.step4.emailPlaceholder')} />
          {touched && !emailOk && <p className="mt-2 text-sm text-penny-600">{t('quote.step4.emailError')}</p>}
        </div>
        <div>
          <Label>{t('quote.step4.phone')}</Label>
          <TextInput type="tel" value={contact.phone} onChange={(e) => set('phone', e.target.value)} placeholder={t('quote.step4.phonePlaceholder')} />
        </div>
      </div>
    </div>
  )
}

/* ---------------- Loading ---------------- */
function LoadingScreen({ t }) {
  const lines = t('quote.loading.lines')
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-penny-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-penny-500" />
      </div>
      <h3 className="mt-6 text-xl font-extrabold text-ink">{t('quote.loading.title')}</h3>
      <ul className="mt-5 space-y-2">
        {lines.map((line, i) => (
          <motion.li
            key={line}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.4 }}
            className="text-sm text-ink-muted"
          >
            {line}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
