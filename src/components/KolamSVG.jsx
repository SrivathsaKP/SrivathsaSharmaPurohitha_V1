import { motion } from 'framer-motion'

export default function KolamSVG({ className = '' }) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 3, ease: 'easeInOut' },
    },
  }

  return (
    <motion.svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      aria-label="Traditional kolam decorative pattern"
    >
      {/* Outer square */}
      <motion.rect
        x="20" y="20" width="280" height="280"
        stroke="#C9960C" strokeWidth="1.5" fill="none"
        variants={pathVariants}
      />
      {/* Inner square rotated 45° */}
      <motion.rect
        x="113.1" y="113.1" width="93.8" height="93.8"
        stroke="#C9960C" strokeWidth="1.5" fill="none"
        transform="rotate(45, 160, 160)"
        variants={{ ...pathVariants, visible: { ...pathVariants.visible, transition: { duration: 2.5, delay: 0.3, ease: 'easeInOut' } } }}
      />
      {/* Center circle */}
      <motion.circle
        cx="160" cy="160" r="40"
        stroke="#C9960C" strokeWidth="1.5" fill="rgba(201,150,12,0.06)"
        variants={{ ...pathVariants, visible: { ...pathVariants.visible, transition: { duration: 1.5, delay: 0.8, ease: 'easeInOut' } } }}
      />
      {/* Diagonal lines */}
      <motion.line x1="20" y1="20" x2="160" y2="120" stroke="#C9960C" strokeWidth="0.8" opacity="0.5"
        variants={{ ...pathVariants, visible: { ...pathVariants.visible, transition: { duration: 1.2, delay: 1, ease: 'easeInOut' } } }} />
      <motion.line x1="300" y1="20" x2="160" y2="120" stroke="#C9960C" strokeWidth="0.8" opacity="0.5"
        variants={{ ...pathVariants, visible: { ...pathVariants.visible, transition: { duration: 1.2, delay: 1.1, ease: 'easeInOut' } } }} />
      <motion.line x1="20" y1="300" x2="160" y2="200" stroke="#C9960C" strokeWidth="0.8" opacity="0.5"
        variants={{ ...pathVariants, visible: { ...pathVariants.visible, transition: { duration: 1.2, delay: 1.2, ease: 'easeInOut' } } }} />
      <motion.line x1="300" y1="300" x2="160" y2="200" stroke="#C9960C" strokeWidth="0.8" opacity="0.5"
        variants={{ ...pathVariants, visible: { ...pathVariants.visible, transition: { duration: 1.2, delay: 1.3, ease: 'easeInOut' } } }} />
      {/* Petal arcs */}
      {[0, 90, 180, 270].map((angle, i) => (
        <motion.ellipse
          key={angle}
          cx={160 + 80 * Math.cos((angle * Math.PI) / 180)}
          cy={160 + 80 * Math.sin((angle * Math.PI) / 180)}
          rx="20" ry="35"
          transform={`rotate(${angle}, ${160 + 80 * Math.cos((angle * Math.PI) / 180)}, ${160 + 80 * Math.sin((angle * Math.PI) / 180)})`}
          stroke="#C9960C" strokeWidth="1" fill="rgba(201,150,12,0.04)"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, delay: 1.5 + i * 0.15, ease: 'easeInOut' } }
          }}
        />
      ))}
      {/* Corner flowers */}
      {[[20, 20], [300, 20], [20, 300], [300, 300]].map(([cx, cy], i) => (
        <motion.circle
          key={`corner-${i}`}
          cx={cx} cy={cy} r="8"
          stroke="#C9960C" strokeWidth="1" fill="rgba(201,150,12,0.08)"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 2 + i * 0.1, ease: 'easeOut' } }
          }}
        />
      ))}
      {/* Dots on the square corners */}
      {[
        [160, 20], [300, 160], [160, 300], [20, 160],
        [20, 20], [300, 20], [300, 300], [20, 300],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={cx} cy={cy} r="3"
          fill="#C9960C" opacity="0.6"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 0.6, transition: { duration: 0.3, delay: 2.5 + i * 0.05 } }
          }}
        />
      ))}
    </motion.svg>
  )
}
