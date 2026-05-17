import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import SacredMandala from '../components/SacredMandala'
import { useLanguage } from '../context/LanguageContext'
import { Phone } from 'lucide-react'

const SHLOKA = 'ॐ सर्वे भवन्तु सुखिनः।\nसर्वे सन्तु निरामयाः॥'
const CHARS = SHLOKA.split('')

const letterVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: 'easeOut' },
  }),
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
}

export default function HeroSection() {
  const { t } = useLanguage()
  const [phase, setPhase] = useState('shloka')
  const sectionRef = useRef(null)
  const { scrollY } = useScroll()

  // Parallax — only meaningful on desktop; clamped values are safe on all screens
  const imageY = useTransform(scrollY, [0, 500], [0, 60])
  const imageScale = useTransform(scrollY, [0, 400], [1, 1.08])
  const imageOpacity = useTransform(scrollY, [0, 350], [1, 0])
  const contentY = useTransform(scrollY, [0, 300], [0, -30])
  const contentOpacity = useTransform(scrollY, [0, 250], [1, 0])

  useEffect(() => {
    const delay = CHARS.length * 40 + 1600
    const t = setTimeout(() => setPhase('name'), delay)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-temple-black"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(139,26,26,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(201,150,12,0.08) 0%, transparent 60%)' }}
      />

      {/* Large mandala — clipped by overflow-hidden */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <SacredMandala size={560} opacity={0.07} />
      </div>
      {/* Small accent mandala — hidden on mobile to avoid visual clutter */}
      <div className="absolute hidden sm:block pointer-events-none" style={{ top: '8%', right: '4%' }}>
        <SacredMandala size={200} opacity={0.05} className="animate-spin-reverse" />
      </div>

      {/* Main layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/*
          Mobile:  image first (order-1), text second (order-2) — visual hook above the fold
          Desktop: text left  (lg:order-1), image right (lg:order-2)
        */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-20 sm:pt-24 pb-12 lg:pt-20 lg:pb-16">

          {/* IMAGE — order-1 mobile (top), lg:order-2 (right) */}
          <motion.div
            className="w-full flex-1 max-w-sm sm:max-w-md lg:max-w-lg relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ y: imageY }}
          >
            <motion.div style={{ scale: imageScale, opacity: imageOpacity }} className="relative">
              {/* Glow aura */}
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(201,150,12,0.2) 0%, transparent 70%)', filter: 'blur(28px)', transform: 'scale(0.88)' }}
              />

              {/* Image with organic clip-path */}
              <div className="relative overflow-hidden"
                style={{ clipPath: 'ellipse(88% 95% at 55% 50%)', borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%' }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/purohita-pancharathi.png`}
                  alt="Srivathsa Sharma performing pancharathi ritual"
                  className="w-full object-cover object-top"
                  style={{ height: 'clamp(300px, 55vw, 480px)' }}
                  loading="eager"
                  fetchpriority="high"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(10,5,1,0.4) 100%), linear-gradient(270deg, transparent 60%, rgba(10,5,1,0.3) 100%)' }}
                />
              </div>

              {/* Rotating dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-6px] sm:inset-[-8px] rounded-full border border-sacred-gold/10 pointer-events-none"
                style={{ borderStyle: 'dashed' }}
              />

              {/* Stat badges — inside safe zone, shown from sm up */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: 'spring', damping: 15 }}
                className="absolute bottom-2 left-2 sm:-bottom-4 sm:-left-4 glass-card px-3 py-2 sm:px-4 sm:py-3 rounded-sm text-center"
                style={{ boxShadow: '0 0 20px rgba(201,150,12,0.15)' }}
              >
                <p className="font-cinzel text-xl sm:text-2xl font-black gold-text leading-none">15+</p>
                <p className="font-cinzel text-[9px] sm:text-[10px] tracking-widest uppercase text-ivory/60">Years</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, type: 'spring', damping: 15 }}
                className="absolute top-2 right-2 sm:-top-4 sm:-right-4 glass-card px-3 py-2 sm:px-4 sm:py-3 rounded-sm text-center"
                style={{ boxShadow: '0 0 20px rgba(201,150,12,0.15)' }}
              >
                <p className="font-cinzel text-xl sm:text-2xl font-black gold-text leading-none">500+</p>
                <p className="font-cinzel text-[9px] sm:text-[10px] tracking-widest uppercase text-ivory/60">Rituals</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* TEXT — order-2 mobile (below image), lg:order-1 (left) */}
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="flex-1 max-w-xl w-full order-2 lg:order-1"
          >
            {/* Sanskrit label */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="section-subtitle mb-4 sm:mb-6 tracking-widest text-center lg:text-left"
            >
              ✦ Vedic Purohita ✦
            </motion.p>

            {/* Shloka / Name — extra height on mobile because Devanagari wraps to 3+ lines */}
            <div className="min-h-[155px] xs:min-h-[145px] sm:min-h-[120px] lg:min-h-[140px] mb-4 sm:mb-6 text-center lg:text-left">
              <AnimatePresence mode="wait">
                {phase === 'shloka' ? (
                  <motion.div
                    key="shloka"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="font-cinzel text-xl sm:text-2xl lg:text-3xl text-ivory/90 leading-relaxed"
                    style={{ letterSpacing: '0.07em' }}
                  >
                    {CHARS.map((char, i) =>
                      char === '\n' ? (
                        <br key={i} />
                      ) : (
                        <motion.span
                          key={i}
                          custom={i}
                          variants={letterVariants}
                          className={char === ' ' ? 'inline-block w-1.5 sm:w-2' : 'inline-block'}
                        >
                          {char}
                        </motion.span>
                      )
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <h1 className="font-cinzel font-black leading-none tracking-tight">
                      <span className="block text-4xl sm:text-5xl lg:text-6xl gold-shimmer">
                        Srivathsa
                      </span>
                      <span className="block text-3xl sm:text-4xl lg:text-5xl text-ivory mt-1">
                        Sharma
                      </span>
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shloka translation */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="text-ivory/35 text-xs italic mb-4 sm:mb-6 tracking-wider text-center lg:text-left"
            >
              {t('hero.shlokaTranslation')}
            </motion.p>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="font-cinzel text-sm sm:text-base lg:text-lg text-sacred-gold tracking-widest mb-2 text-center lg:text-left"
            >
              {t('hero.title')}
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="h-px bg-gradient-to-r from-sacred-gold/60 via-sacred-gold/30 to-transparent mb-4 sm:mb-5"
              style={{ transformOrigin: 'left' }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.7 }}
              className="text-ivory/65 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 text-center lg:text-left"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#contact"
                className="btn-gold-fill inline-flex items-center justify-center gap-2 text-sm py-3.5 px-7 sm:px-8"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(201,150,12,0.4)' }}
                whileTap={{ scale: 0.97 }}
              >
                {t('hero.cta')}
              </motion.a>
              <motion.a
                href="tel:8073147207"
                className="btn-gold inline-flex items-center justify-center gap-2 text-sm py-3.5 px-7 sm:px-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Phone size={14} />
                <span>8073147207</span>
              </motion.a>
            </motion.div>

            {/* Scroll indicator — hidden on mobile (takes up space) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              className="hidden sm:flex items-center gap-3 mt-10 lg:mt-12 justify-center lg:justify-start"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-7 bg-gradient-to-b from-sacred-gold/60 to-transparent"
              />
              <p className="font-cinzel text-[10px] tracking-widest uppercase text-ivory/25">
                {t('hero.scrollHint')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 pointer-events-none"
        style={{ background: 'linear-gradient(0deg, #0a0501 0%, transparent 100%)' }}
      />
    </section>
  )
}
