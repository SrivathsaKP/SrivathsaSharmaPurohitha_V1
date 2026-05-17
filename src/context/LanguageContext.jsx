import { createContext, useContext, useState, useCallback } from 'react'
import translations from '../i18n/translations.json'

const LanguageContext = createContext(null)

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
]

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const t = useCallback(
    (key) => {
      const keys = key.split('.')
      let value = translations[lang]
      for (const k of keys) {
        if (value == null) return key
        value = value[k]
      }
      return value ?? key
    },
    [lang]
  )

  const tRitual = useCallback(
    (ritualId, field) => {
      const value = translations[lang]?.services?.rituals?.[ritualId]?.[field]
      if (value != null) return value
      return translations['en']?.services?.rituals?.[ritualId]?.[field] ?? ''
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tRitual, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider')
  return ctx
}
