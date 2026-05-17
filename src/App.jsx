import { useReducedMotion } from 'framer-motion'
import Navbar from './components/Navbar'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import SudarshanaSection from './sections/SudarshanaSection'
import SatyanarayanaSection from './sections/SatyanarayanaSection'
import GruhapraveshamSection from './sections/GruhapraveshamSection'
import GallerySection from './sections/GallerySection'
import ContactSection from './sections/ContactSection'
import { useLanguage } from './context/LanguageContext'

function Footer() {
  const { t } = useLanguage()
  return (
    <footer
      className="relative py-10 px-6 text-center"
      style={{ background: '#050200', borderTop: '1px solid rgba(201,150,12,0.1)' }}
    >
      <div className="max-w-4xl mx-auto">
        <p className="font-cinzel text-2xl gold-text mb-2">ॐ</p>
        <p className="font-cinzel text-sm text-ivory/60 tracking-widest mb-1">
          Srivathsa Sharma · Vedic Purohita
        </p>
        <p className="font-cinzel text-xs text-sacred-gold/60 tracking-widest uppercase mb-4">
          {t('footer.tagline')}
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-sacred-gold/20 to-transparent mb-4" />
        <p className="font-cinzel text-[10px] text-ivory/20 tracking-widest">
          © {new Date().getFullYear()} Srivathsa Sharma. {t('footer.rights')}.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-temple-black" data-reduced-motion={shouldReduceMotion}>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <SudarshanaSection />
        <SatyanarayanaSection />
        <GruhapraveshamSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
