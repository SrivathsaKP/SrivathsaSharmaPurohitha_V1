import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const { t, lang, setLang, LANGUAGES } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const langRef = useRef(null)
  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(10,5,1,0)', 'rgba(10,5,1,0.95)'])
  const navBorder = useTransform(scrollY, [0, 80], ['rgba(201,150,12,0)', 'rgba(201,150,12,0.2)'])

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 60))
    return unsub
  }, [scrollY])

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinks = [
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#gallery', label: t('nav.gallery') },
    { href: '#contact', label: t('nav.contact') },
  ]

  const currentLang = LANGUAGES.find((l) => l.code === lang)

  return (
    <motion.nav
      style={{ backgroundColor: navBg, borderBottomColor: navBorder }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-2xl font-cinzel gold-text">ॐ</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-cinzel text-sm font-semibold text-ivory tracking-wider leading-tight">
                Srivathsa Sharma
              </p>
              <p className="font-cinzel text-xs gold-text tracking-widest uppercase">Purohita</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-cinzel text-xs tracking-widest uppercase text-ivory/70 hover:text-sacred-gold transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div ref={langRef} className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 font-cinzel text-xs tracking-wider text-sacred-gold border border-sacred-gold/30 px-3 py-1.5 rounded-sm hover:border-sacred-gold/60 transition-colors"
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <span>{currentLang?.native}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-44 glass-card rounded-sm overflow-hidden"
                    style={{ transformOrigin: 'top' }}
                  >
                    {LANGUAGES.map((l) => (
                      <li key={l.code}>
                        <button
                          role="option"
                          aria-selected={lang === l.code}
                          onClick={() => { setLang(l.code); setLangOpen(false) }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 font-cinzel text-xs tracking-wide transition-colors hover:bg-sacred-gold/10 ${
                            lang === l.code ? 'text-sacred-gold' : 'text-ivory/80'
                          }`}
                        >
                          <span>{l.native}</span>
                          <span className="text-ivory/40 text-[10px]">{l.label}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Book Now CTA */}
            <a
              href="#contact"
              className="hidden lg:block btn-gold text-xs py-2 px-4"
            >
              {t('nav.bookNow')}
            </a>

            {/* Phone */}
            <a
              href="tel:8073147207"
              className="hidden md:flex items-center gap-1.5 text-sacred-gold"
              aria-label="Call Srivathsa Sharma"
            >
              <Phone size={14} />
            </a>

            {/* Mobile menu toggle — 44×44 touch target */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-ivory p-2.5 -mr-1 rounded-sm"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
            style={{ background: 'rgba(10,5,1,0.97)', borderTop: '1px solid rgba(201,150,12,0.15)' }}
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-cinzel text-sm tracking-widest uppercase text-ivory/80 hover:text-sacred-gold py-3 border-b border-sacred-gold/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {/* Mobile language switcher */}
              <div className="pt-4 pb-2">
                <p className="font-cinzel text-[10px] tracking-widest uppercase text-ivory/40 mb-3">Language</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setMenuOpen(false) }}
                      className={`font-cinzel text-xs px-3 py-1.5 border rounded-sm transition-colors ${
                        lang === l.code
                          ? 'border-sacred-gold text-sacred-gold bg-sacred-gold/10'
                          : 'border-ivory/20 text-ivory/60 hover:border-sacred-gold/40'
                      }`}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              </div>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block btn-gold-fill text-center mt-4 text-xs py-3"
              >
                {t('nav.bookNow')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
