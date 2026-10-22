import { useState, useRef, useEffect } from 'react'

export default function TiltCard({
  children,
  className = '',
  style = {},
  accentColor = '#f0a352',
  maxTilt = 6,
  glare = true,
  onClick,
  ...rest
}) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  })
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsTouch(true)
    }
  }, [])

  const handleMouseMove = (e) => {
    if (isTouch || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    setTilt({
      rotateX: Number(rotateX.toFixed(2)),
      rotateY: Number(rotateY.toFixed(2)),
      glareX: Number(glareX.toFixed(1)),
      glareY: Number(glareY.toFixed(1)),
      isHovered: true,
    })
  }

  const handleMouseLeave = () => {
    if (isTouch) return
    setTilt((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    }))
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative group rounded-3xl transition-shadow duration-500 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: !isTouch && tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        willChange: tilt.isHovered ? 'transform' : 'auto',
        ...style,
      }}
      {...rest}
    >
      {/* Top Ambient Edge Light */}
      <div
        className="absolute top-0 left-4 right-4 h-[1.5px] rounded-full pointer-events-none transition-opacity duration-500 z-20"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
          opacity: tilt.isHovered ? 0.95 : 0.45,
          boxShadow: tilt.isHovered ? `0 0 12px ${accentColor}` : 'none',
        }}
      />

      {/* Dynamic Specular Glare Spotlight */}
      {glare && !isTouch && tilt.isHovered && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle 280px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)`,
          }}
        />
      )}

      {children}
    </div>
  )
}
