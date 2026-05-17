import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import KolamSVG from '../components/KolamSVG'

export default function GruhapraveshamSection() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageScale  = useTransform(scrollYProgress, [0, 1], [1, 1.10])
  const textX       = useTransform(scrollYProgress, [0.1, 0.45], [-24, 0])
  const textOpacity = useTransform(scrollYProgress, [0.08, 0.35], [0, 1])
  const kolamScale  = useTransform(scrollYProgress, [0.2, 0.6], [0.7, 1])
  const kolamOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1])

  const bullets = [
    'Vastu Shanti', 'Navagraha Pooja',
    'Ganapati Vandana', 'Kalasha Sthapana',
    'Agni Homa', 'Griha Devata Pooja',
  ]

  return (
    <section
      ref={sectionRef}
      id="gruhapravesham"
      className="relative overflow-hidden"
      style={{ background: '#080400', minHeight: '100dvh' }}
    >
      {/* Ken Burns background */}
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <img
          src="/images/gruhapravesham-scene.png"
          alt="Gruhapravesham ceremony"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Mobile: vertical gradient — image stays partly visible */}
        <div className="absolute inset-0 lg:hidden"
          style={{ background: 'linear-gradient(180deg, rgba(10,5,1,0.72) 0%, rgba(10,5,1,0.45) 45%, rgba(10,5,1,0.82) 100%)' }}
        />
        {/* Desktop: horizontal gradient so left text panel is dark, right shows scene */}
        <div className="absolute inset-0 hidden lg:block"
          style={{ background: 'linear-gradient(90deg, rgba(10,5,1,0.92) 0%, rgba(10,5,1,0.68) 48%, rgba(10,5,1,0.25) 100%), linear-gradient(0deg, rgba(10,5,1,0.65) 0%, transparent 45%)' }}
        />
      </motion.div>

      {/* Scrollable content overlay */}
      <div className="relative z-10 flex items-center min-h-[100dvh] py-20 sm:py-24 lg:py-0">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

            {/* TEXT */}
            <motion.div
              style={{ x: textX, opacity: textOpacity }}
              className="flex-1 max-w-xl"
            >
              <p className="section-subtitle mb-3 sm:mb-4">{t('gruhapravesham.tradition')}</p>

              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-5xl font-bold text-ivory mb-3 sm:mb-4 lg:mb-6 leading-tight">
                {t('gruhapravesham.title')}
              </h2>

              <p className="font-cinzel text-sm sm:text-base lg:text-lg text-sacred-gold tracking-wide mb-3 sm:mb-4">
                {t('gruhapravesham.subtitle')}
              </p>

              <div className="h-px bg-gradient-to-r from-sacred-gold/50 to-transparent mb-4 sm:mb-6 w-24 sm:w-32" />

              <p className="text-ivory/72 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-8 max-w-lg">
                {t('gruhapravesham.desc')}
              </p>

              <motion.a
                href="#contact"
                className="btn-gold-fill text-xs sm:text-sm py-3 px-7 sm:px-8 inline-block mb-6 sm:mb-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Book Gruhapravesham
              </motion.a>

              {/* Ritual highlights — show on sm and up */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="hidden sm:grid grid-cols-2 gap-2 sm:gap-3"
              >
                {bullets.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-ivory/55 text-xs">
                    <span className="w-1 h-1 rounded-full bg-sacred-gold flex-shrink-0" />
                    <span className="font-cinzel tracking-wide">{item}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* KOLAM — only on large screens */}
            <motion.div
              style={{ scale: kolamScale, opacity: kolamOpacity }}
              className="hidden lg:flex flex-1 max-w-xs items-center justify-center"
            >
              <div className="relative">
                <KolamSVG />
                <div className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse, rgba(201,150,12,0.08) 0%, transparent 70%)', filter: 'blur(20px)' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
