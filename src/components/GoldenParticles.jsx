import { useMemo } from 'react'

const PARTICLE_COUNT = 24

export default function GoldenParticles({ count = PARTICLE_COUNT }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.25,
    }))
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, #F5D98A, #C9960C)`,
            opacity: p.opacity,
            animation: `particle ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}
