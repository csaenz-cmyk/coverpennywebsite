// Renders a small geometric logo mark for a carrier based on shape + tone.
export default function CarrierMark({ shape = 'circle', tone = 'ink', size = 18 }) {
  const color = tone === 'penny' ? '#F31E7A' : '#111111'
  const s = size
  const common = { fill: color }

  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      {shape === 'circle' && <circle cx="12" cy="12" r="9" {...common} />}
      {shape === 'square' && <rect x="3" y="3" width="18" height="18" rx="3" {...common} />}
      {shape === 'roundsquare' && <rect x="3" y="3" width="18" height="18" rx="7" {...common} />}
      {shape === 'diamond' && <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" {...common} />}
      {shape === 'triangle' && <path d="M12 3 L21 20 L3 20 Z" {...common} />}
      {shape === 'half' && <path d="M3 12a9 9 0 0 1 18 0Z" {...common} />}
    </svg>
  )
}
