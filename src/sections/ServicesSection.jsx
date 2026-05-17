import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import RitualCard from '../components/RitualCard'
import PoojaItemsDrawer from '../components/PoojaItemsDrawer'
import poojaItems from '../data/poojaItems.json'

const RITUAL_IDS = [
  'gruhapravesham', 'satyanarayana', 'sudarshana', 'chandika',
  'durgaDeepaNamaskara', 'navagraha', 'durgaSaptashathi',
  'rudrabhisheka', 'devasthana', 'ganaHoma', 'vivaha',
]

export default function ServicesSection() {
  const { t, tRitual } = useLanguage()
  const [selectedRitual, setSelectedRitual] = useState(null)

  const handleCardClick = (ritualId) => {
    setSelectedRitual({ id: ritualId, name: tRitual(ritualId, 'name') })
  }

  return (
    <section id="services" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden" style={{ background: '#0d0603' }}>
      <div className="absolute inset-0 temple-texture opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-20 sm:h-24 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #0a0501 0%, transparent 100%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="section-subtitle mb-3 sm:mb-4">
            ✦ Sacred Ceremonies ✦
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }} className="section-title mb-3 sm:mb-4">
            {t('services.title')}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-ivory/45 text-xs sm:text-sm tracking-widest font-cinzel uppercase">
            {t('services.subtitle')}
          </motion.p>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 sm:mt-8 h-px bg-gradient-to-r from-transparent via-sacred-gold/50 to-transparent"
            style={{ transformOrigin: 'center' }}
          />
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-3 sm:mt-4 text-ivory/35 text-[11px] font-cinzel tracking-widest">
            Tap any ritual card to view the complete samagri (items) list
          </motion.p>
        </div>

        {/* Cards grid — 1 col mobile, 2 col sm, 3 col lg, 4 col xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {RITUAL_IDS.map((id, index) => (
            <div key={id} className="relative">
              <RitualCard
                ritualId={id}
                index={Math.min(index, 5)}
                onClick={() => handleCardClick(id)}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }} className="text-center mt-10 sm:mt-16">
          <p className="text-ivory/40 text-xs sm:text-sm mb-5 sm:mb-6 font-cinzel">
            Don't see your ritual? Contact Pandit Srivathsa for custom ceremonies.
          </p>
          <a href="#contact" className="btn-gold inline-block text-xs sm:text-sm py-3 px-8 sm:px-10">
            {t('nav.bookNow')}
          </a>
        </motion.div>
      </div>

      <PoojaItemsDrawer
        ritual={selectedRitual}
        poojaData={poojaItems}
        onClose={() => setSelectedRitual(null)}
      />
    </section>
  )
}
