// A real 3D coin built with CSS preserve-3d: stacked rim layers give it
// thickness, two capped faces show the "penny" design, and it spins on Y.
export default function Coin3D({ size = 120, className = '', layers = 18, depth = 16 }) {
  const half = depth / 2
  const face = {
    position: 'absolute',
    inset: 0,
    borderRadius: '9999px',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 0 5px rgba(255,255,255,0.22)',
  }

  return (
    <div className={className} style={{ perspective: 800 }} aria-hidden="true">
      <div
        className="animate-coin-flip"
        style={{ position: 'relative', width: size, height: size, transformStyle: 'preserve-3d' }}
      >
        {/* rim / thickness */}
        {Array.from({ length: layers }).map((_, i) => {
          const z = -half + (depth / (layers - 1)) * i
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '9999px',
                background: i % 2 ? '#c50e5e' : '#e21370',
                transform: `translateZ(${z}px)`,
              }}
            />
          )
        })}

        {/* front face: ¢ */}
        <div
          style={{
            ...face,
            transform: `translateZ(${half}px)`,
            background: 'radial-gradient(circle at 32% 26%, #ff8cbb, #f31e7a 62%)',
          }}
        >
          <span
            style={{
              fontFamily: '"Unbounded", sans-serif',
              fontWeight: 800,
              color: '#fff',
              fontSize: size * 0.4,
              lineHeight: 1,
            }}
          >
            ¢
          </span>
        </div>

        {/* back face: dot */}
        <div
          style={{
            ...face,
            transform: `rotateY(180deg) translateZ(${half}px)`,
            background: 'radial-gradient(circle at 32% 26%, #ff8cbb, #d80f66 62%)',
          }}
        >
          <span style={{ width: size * 0.24, height: size * 0.24, borderRadius: '50%', background: '#fff', opacity: 0.92 }} />
        </div>
      </div>
    </div>
  )
}
