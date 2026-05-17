import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const ICONS = {
  gruhapravesham: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  satyanarayana: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M12 3v1m0 16v1M4.22 4.22l.71.71m14.14 14.14.71.71M3 12H2m20 0h-1M4.22 19.78l.71-.71M18.36 5.64l.71-.71M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sudarshana: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
      <path d="M12 3l1.5 4.5M12 3l-1.5 4.5M21 12l-4.5 1.5M21 12l-4.5-1.5M12 21l1.5-4.5M12 21l-1.5-4.5M3 12l4.5-1.5M3 12l4.5 1.5" strokeLinecap="round" />
    </svg>
  ),
  chandika: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      <path d="M12 6l1.79 5.26L19 12l-5.21 1.79L12 19l-1.79-5.21L5 12l5.21-1.74z" strokeLinecap="round" />
    </svg>
  ),
  durgaDeepaNamaskara: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M12 3c-1.2 5.4-3 7.8-3 10.5C9 15.99 10.34 18 12 18s3-2.01 3-4.5C15 10.8 13.2 8.4 12 3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 21h8M10 21v-3M14 21v-3" strokeLinecap="round" />
    </svg>
  ),
  navagraha: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <circle cx="12" cy="12" r="2" /><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="19" r="1.5" />
      <circle cx="5" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
      <circle cx="7.22" cy="7.22" r="1.5" /><circle cx="16.78" cy="16.78" r="1.5" />
      <circle cx="16.78" cy="7.22" r="1.5" /><circle cx="7.22" cy="16.78" r="1.5" />
    </svg>
  ),
  durgaSaptashathi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M12 6.5l1.5 4 4.5.5-3.3 3 1 4.5L12 16l-3.7 2.5 1-4.5L6 10.5l4.5-.5z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  rudrabhisheka: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M12 2l2 7H6l2-7z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9v10M14 9v10" strokeLinecap="round" />
      <path d="M8 19h8" strokeLinecap="round" />
      <path d="M6 14c0 0 2 2 6 0s6 0 6 0" strokeLinecap="round" />
    </svg>
  ),
  devasthana: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M3 21h18M6 21V7.5M18 21V7.5M12 3l9 4.5M12 3L3 7.5M12 3v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 21v-4a2 2 0 014 0v4" strokeLinecap="round" />
    </svg>
  ),
  ganaHoma: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M12 2C8 2 5 5 5 8c0 2 1.5 3.5 3 4.5-.5 1-1 2.5-1 3.5h10c0-1-.5-2.5-1-3.5C17.5 11.5 19 10 19 8c0-3-3-6-7-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 16v5M14 16v5" strokeLinecap="round" />
      <path d="M9 10c.5-1 1.5-1.5 3-1.5" strokeLinecap="round" />
    </svg>
  ),
  vivaha: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

const LANG_CODES = ['en', 'kn', 'hi', 'ta', 'te', 'ml']

export default function RitualCard({ ritualId, index, onClick }) {
  const { lang, tRitual, LANGUAGES } = useLanguage()
  const [cycleIndex, setCycleIndex] = useState(0)

  const name     = tRitual(ritualId, 'name')
  const desc     = tRitual(ritualId, 'desc')
  const duration = tRitual(ritualId, 'duration')

  useEffect(() => {
    const id = setInterval(() => setCycleIndex((prev) => (prev + 1) % LANG_CODES.length), 1800)
    return () => clearInterval(id)
  }, [])

  const cyclingLang = LANG_CODES[cycleIndex]

  return (
    <motion.button
      onClick={onClick}
      // `relative` is required so the absolute gold-line child positions correctly
      className="relative glass-card-hover rounded-sm p-4 sm:p-5 text-left w-full group cursor-pointer"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={{ scale: 0.97 }}
      aria-label={`${name} — Tap to view required items`}
    >
      {/* Icon */}
      <div className="text-sacred-gold mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
        {ICONS[ritualId] ?? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Primary name */}
      <h3 className="font-cinzel text-sm sm:text-base font-semibold text-ivory mb-1 leading-snug">
        {name}
      </h3>

      {/* Cycling secondary language name */}
      <div className="h-5 mb-2 overflow-hidden">
        <motion.p
          key={cyclingLang}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 0.45, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-cinzel text-[10px] sm:text-xs text-sacred-gold/60 tracking-wide truncate"
        >
          {cyclingLang !== lang
            ? `${LANGUAGES.find((l) => l.code === cyclingLang)?.native ?? ''} · ${tRitual(ritualId, 'name') || ''}`
            : ''}
        </motion.p>
      </div>

      {/* Description */}
      <p className="text-ivory/55 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
        {desc}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-cinzel text-[10px] sm:text-xs text-sacred-gold/65 tracking-wide flex-shrink-0">
          {duration}
        </span>
        <span className="font-cinzel text-[10px] sm:text-xs text-sacred-gold tracking-widest uppercase group-hover:text-gold-light transition-colors">
          Items →
        </span>
      </div>

      {/* Gold bottom line — requires `relative` on parent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sacred-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  )
}
