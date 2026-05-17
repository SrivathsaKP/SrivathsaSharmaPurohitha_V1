import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function SatyanarayanaSection() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY         = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const textY       = useTransform(scrollYProgress, [0, 0.5, 1], [24, 0, -16])
  const textOpacity = useTransform(scrollYProgress, [0.08, 0.28, 0.72, 0.92], [0, 1, 1, 0])

  return (
    <section
      ref={sectionRef}
      id="satyanarayana"
      className="relative overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.12 }}>
        <img
          src="/images/satyanarayana-scene.png"
          alt="Satyanarayana Pooja scene — Lord Vishnu with devotees"
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />

        {/* Gradient: lighter at center so deity is visible, darker at edges */}
        <div className="absolute inset-0"
          style={{
            background: [
              'linear-gradient(180deg, rgba(10,5,1,0.42) 0%, rgba(10,5,1,0.08) 38%, rgba(10,5,1,0.08) 62%, rgba(10,5,1,0.82) 100%)',
              'radial-gradient(ellipse at 50% 38%, transparent 30%, rgba(10,5,1,0.35) 100%)',
            ].join(', '),
          }}
        />

        {/* Soft divine glow behind deity — no visible ring, pure radial blur */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '22%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(480px, 85vw)',
            height: 'min(380px, 65vw)',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(201,150,12,0.14) 0%, rgba(255,210,60,0.06) 48%, transparent 74%)',
            filter: 'blur(30px)',
          }}
        />
      </motion.div>

      {/* Content — card anchored to bottom so deity is fully visible above */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 min-h-[100dvh] flex items-end justify-center px-4 sm:px-6 pb-10 sm:pb-14 lg:pb-20"
      >
        <div className="w-full max-w-2xl glass-card rounded-sm p-5 sm:p-7 lg:p-9 text-center">

          <p className="section-subtitle mb-2 sm:mb-3">{t('satyanarayana.subtitle')}</p>

          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-ivory mb-3 sm:mb-5 text-glow-gold">
            {t('satyanarayana.title')}
          </h2>

          <div className="h-px bg-gradient-to-r from-transparent via-sacred-gold/50 to-transparent mb-3 sm:mb-5" />

          <p className="text-ivory/72 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-7 max-w-lg mx-auto">
            {t('satyanarayana.desc')}
          </p>

          <a href="#contact" className="btn-gold-fill inline-block text-xs sm:text-sm py-3 px-6 sm:px-8">
            {t('satyanarayana.cta')}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
