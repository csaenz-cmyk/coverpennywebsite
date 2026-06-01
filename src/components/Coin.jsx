// Concentric "minted penny" motif — the brand's recurring graphic device.
export default function Coin({ className = '', spin = false, stroke = 'currentColor' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${spin ? 'animate-spin-slow' : ''} ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="96" stroke={stroke} strokeWidth="2" opacity="0.5" />
      <circle cx="100" cy="100" r="78" stroke={stroke} strokeWidth="2" strokeDasharray="3 6" opacity="0.6" />
      <circle cx="100" cy="100" r="58" stroke={stroke} strokeWidth="2" opacity="0.4" />
      {/* minted notches around the rim */}
      {Array.from({ length: 48 }).map((_, i) => {
        const a = (i / 48) * Math.PI * 2
        const x1 = 100 + Math.cos(a) * 88
        const y1 = 100 + Math.sin(a) * 88
        const x2 = 100 + Math.cos(a) * 96
        const y2 = 100 + Math.sin(a) * 96
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="2" opacity="0.45" />
      })}
    </svg>
  )
}
