import { motion } from 'framer-motion'

// A volumetric CSS-3D car: extruded body + cabin (stacked layers give real
// thickness), viewed at a 3/4 tilt, that yaws to face its travel direction.
// Forward is +x; pass the path tangent (deg) as `angle`.
export default function Car3D({ angle, size = 64 }) {
  const s = size
  const bodyL = s * 0.66
  const bodyW = s * 0.32
  const bodyH = s * 0.16
  const cabL = s * 0.32
  const cabW = s * 0.27
  const cabH = s * 0.13
  const layers = 7

  const slab = (L, W, z, color, dx = 0, radius) => ({
    position: 'absolute',
    left: (s - L) / 2 + dx,
    top: (s - W) / 2,
    width: L,
    height: W,
    borderRadius: radius ?? W / 2,
    background: color,
    transform: `translateZ(${z}px)`,
  })

  const wheelPos = [
    [-bodyL * 0.3, -bodyW * 0.62],
    [bodyL * 0.3, -bodyW * 0.62],
    [-bodyL * 0.3, bodyW * 0.62],
    [bodyL * 0.3, bodyW * 0.62],
  ]

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: s,
        height: s,
        marginLeft: -s / 2,
        marginTop: -s / 2,
        perspective: s * 5,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: 'rotateX(58deg)' }}>
        <motion.div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', rotateZ: angle }}>
          {/* ground shadow */}
          <div
            style={{
              position: 'absolute',
              left: (s - bodyL * 1.08) / 2,
              top: (s - bodyW * 1.25) / 2,
              width: bodyL * 1.08,
              height: bodyW * 1.25,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.3)',
              filter: 'blur(3px)',
              transform: 'translateZ(0px)',
            }}
          />
          {/* wheels */}
          {wheelPos.map((w, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: s / 2 + w[0] - s * 0.06,
                top: s / 2 + w[1] - s * 0.03,
                width: s * 0.12,
                height: s * 0.07,
                borderRadius: 3,
                background: '#0a0a0a',
                transform: `translateZ(${s * 0.05}px)`,
              }}
            />
          ))}
          {/* body extrusion */}
          {Array.from({ length: layers }).map((_, i) => (
            <div key={`b${i}`} style={slab(bodyL, bodyW, (bodyH / (layers - 1)) * i + s * 0.04, i % 2 ? '#d31570' : '#f31e7a', 0, bodyW / 2)} />
          ))}
          {/* body top cap with lights */}
          <div
            style={{
              ...slab(bodyL, bodyW, bodyH + s * 0.04, 'transparent', 0, bodyW / 2),
              background: 'linear-gradient(120deg,#ff86b6,#f31e7a 60%,#c50e5e)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', left: 1, top: '16%', width: s * 0.05, height: '26%', background: '#ff2d2d', borderRadius: 2, boxShadow: '0 0 6px #ff2d2d' }} />
            <div style={{ position: 'absolute', left: 1, bottom: '16%', width: s * 0.05, height: '26%', background: '#ff2d2d', borderRadius: 2, boxShadow: '0 0 6px #ff2d2d' }} />
            <div style={{ position: 'absolute', right: 1, top: '24%', width: s * 0.04, height: '20%', background: '#fff7d0', borderRadius: 2 }} />
            <div style={{ position: 'absolute', right: 1, bottom: '24%', width: s * 0.04, height: '20%', background: '#fff7d0', borderRadius: 2 }} />
          </div>
          {/* cabin extrusion */}
          {Array.from({ length: layers }).map((_, i) => (
            <div key={`c${i}`} style={slab(cabL, cabW, bodyH + s * 0.04 + (cabH / (layers - 1)) * i, i % 2 ? '#b91163' : '#e21370', -s * 0.05, 5)} />
          ))}
          {/* cabin glass */}
          <div
            style={{
              ...slab(cabL, cabW, bodyH + cabH + s * 0.04, 'transparent', -s * 0.05, 5),
              background: 'linear-gradient(120deg,#4a4a4a,#111)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
