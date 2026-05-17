export default function DivaFlame({ size = 'md' }) {
  const dims = size === 'sm'
    ? { base: 'w-6 h-8', flame: 'w-4 h-6', inner: 'w-2.5 h-4', wick: 'w-1 h-3', base_bowl: 'w-8 h-2' }
    : { base: 'w-8 h-10', flame: 'w-5 h-8', inner: 'w-3 h-5', wick: 'w-1.5 h-3', base_bowl: 'w-10 h-2.5' }

  return (
    <div className="relative inline-flex flex-col items-center" aria-hidden="true">
      {/* Flame glow radial */}
      <div
        className="absolute"
        style={{
          width: size === 'sm' ? '60px' : '80px',
          height: size === 'sm' ? '60px' : '80px',
          top: '-10px',
          background: 'radial-gradient(ellipse at 50% 60%, rgba(201,150,12,0.25) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
      {/* Outer flame */}
      <div
        className={`relative ${dims.flame} bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 animate-flame`}
        style={{ borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%' }}
      >
        {/* Inner flame */}
        <div
          className={`absolute bottom-1 left-1/2 -translate-x-1/2 ${dims.inner} bg-gradient-to-t from-orange-300 via-yellow-200 to-white animate-flame-inner`}
          style={{ borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%' }}
        />
      </div>
      {/* Wick */}
      <div className={`${dims.wick} bg-gray-700 rounded-full -mt-0.5`} />
      {/* Diya bowl */}
      <div
        className={`${dims.base_bowl} rounded-b-full rounded-t-sm`}
        style={{
          background: 'linear-gradient(135deg, #9B6E0A, #C9960C, #E8B84B)',
          boxShadow: '0 2px 8px rgba(201,150,12,0.4)',
        }}
      />
    </div>
  )
}
