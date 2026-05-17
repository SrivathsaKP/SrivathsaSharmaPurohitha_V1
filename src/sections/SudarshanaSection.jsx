import { useRef, useState, useEffect, useCallback, memo } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView, useVelocity } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

/* ─────────────────────────────────────────────────────────────────────────
   PARTICLE — handles both fast sparks and slow drifting embers.
   All random values are pre-computed as props so the component is stable.
───────────────────────────────────────────────────────────────────────── */
const Particle = memo(function Particle({ angle, size, spreadDeg, dist, startR, dur, color, onDone }) {
  const flyRad   = ((angle + spreadDeg) * Math.PI) / 180
  const startRad = (angle              * Math.PI) / 180
  const half     = size / 2
  const sx = Math.cos(startRad) * startR - half
  const sy = Math.sin(startRad) * startR - half
  const tx = Math.cos(flyRad)   * dist   - half
  const ty = Math.sin(flyRad)   * dist   - half

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: '50%', top: '50%',
        width: size, height: size,
        background: color,
        boxShadow: `0 0 ${size + 3}px ${color}, 0 0 ${size * 4}px rgba(255,120,0,0.6)`,
        zIndex: 6,
      }}
      initial={{ x: sx, y: sy, opacity: 1, scale: 1 }}
      animate={{ x: tx, y: ty, opacity: 0, scale: 0.05 }}
      transition={{ duration: dur, ease: 'easeOut' }}
      onAnimationComplete={onDone}
    />
  )
})

/* Fast golden spark — radial direction */
function mkSpark() {
  return {
    id: Math.random() + Date.now(),
    angle:     Math.random() * 360,
    size:      1.8 + Math.random() * 2.6,
    spreadDeg: (Math.random() - 0.5) * 55,
    dist:      80 + Math.random() * 110,
    startR:    88 + Math.random() * 32,
    dur:       0.35 + Math.random() * 0.28,
    color:     Math.random() > 0.4 ? '#FFD700' : Math.random() > 0.5 ? '#FFEC8B' : '#FFFFFF',
  }
}

/* Slow ember — upward-biased, larger, orange-red */
function mkEmber() {
  return {
    id: Math.random() + Date.now() + 0.5,
    angle:     -90 + (Math.random() - 0.5) * 90,   // mostly upward
    size:      3.5 + Math.random() * 3.2,
    spreadDeg: (Math.random() - 0.5) * 18,
    dist:      110 + Math.random() * 130,
    startR:    72  + Math.random() * 50,
    dur:       0.9  + Math.random() * 0.7,
    color:     ['#FF4500','#FF6B00','#FF8C00','#FFC200'][Math.floor(Math.random() * 4)],
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN SECTION
   Section height: 280dvh  →  total scroll journey: 380dvh
   p = 0.00  entering from below
   p = 0.26  section top at viewport top   (entry complete)
   p = 0.74  section bottom at viewport bottom (exit begins)
   p = 1.00  fully gone
───────────────────────────────────────────────────────────────────────── */
export default function SudarshanaSection() {
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const [locked, setLocked]                 = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [particles, setParticles]           = useState([])

  const inView         = useInView(containerRef, { margin: '0px' })
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const scrollSpring   = useSpring(scrollYProgress, { stiffness: 48, damping: 18 })
  const scrollVelocity = useVelocity(scrollYProgress)

  /* ── Panel opacity ──────────────────────────────────────────────── */
  const panelOpacity = useTransform(scrollYProgress, [0.02, 0.08, 0.86, 0.95], [0, 1, 1, 0])

  /* ── Chakra scale ───────────────────────────────────────────────── */
  const scale = useTransform(scrollSpring, [0, 0.12, 0.30, 1], [0.05, 0.32, 1, 1])

  /* ── Rotation: 4 full turns (1440°) for a satisfying spin ──────────
     Stays near 0° while tiny so first visible frame is upright,
     then accelerates hard, decelerates and locks at 1440° (= upright) */
  const rotation = useTransform(
    scrollSpring,
    [0,    0.12,  0.18,  0.46,  0.62,  1    ],
    [0,    8,     320,   1120,  1440,  1440 ],
  )

  /* ── Fire halo: orange glow behind chakra during spin ───────────── */
  const fireGlowOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.22, 0.52, 0.60, 0.64],
    [0,    1,    1,    0.35, 0   ],
  )

  /* ── Info panel ─────────────────────────────────────────────────── */
  const contentOpacity = useTransform(scrollYProgress, [0.60, 0.72, 0.88, 0.96], [0, 1, 1, 0])
  const contentY       = useTransform(scrollYProgress, [0.60, 0.72], [48, 0])

  /* ── Lock detection ─────────────────────────────────────────────── */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v >= 0.55 && !locked) {
      setLocked(true)
      setTimeout(() => setContentVisible(true), 300)
    } else if (v < 0.48 && locked) {
      setLocked(false)
      setContentVisible(false)
    }
  })

  /* ── Particle emitter ───────────────────────────────────────────────
     Active during p=0.18→0.62 (the spin phase).
     Count scales with scroll velocity for a natural shower feel. */
  useEffect(() => {
    if (!inView) return
    const timer = setInterval(() => {
      const p   = scrollYProgress.get()
      const vel = Math.abs(scrollVelocity.get())
      if (p < 0.18 || p > 0.62 || vel < 0.04) return

      const sparkCount = vel > 0.35 ? 4 : vel > 0.18 ? 3 : 2
      setParticles(prev => {
        const next = [...prev]
        for (let i = 0; i < sparkCount; i++) next.push(mkSpark())
        // Add an ember ~55% of the time
        if (Math.random() > 0.45) next.push(mkEmber())
        return next.slice(-26)     // cap live particles
      })
    }, 50)
    return () => clearInterval(timer)
  }, [inView, scrollYProgress, scrollVelocity])

  const removeParticle = useCallback((id) => setParticles(p => p.filter(s => s.id !== id)), [])

  return (
    /* 280dvh gives ~2.8 viewport-heights of scroll — satisfying spin */
    <section ref={containerRef} id="sudarshana" className="relative" style={{ height: '280dvh' }}>

      {inView && (
        <motion.div
          className="fixed inset-0 overflow-hidden"
          style={{ background: '#050200', opacity: panelOpacity, zIndex: 20 }}
        >
          {/* Subtle warm vignette — no circle rings */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(90,35,0,0.08) 0%, rgba(5,2,0,1) 60%)' }}
          />

          {/* ── Main layout ─────────────────────────────────────────── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20">

            {/* Chakra + fire halo + particles — all positioned from same centre */}
            <div className="relative flex-shrink-0">

              {/* ── Fire halo: blurred orange oval behind the chakra ── */}
              <motion.div
                aria-hidden="true"
                className="absolute pointer-events-none"
                style={{
                  inset: '-28%',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(255,65,0,0.42) 0%, rgba(255,130,0,0.22) 38%, transparent 66%)',
                  filter: 'blur(26px)',
                  opacity: fireGlowOpacity,
                  zIndex: 0,
                }}
              />

              {/* ── Spark / ember particles ───────────────────────── */}
              {particles.map(p => (
                <Particle key={p.id} {...p} onDone={() => removeParticle(p.id)} />
              ))}

              {/* ── Chakra image ─────────────────────────────────── */}
              <motion.div
                style={{ rotate: rotation, scale, position: 'relative', zIndex: 1 }}
                className="will-change-transform"
              >
                <motion.img
                  src={`${import.meta.env.BASE_URL}images/sudarshana-chakra.png`}
                  alt="Sudarshana Chakra — Divine disc of Lord Vishnu"
                  loading="eager"
                  className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-auto block"
                  style={{ mixBlendMode: 'screen' }}
                  /* Self-glow:
                     Spinning  → warm orange-gold base
                     Locked    → pure gold pulsing flare */
                  animate={{
                    filter: locked
                      ? [
                          'drop-shadow(0 0 34px rgba(201,150,12,0.95)) drop-shadow(0 0 68px rgba(201,150,12,0.52)) brightness(1.2)',
                          'drop-shadow(0 0 58px rgba(255,220,0,1))     drop-shadow(0 0 115px rgba(255,180,0,0.8))  brightness(1.42)',
                          'drop-shadow(0 0 34px rgba(201,150,12,0.95)) drop-shadow(0 0 68px rgba(201,150,12,0.52)) brightness(1.2)',
                        ]
                      : ['drop-shadow(0 0 18px rgba(255,110,0,0.6)) brightness(1.06)'],
                  }}
                  transition={locked
                    ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.6 }
                  }
                />
              </motion.div>
            </div>

            {/* ── Info panel ───────────────────────────────────────── */}
            <motion.div
              className="w-full max-w-lg text-center mt-4 sm:mt-6"
              style={{ opacity: contentOpacity, y: contentY, pointerEvents: contentVisible ? 'auto' : 'none' }}
            >
              <p className="section-subtitle mb-1 sm:mb-2">{t('sudarshana.subtitle')}</p>
              <h2 className="font-cinzel text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-ivory mb-3 sm:mb-4 text-glow-gold">
                {t('sudarshana.title')}
              </h2>
              <div className="glass-card p-3 xs:p-4 sm:p-5 rounded-sm mb-3 sm:mb-4">
                <p className="text-ivory/75 text-[11px] xs:text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
                  {t('sudarshana.desc')}
                </p>
                <p className="font-cinzel text-[10px] xs:text-[11px] sm:text-xs text-sacred-gold tracking-widest uppercase">
                  {t('sudarshana.benefits')}
                </p>
              </div>
              {contentVisible && (
                <motion.a
                  href="#contact"
                  className="btn-gold-fill inline-block text-[11px] xs:text-xs sm:text-sm py-2.5 px-5 sm:px-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  Book Sudarshana Homa
                </motion.a>
              )}
            </motion.div>
          </div>

        </motion.div>
      )}
    </section>
  )
}
