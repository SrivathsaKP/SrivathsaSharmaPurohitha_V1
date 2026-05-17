export default function SacredMandala({ size = 400, className = '', opacity = 0.12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin-slow will-change-transform ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="200" cy="200" r="195" stroke="#C9960C" strokeWidth="0.8" />
      <circle cx="200" cy="200" r="185" stroke="#C9960C" strokeWidth="0.4" />

      {/* 16-petal lotus outer */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16
        const rad = (angle * Math.PI) / 180
        const cx = 200 + 160 * Math.sin(rad)
        const cy = 200 - 160 * Math.cos(rad)
        return (
          <ellipse
            key={`outer-petal-${i}`}
            cx={cx}
            cy={cy}
            rx="12"
            ry="28"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            stroke="#C9960C"
            strokeWidth="0.6"
            fill="rgba(201,150,12,0.04)"
          />
        )
      })}

      {/* 8-petal lotus middle */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8
        const rad = (angle * Math.PI) / 180
        const cx = 200 + 110 * Math.sin(rad)
        const cy = 200 - 110 * Math.cos(rad)
        return (
          <ellipse
            key={`mid-petal-${i}`}
            cx={cx}
            cy={cy}
            rx="14"
            ry="34"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            stroke="#C9960C"
            strokeWidth="0.8"
            fill="rgba(201,150,12,0.06)"
          />
        )
      })}

      {/* Inner geometric star */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12
        const rad = (angle * Math.PI) / 180
        const x1 = 200 + 60 * Math.sin(rad)
        const y1 = 200 - 60 * Math.cos(rad)
        const x2 = 200 + 80 * Math.sin(rad + Math.PI / 12)
        const y2 = 200 - 80 * Math.cos(rad + Math.PI / 12)
        return (
          <line
            key={`star-line-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#C9960C"
            strokeWidth="0.6"
          />
        )
      })}

      {/* Hexagram (Star of Shiva) */}
      <polygon
        points="200,140 240,200 200,260 160,200"
        stroke="#C9960C"
        strokeWidth="0.8"
        fill="none"
      />
      <polygon
        points="200,260 160,200 200,140 240,200"
        stroke="#C9960C"
        strokeWidth="0.8"
        fill="none"
        transform="rotate(30, 200, 200)"
      />

      {/* Radial spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24
        const rad = (angle * Math.PI) / 180
        const x1 = 200 + 40 * Math.sin(rad)
        const y1 = 200 - 40 * Math.cos(rad)
        const x2 = 200 + 130 * Math.sin(rad)
        const y2 = 200 - 130 * Math.cos(rad)
        return (
          <line
            key={`spoke-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#C9960C"
            strokeWidth="0.35"
            opacity="0.5"
          />
        )
      })}

      {/* Center circles */}
      <circle cx="200" cy="200" r="40" stroke="#C9960C" strokeWidth="0.8" fill="rgba(201,150,12,0.04)" />
      <circle cx="200" cy="200" r="28" stroke="#C9960C" strokeWidth="1" fill="rgba(201,150,12,0.06)" />
      <circle cx="200" cy="200" r="14" stroke="#C9960C" strokeWidth="1.2" fill="rgba(201,150,12,0.1)" />
      <circle cx="200" cy="200" r="4" fill="#C9960C" opacity="0.6" />

      {/* Om symbol in center */}
      <text
        x="200"
        y="207"
        textAnchor="middle"
        fontSize="18"
        fill="#C9960C"
        opacity="0.7"
        fontFamily="serif"
      >
        ॐ
      </text>
    </svg>
  )
}
