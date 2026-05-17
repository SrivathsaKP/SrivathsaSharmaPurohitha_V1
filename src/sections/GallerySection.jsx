import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Play } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// ── Section label map ──────────────────────────────────────────────────────────
const SECTION_LABELS = {
  'devasthana':      'Devasthana Pratishtapana',
  'pooja-alankara':  'Pooja & Alankara',
  'vivaha':          'Vivaha Rituals',
  'homa':            'Homa & Havana',
  'griha-pravesham': 'Gruhapravesham',
  'annaprasana':     'Annaprasana',
  'upanayana':       'Upanayana',
}
function sectionLabel(key) {
  return SECTION_LABELS[key] ?? key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ── Video card ─────────────────────────────────────────────────────────────────
// Poster image shown immediately (zero network cost).
// On hover (desktop only): muted preview plays from existing MP4.
// On touch (mobile): tap goes straight to the modal — no preload at all.
function VideoCard({ item, onClick }) {
  const videoRef = useRef(null)
  const [previewing, setPreviewing] = useState(false)
  // Detect touch-only devices once on mount; on touch screens skip hover logic
  const isTouch = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  )

  const handleMouseEnter = () => {
    if (isTouch.current) return
    setPreviewing(true)
    videoRef.current?.play().catch(() => {})
  }
  const handleMouseLeave = () => {
    if (isTouch.current) return
    setPreviewing(false)
    const v = videoRef.current
    if (v) { v.pause(); v.currentTime = 0 }
  }

  return (
    <div
      className="relative w-full cursor-pointer overflow-hidden rounded-sm group"
      style={{ aspectRatio: '16/9', background: '#0a0501' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${item.filename}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
    >
      {/* Static poster — loads instantly, zero video bandwidth */}
      {item.poster && (
        <img
          src={item.poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${previewing ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
      )}

      {/* Video — preload="none" means it doesn't touch the network until play() is called */}
      <video
        ref={videoRef}
        src={item.path}
        preload="none"
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${previewing ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Dark scrim — lifts on hover to reveal preview */}
      <div className={`absolute inset-0 transition-colors duration-300 ${previewing ? 'bg-black/10' : 'bg-black/45'}`} />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-sacred-gold/60 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:border-sacred-gold group-hover:scale-110 transition-all duration-300">
          <Play size={22} className="text-sacred-gold ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
        <span className="font-cinzel text-[9px] text-sacred-gold/60 tracking-widest uppercase">Sacred Video</span>
      </div>
    </div>
  )
}

// ── Image card ─────────────────────────────────────────────────────────────────
function ImageCard({ item, onClick }) {
  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-sm group"
      style={{ aspectRatio: '4/3' }}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      aria-label={`View: ${item.filename}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
    >
      <img
        src={item.path}
        alt={item.original ?? item.filename}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(10,5,1,0.5)' }}
      >
        <div className="border border-sacred-gold/60 p-3 rounded-full">
          <ZoomIn size={18} className="text-sacred-gold" />
        </div>
      </div>

      <div className="absolute bottom-2 left-2 font-cinzel text-[9px] tracking-widest uppercase text-ivory/65 bg-black/55 px-2 py-1 rounded-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {sectionLabel(item.section)}
      </div>
    </div>
  )
}

// ── Video modal ────────────────────────────────────────────────────────────────
function VideoModal({ item, onClose }) {
  const [videoError, setVideoError] = useState(false)

  return (
    <>
      <motion.div
        key="vm-bg"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="vm-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>

          {videoError ? (
            <div
              className="rounded-sm p-10 flex flex-col items-center gap-5 text-center"
              style={{ background: '#150b02', border: '1px solid rgba(201,150,12,0.2)', boxShadow: '0 0 60px rgba(201,150,12,0.1)' }}
            >
              <Film size={44} className="text-sacred-gold/30" />
              <div>
                <p className="font-cinzel text-ivory/70 text-sm mb-2">Video codec not supported by your browser</p>
                <p className="font-cinzel text-ivory/35 text-[11px] tracking-widest leading-relaxed">
                  Your browser could not play this video file.<br />
                  Download and open with VLC or your media player.
                </p>
              </div>
              <a
                href={item.path}
                download={item.filename}
                className="inline-flex items-center gap-2 font-cinzel text-[11px] tracking-widest uppercase text-temple-black bg-sacred-gold px-6 py-3 rounded-sm hover:bg-gold-light transition-colors"
              >
                ↓ Download Video
              </a>
            </div>
          ) : (
            <>
              <video
                src={item.path}
                controls
                autoPlay
                playsInline
                onError={() => setVideoError(true)}
                className="w-full rounded-sm"
                style={{ maxHeight: '80vh', boxShadow: '0 0 60px rgba(201,150,12,0.15)' }}
              />
              <div className="mt-3 text-center">
                <a
                  href={item.path}
                  download={item.filename}
                  className="font-cinzel text-[10px] text-sacred-gold/45 tracking-widest hover:text-sacred-gold transition-colors"
                >
                  ↓ Download video
                </a>
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-11 h-11 flex items-center justify-center glass-card border border-sacred-gold/30 text-ivory hover:text-sacred-gold transition-colors rounded-full"
            aria-label="Close video"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────────────────
function ImageLightbox({ item, onClose }) {
  return (
    <>
      <motion.div
        key="lb-bg"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="lb-content"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
          <img
            src={item.path}
            alt={item.original ?? item.filename}
            className="w-full h-auto max-h-[80vh] object-contain rounded-sm"
            style={{ boxShadow: '0 0 60px rgba(201,150,12,0.2)' }}
          />
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-11 h-11 flex items-center justify-center glass-card border border-sacred-gold/30 text-ivory hover:text-sacred-gold transition-colors rounded-full"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ── Main section ───────────────────────────────────────────────────────────────
export default function GallerySection() {
  const { t } = useLanguage()
  const [manifest, setManifest] = useState(null)
  const [activeSection, setActiveSection] = useState('all')
  const [lightboxItem, setLightboxItem] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}gallery/gallery-manifest.json`, { cache: 'no-cache' })
      .then((r) => r.json())
      .then(setManifest)
      .catch(() => setManifest({}))
  }, [])

  const sections = manifest ? Object.keys(manifest) : []

  const allItems = manifest
    ? Object.entries(manifest).flatMap(([section, files]) =>
        files.map((f) => ({ ...f, section }))
      )
    : []

  const filtered = activeSection === 'all'
    ? allItems
    : allItems.filter((item) => item.section === activeSection)

  const handleOpen = useCallback((item) => setLightboxItem(item), [])
  const handleClose = useCallback(() => setLightboxItem(null), [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  return (
    <section
      id="gallery"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: '#0a0501' }}
    >
      <div className="absolute inset-0 temple-texture opacity-20" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="section-subtitle mb-3 sm:mb-4"
          >
            ✦ Sacred Moments ✦
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="section-title mb-2"
          >
            {t('gallery.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-ivory/35 font-cinzel text-xs sm:text-sm tracking-widest"
          >
            {t('gallery.subtitle')}
          </motion.p>
        </div>

        {/* Section filter tabs */}
        {sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 sm:gap-3 mb-8 sm:mb-12 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide"
            role="tablist"
            aria-label="Gallery section filter"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {['all', ...sections].map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeSection === key}
                onClick={() => setActiveSection(key)}
                className={`font-cinzel text-[11px] sm:text-xs tracking-widest uppercase px-4 sm:px-5 py-2.5 border transition-all duration-300 rounded-sm flex-shrink-0 min-h-[44px] ${
                  activeSection === key
                    ? 'bg-sacred-gold text-temple-black border-sacred-gold font-semibold'
                    : 'border-sacred-gold/25 text-ivory/55 hover:border-sacred-gold/50 hover:text-ivory'
                }`}
              >
                {key === 'all' ? 'All' : sectionLabel(key)}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading */}
        {!manifest && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-sacred-gold/30 border-t-sacred-gold rounded-full animate-spin" />
          </div>
        )}

        {/* Masonry grid */}
        {manifest && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-1 sm:columns-2 lg:columns-3"
              style={{ columnGap: '0.75rem' }}
            >
              {filtered.map((item, index) => (
                <motion.div
                  key={`${item.section}-${item.filename}`}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.35), ease: 'easeOut' }}
                  className="break-inside-avoid mb-3"
                >
                  {item.type === 'video'
                    ? <VideoCard item={item} onClick={handleOpen} />
                    : <ImageCard item={item} onClick={handleOpen} />
                  }
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {manifest && filtered.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <p className="text-ivory/30 font-cinzel tracking-widest text-sm">
              No media in this section yet.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox / Video modal */}
      <AnimatePresence>
        {lightboxItem && (
          lightboxItem.type === 'video'
            ? <VideoModal key="video-modal" item={lightboxItem} onClose={handleClose} />
            : <ImageLightbox key="image-lb" item={lightboxItem} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  )
}
