import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import DivaFlame from '../components/DivaFlame'

const RITUAL_IDS = [
  'gruhapravesham', 'satyanarayana', 'sudarshana', 'chandika',
  'durgaDeepaNamaskara', 'navagraha', 'durgaSaptashathi',
  'rudrabhisheka', 'devasthana', 'ganaHoma', 'vivaha',
]

export default function ContactSection() {
  const { t, tRitual } = useLanguage()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', ritual: '', date: '', location: '', message: '',
  })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1500))
    setStatus('done')
  }

  const inputClass = 'w-full bg-transparent border border-sacred-gold/20 text-ivory text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-sacred-gold/60 focus:ring-1 focus:ring-sacred-gold/30 transition-all placeholder:text-ivory/30 font-inter min-h-[48px]'

  return (
    <section
      id="contact"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: '#060401' }}
    >
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(139,26,26,0.12) 0%, transparent 60%)' }}
      />

      {/* Trishula — only on large screens so it doesn't overlap content */}
      <div className="absolute right-0 top-0 bottom-0 w-48 lg:w-64 pointer-events-none hidden lg:block"
        style={{ opacity: 0.07 }} aria-hidden="true"
      >
        <img src="/images/trishula.png" alt=""
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 h-[80%] object-contain"
          style={{ filter: 'brightness(1.5)' }}
        />
      </div>

      {/* Deity altar — large screens only */}
      <div className="absolute left-0 top-0 bottom-0 w-48 pointer-events-none hidden xl:block"
        style={{ opacity: 0.05 }} aria-hidden="true"
      >
        <img src="/images/deity-altar.png" alt=""
          className="absolute left-[-60px] top-1/2 -translate-y-1/2 h-[80%] object-contain"
        />
      </div>

      <div className="relative max-w-5xl lg:max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-subtitle mb-3 sm:mb-4">
            ✦ Begin Your Sacred Journey ✦
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="section-title mb-3 sm:mb-4">
            {t('contact.title')}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }} className="text-ivory/45 font-cinzel text-xs sm:text-sm tracking-widest">
            {t('contact.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* INFO PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-5 sm:space-y-6 lg:space-y-8"
          >
            {/* Phone card */}
            <div className="glass-card p-5 sm:p-6 rounded-sm" style={{ boxShadow: '0 0 40px rgba(201,150,12,0.08)' }}>
              <p className="section-subtitle mb-3">{t('contact.phoneLabel')}</p>
              <a href="tel:8073147207"
                className="flex items-center gap-3 sm:gap-4 group"
                aria-label="Call Srivathsa Sharma at 8073147207"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-full border border-sacred-gold/40 flex items-center justify-center group-hover:border-sacred-gold/80 group-hover:bg-sacred-gold/5 transition-all">
                  <Phone size={20} className="text-sacred-gold" />
                </div>
                <div className="min-w-0">
                  <p className="font-cinzel text-lg sm:text-2xl lg:text-3xl font-black gold-text text-glow-gold tracking-wider truncate">
                    {t('contact.phone')}
                  </p>
                  <p className="font-cinzel text-[10px] text-ivory/35 tracking-widest uppercase mt-0.5 leading-snug">
                    {t('contact.available')}
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/918073147207?text=Namaskara%20Panditji%2C%20I%20would%20like%20to%20book%20a%20ritual."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-green-400 text-sm font-cinzel tracking-wider hover:text-green-300 transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp Directly
              </a>
            </div>

            {/* Location */}
            <div className="glass-card p-4 sm:p-5 rounded-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-sacred-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-cinzel text-sm font-semibold text-ivory mb-1">Based in Bangalore</p>
                  <p className="text-ivory/45 text-xs sm:text-sm leading-relaxed">
                    Serving families across Bangalore, Karnataka and neighbouring states.
                    Travel available on request.
                  </p>
                </div>
              </div>
            </div>

            {/* Diya flames */}
            <div className="flex items-end gap-5 sm:gap-6 justify-center pt-2 sm:pt-4">
              {['sm', 'md', 'sm'].map((size, i) => (
                <motion.div key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                >
                  <DivaFlame size={size} />
                </motion.div>
              ))}
            </div>

            {/* Sanskrit quote */}
            <div className="text-center">
              <p className="font-cinzel text-sm italic text-sacred-gold/45 tracking-wide">
                "धर्मो रक्षति रक्षितः"
              </p>
              <p className="font-cinzel text-[11px] text-ivory/35 tracking-widest mt-1">
                Dharma protects those who protect it.
              </p>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {status === 'done' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center glass-card rounded-sm p-8 sm:p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-sacred-gold flex items-center justify-center mb-5 sm:mb-6"
                  style={{ boxShadow: '0 0 30px rgba(201,150,12,0.3)' }}
                >
                  <CheckCircle size={30} className="text-sacred-gold" />
                </motion.div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-ivory mb-3">
                  {t('contact.form.success')}
                </h3>
                <p className="text-ivory/45 text-sm">
                  Pandit Srivathsa Sharma will call you within 24 hours.
                </p>
                <button
                  onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', ritual: '', date: '', location: '', message: '' }) }}
                  className="mt-6 sm:mt-8 btn-gold text-xs py-2 px-5 sm:px-6"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card rounded-sm p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-5"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block font-cinzel text-[10px] sm:text-[11px] tracking-widest uppercase text-ivory/45 mb-1.5">
                      {t('contact.form.name')} *
                    </label>
                    <input id="name" name="name" type="text" required
                      value={form.name} onChange={handleChange}
                      placeholder="Your full name"
                      className={inputClass} autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block font-cinzel text-[10px] sm:text-[11px] tracking-widest uppercase text-ivory/45 mb-1.5">
                      {t('contact.form.phone')} *
                    </label>
                    <input id="phone" name="phone" type="tel" required
                      value={form.phone} onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className={inputClass} autoComplete="tel" inputMode="tel"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block font-cinzel text-[10px] sm:text-[11px] tracking-widest uppercase text-ivory/45 mb-1.5">
                    {t('contact.form.email')}
                  </label>
                  <input id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass} autoComplete="email" inputMode="email"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ritual" className="block font-cinzel text-[10px] sm:text-[11px] tracking-widest uppercase text-ivory/45 mb-1.5">
                      {t('contact.form.ritual')} *
                    </label>
                    <select id="ritual" name="ritual" required
                      value={form.ritual} onChange={handleChange}
                      className={`${inputClass} cursor-pointer`}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" disabled style={{ background: '#0a0501' }}>
                        {t('contact.form.selectPlaceholder')}
                      </option>
                      {RITUAL_IDS.map((id) => (
                        <option key={id} value={id} style={{ background: '#0a0501' }}>
                          {tRitual(id, 'name')}
                        </option>
                      ))}
                      <option value="other" style={{ background: '#0a0501' }}>Other / Custom</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className="block font-cinzel text-[10px] sm:text-[11px] tracking-widest uppercase text-ivory/45 mb-1.5">
                      {t('contact.form.date')}
                    </label>
                    <input id="date" name="date" type="date"
                      value={form.date} onChange={handleChange}
                      className={inputClass} style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block font-cinzel text-[10px] sm:text-[11px] tracking-widest uppercase text-ivory/45 mb-1.5">
                    {t('contact.form.location')}
                  </label>
                  <input id="location" name="location" type="text"
                    value={form.location} onChange={handleChange}
                    placeholder="City / Area"
                    className={inputClass} autoComplete="address-level2"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-cinzel text-[10px] sm:text-[11px] tracking-widest uppercase text-ivory/45 mb-1.5">
                    {t('contact.form.message')}
                  </label>
                  <textarea id="message" name="message" rows={4}
                    value={form.message} onChange={handleChange}
                    placeholder="Any special requirements or questions..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-gold-fill w-full flex items-center justify-center gap-2 text-sm py-4 rounded-sm disabled:opacity-70"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === 'sending' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-temple-black/40 border-t-temple-black rounded-full"
                      />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      {t('contact.form.submit')}
                    </>
                  )}
                </motion.button>

                <p className="text-center text-ivory/25 text-[11px] font-cinzel tracking-wide">
                  Your inquiry will be responded to within 24 hours
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
