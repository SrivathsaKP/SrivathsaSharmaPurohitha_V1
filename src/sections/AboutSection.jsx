import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import GoldenParticles from '../components/GoldenParticles'

export default function AboutSection() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Keep x-translate small; section has overflow-hidden to clip
  const imageX = useTransform(scrollYProgress, [0, 0.5], [-20, 0])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])
  const textX = useTransform(scrollYProgress, [0.1, 0.5], [20, 0])
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1])

  const bio = t('about.bio')
  const words = bio.split(' ')

  const stats = [
    { value: t('about.stats.years'), label: t('about.stats.yearsLabel') },
    { value: t('about.stats.rituals'), label: t('about.stats.ritualsLabel') },
    { value: t('about.stats.families'), label: t('about.stats.familiesLabel') },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-temple-black temple-texture"
    >
      <GoldenParticles count={14} />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(139,26,26,0.08) 0%, transparent 60%)' }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-14 lg:gap-20">

          {/* IMAGE */}
          <motion.div
            style={{ x: imageX, opacity: imageOpacity }}
            className="flex-1 relative w-full max-w-sm sm:max-w-md lg:max-w-lg
                        pb-10 sm:pb-10 lg:pb-0"
            /* pb accounts for the Om badge (-bottom-6) on all screens */
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,150,12,0.12) 0%, transparent 70%)', filter: 'blur(20px)', transform: 'scale(1.1)' }}
            />

            {/* Diagonal-clipped image */}
            <div className="relative overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)', borderRadius: '0 0 0 8px' }}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/purohita-namaskara.png`}
                alt="Srivathsa Sharma in prayer (namaskara)"
                className="w-full object-cover object-top"
                style={{ height: 'clamp(280px, 50vw, 520px)' }}
                loading="lazy"
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent 50%, rgba(10,5,1,0.5) 100%), linear-gradient(180deg, transparent 70%, rgba(10,5,1,0.4) 100%)' }}
              />
            </div>

            {/* Gold bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1"
              style={{ background: 'linear-gradient(180deg, transparent, #C9960C, transparent)' }}
            />

            {/* Om badge — sits in the pb space so it never clips */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: 'spring', damping: 12 }}
              className="absolute -bottom-6 right-4 sm:right-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full glass-card flex items-center justify-center border border-sacred-gold/30"
              style={{ boxShadow: '0 0 30px rgba(201,150,12,0.2)' }}
            >
              <span className="font-cinzel text-2xl sm:text-3xl gold-text">ॐ</span>
            </motion.div>
          </motion.div>

          {/* TEXT */}
          <motion.div
            style={{ x: textX, opacity: textOpacity }}
            className="flex-1 max-w-lg w-full"
          >
            <p className="section-subtitle mb-3 sm:mb-4">{t('about.subtitle')}</p>

            <h2 className="section-title mb-4 sm:mb-6">{t('about.title')}</h2>

            <div className="h-px bg-gradient-to-r from-sacred-gold/50 to-transparent mb-6 sm:mb-8 w-20 sm:w-24" />

            {/* Bio word-by-word */}
            <motion.p
              className="text-ivory/72 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.012 } } }}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-1"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* Stats — tighter on mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                  className="glass-card p-3 sm:p-4 text-center rounded-sm"
                >
                  <p className="font-cinzel text-xl sm:text-2xl font-black gold-text text-glow-gold mb-1">
                    {stat.value}
                  </p>
                  <p className="font-cinzel text-[9px] sm:text-[10px] tracking-widest uppercase text-ivory/50 leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Specialization tags */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {['Vedic Scholar', 'Sanskrit Chanting', 'Agama Shastra', 'Karma Kanda'].map((tag) => (
                <span key={tag}
                  className="font-cinzel text-[10px] sm:text-[11px] tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 border border-sacred-gold/25 text-sacred-gold/80 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
