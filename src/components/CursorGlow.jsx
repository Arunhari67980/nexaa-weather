import { useEffect, useRef, useState } from 'react'

export default function CursorGlow({ accent = '#f472b6' }) {
  const glowRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const pos = useRef({ x: -250, y: -250, targetX: -250, targetY: -250 })

  useEffect(() => {
    // Disable completely on mobile screens or touch devices to eliminate background rAF overhead
    const isTouchOrMobile =
      typeof window === 'undefined' ||
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)

    if (isTouchOrMobile) return

    let animFrame = null

    const handleMouseMove = (e) => {
      pos.current.targetX = e.clientX
      pos.current.targetY = e.clientY
      if (!visible) setVisible(true)
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    const render = () => {
      // Smooth lerp interpolation
      pos.current.x += (pos.current.targetX - pos.current.x) * 0.12
      pos.current.y += (pos.current.targetY - pos.current.y) * 0.12

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x - 250}px, ${pos.current.y - 250}px, 0)`
      }

      animFrame = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    animFrame = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animFrame) cancelAnimationFrame(animFrame)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none transition-opacity duration-500 z-0 opacity-40 mix-blend-screen"
      style={{
        background: `radial-gradient(circle, ${accent}25 0%, ${accent}08 40%, transparent 70%)`,
        willChange: 'transform',
      }}
    />
  )
}
