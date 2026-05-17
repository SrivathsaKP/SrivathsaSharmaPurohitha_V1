import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Phone, Printer, Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function PoojaItemsDrawer({ ritual, poojaData, onClose }) {
  const { lang, t } = useLanguage()
  const [checked, setChecked] = useState({})

  const data = poojaData?.find((d) => d.id === ritual?.id)

  useEffect(() => {
    setChecked({})
    if (ritual) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [ritual])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const toggleCheck = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
  const allChecked = data?.items?.length > 0 && data.items.every((_, i) => checked[i])

  const handlePrint = () => {
    window.print()
  }

  if (!ritual) return null

  return (
    <AnimatePresence>
      {ritual && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`${ritual.name} - ${t('drawer.itemsRequired')}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full xs:max-w-sm sm:max-w-md flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #120a03 0%, #0a0501 100%)',
              borderLeft: '1px solid rgba(201,150,12,0.3)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between p-6 pb-4"
              style={{ borderBottom: '1px solid rgba(201,150,12,0.15)' }}
            >
              <div className="flex-1 pr-4">
                <p className="section-subtitle mb-1">{t('drawer.ritualDesc')}</p>
                <h2 className="font-cinzel text-xl font-bold text-ivory leading-tight">
                  {ritual.name}
                </h2>
                {data && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={12} className="text-sacred-gold" />
                    <span className="font-cinzel text-xs text-sacred-gold tracking-wide">
                      {t('drawer.duration')}: {data.duration}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 text-ivory/60 hover:text-sacred-gold border border-transparent hover:border-sacred-gold/30 rounded-sm transition-colors"
                aria-label={t('drawer.close')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            {data?.description?.[lang] && (
              <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(201,150,12,0.1)' }}>
                <p className="text-ivory/70 text-sm leading-relaxed">
                  {data.description[lang]}
                </p>
              </div>
            )}

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel text-sm font-semibold text-sacred-gold tracking-wider uppercase">
                  {t('drawer.itemsRequired')}
                </h3>
                {allChecked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 text-green-400 text-xs font-cinzel"
                  >
                    <Check size={12} />
                    <span>All Ready!</span>
                  </motion.div>
                )}
              </div>

              {data?.items ? (
                <ul className="space-y-2">
                  {data.items.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => toggleCheck(i)}
                        className={`w-full flex items-start gap-3 text-left p-3 rounded-sm border transition-all duration-200 ${
                          checked[i]
                            ? 'border-sacred-gold/40 bg-sacred-gold/8 text-ivory'
                            : 'border-ivory/10 hover:border-sacred-gold/20 text-ivory/75'
                        }`}
                        aria-pressed={!!checked[i]}
                      >
                        <div
                          className={`flex-shrink-0 w-4 h-4 mt-0.5 border rounded-sm flex items-center justify-center transition-all ${
                            checked[i]
                              ? 'bg-sacred-gold border-sacred-gold'
                              : 'border-ivory/30'
                          }`}
                        >
                          {checked[i] && <Check size={10} className="text-temple-black" />}
                        </div>
                        <span className="text-sm leading-relaxed">
                          {item[lang] ?? item['en']}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ivory/50 text-sm italic">Items list coming soon.</p>
              )}
            </div>

            {/* Footer actions */}
            <div
              className="p-6 space-y-3"
              style={{ borderTop: '1px solid rgba(201,150,12,0.15)' }}
            >
              <a
                href="tel:8073147207"
                className="flex items-center justify-center gap-2 btn-gold-fill w-full py-3 rounded-sm text-sm"
              >
                <Phone size={14} />
                {t('drawer.contactToBook')}
              </a>
              <button
                onClick={handlePrint}
                className="no-print flex items-center justify-center gap-2 w-full btn-gold py-3 rounded-sm text-sm"
              >
                <Printer size={14} />
                {t('drawer.printList')}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
