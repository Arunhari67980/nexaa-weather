import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

/**
 * AtmosphericEngine
 * Cinematic Multi-Season Hardware-Accelerated Particle Canvas Engine
 * Supports: Autumn Leaves, Winter Snow & Aurora, Spring Sakura, Summer Fireflies, Storm & Rain
 */
const AtmosphericEngine = forwardRef(function AtmosphericEngine(
  {
    season = 'autumn', // 'autumn' | 'winter' | 'spring' | 'summer' | 'storm'
    windSpeed = 'brisk', // 'gentle' | 'brisk' | 'storm'
    particleDensity = 1.0,
    interactive = true,
  },
  ref
) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const shockwavesRef = useRef([])
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, isDown: false })
  const lightningRef = useRef({ active: false, opacity: 0, timer: 0 })
  const gustRef = useRef({ active: false, vx: 0, vy: 0, duration: 0 })
  const animationFrameRef = useRef(null)

  // Expose trigger methods to parent via ref
  useImperativeHandle(ref, () => ({
    triggerGust: (strength = 1.5) => {
      gustRef.current = {
        active: true,
        vx: (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 6) * strength,
        vy: -(6 + Math.random() * 8) * strength,
        duration: 90, // ~1.5 seconds
      }
    },
    triggerShockwave: (x, y) => {
      createShockwave(x || window.innerWidth / 2, y || window.innerHeight / 2)
    },
    triggerLightning: () => {
      lightningRef.current = { active: true, opacity: 0.7, timer: 12 }
    },
  }))

  const createShockwave = (x, y) => {
    shockwavesRef.current.push({
      x,
      y,
      radius: 10,
      maxRadius: Math.min(window.innerWidth * 0.4, 280),
      opacity: 0.8,
      color:
        season === 'autumn'
          ? '#f0a352'
          : season === 'winter'
          ? '#67e8f9'
          : season === 'spring'
          ? '#f472b6'
          : season === 'summer'
          ? '#fbbf24'
          : '#818cf8',
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      initParticles()
    }

    window.addEventListener('resize', handleResize)

    // Setup particle count based on screen size
    const isMobile = window.innerWidth < 768
    const baseCount = isMobile ? 32 : 80
    const count = Math.floor(baseCount * particleDensity)

    // Helper: Leaf palette
    const autumnColors = ['#F0A352', '#C96F3B', '#D97736', '#E28743', '#8C3B1E', '#EAB308']
    const springColors = ['#F472B6', '#FB7185', '#F9A8D4', '#FDA4AF', '#FBCFE8', '#FFF1F2']
    const winterColors = ['#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#FFFFFF']
    const summerColors = ['#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#FEF08A']

    const createParticle = (initial = false) => {
      const type = season
      const x = Math.random() * width
      const y = initial ? Math.random() * height : -30 - Math.random() * 50

      let size = 0
      let vx = 0
      let vy = 0
      let color = '#fff'
      let rotation = Math.random() * Math.PI * 2
      let vRot = (Math.random() - 0.5) * 0.04
      let flip = Math.random() * Math.PI * 2
      let vFlip = 0.02 + Math.random() * 0.04
      let opacity = 0.4 + Math.random() * 0.55

      const windFactor = windSpeed === 'gentle' ? 0.6 : windSpeed === 'storm' ? 2.2 : 1.0

      if (type === 'autumn') {
        size = 10 + Math.random() * 16
        vx = (0.4 + Math.random() * 1.2) * windFactor
        vy = (0.8 + Math.random() * 1.6) * windFactor
        color = autumnColors[Math.floor(Math.random() * autumnColors.length)]
      } else if (type === 'winter') {
        size = 2.5 + Math.random() * 6
        vx = (Math.random() - 0.4) * 0.8 * windFactor
        vy = (0.7 + Math.random() * 1.8) * windFactor
        color = winterColors[Math.floor(Math.random() * winterColors.length)]
      } else if (type === 'spring') {
        size = 8 + Math.random() * 12
        vx = (0.6 + Math.random() * 1.4) * windFactor
        vy = (0.7 + Math.random() * 1.2) * windFactor
        color = springColors[Math.floor(Math.random() * springColors.length)]
      } else if (type === 'summer') {
        size = 2 + Math.random() * 4.5
        vx = (Math.random() - 0.5) * 0.6
        vy = -0.3 - Math.random() * 0.8 // floating upward fireflies
        color = summerColors[Math.floor(Math.random() * summerColors.length)]
        opacity = 0.2 + Math.random() * 0.7
      } else if (type === 'storm') {
        size = 14 + Math.random() * 22 // rain streak length
        vx = (1.5 + Math.random() * 2.5) * windFactor
        vy = (12 + Math.random() * 18) * windFactor // fast rain streaks
        color = '#a5b4fc'
        opacity = 0.25 + Math.random() * 0.45
      }

      return {
        x,
        y,
        size,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        color,
        rotation,
        vRot,
        flip,
        vFlip,
        opacity,
        pulse: Math.random() * Math.PI * 2,
        vPulse: 0.03 + Math.random() * 0.05,
      }
    }

    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(true))
      }
    }

    initParticles()

    // Mouse / Touch aerodynamics
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY

      const dx = clientX - mouseRef.current.lastX
      const dy = clientY - mouseRef.current.lastY

      mouseRef.current.vx = dx * 0.35
      mouseRef.current.vy = dy * 0.35
      mouseRef.current.x = clientX
      mouseRef.current.y = clientY
      mouseRef.current.lastX = clientX
      mouseRef.current.lastY = clientY
    }

    const handlePointerDown = (e) => {
      if (!interactive) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      createShockwave(clientX, clientY)
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown)

    // Lightning random generator for storm
    let lightningCooldown = 180

    // Drawing sub-routines
    const drawMapleLeaf = (size, color, opacity, flip) => {
      ctx.save()
      ctx.scale(Math.cos(flip), 1)
      ctx.globalAlpha = opacity
      ctx.fillStyle = color

      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.bezierCurveTo(size * 0.3, -size * 0.8, size * 0.5, -size * 0.5, size * 0.8, -size * 0.4)
      ctx.bezierCurveTo(size * 0.5, -size * 0.1, size * 0.7, size * 0.3, size * 0.5, size * 0.6)
      ctx.bezierCurveTo(size * 0.2, size * 0.4, size * 0.1, size * 0.7, 0, size * 0.9)
      ctx.bezierCurveTo(-size * 0.1, size * 0.7, -size * 0.2, size * 0.4, -size * 0.5, size * 0.6)
      ctx.bezierCurveTo(-size * 0.7, size * 0.3, -size * 0.5, -size * 0.1, -size * 0.8, -size * 0.4)
      ctx.bezierCurveTo(-size * 0.5, -size * 0.5, -size * 0.3, -size * 0.8, 0, -size)
      ctx.closePath()
      ctx.fill()

      // Leaf stem
      ctx.strokeStyle = 'rgba(40, 24, 18, 0.45)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, size * 0.4)
      ctx.lineTo(0, size * 1.15)
      ctx.stroke()
      ctx.restore()
    }

    const drawSakuraPetal = (size, color, opacity, flip) => {
      ctx.save()
      ctx.scale(Math.cos(flip), 1)
      ctx.globalAlpha = opacity
      ctx.fillStyle = color

      ctx.beginPath()
      ctx.moveTo(0, -size * 0.8)
      ctx.bezierCurveTo(size * 0.6, -size * 0.6, size * 0.7, size * 0.4, 0, size)
      ctx.bezierCurveTo(-size * 0.7, size * 0.4, -size * 0.6, -size * 0.6, 0, -size * 0.8)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const drawSnowflake = (size, color, opacity, rotation) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(1, size * 0.2)
      ctx.lineCap = 'round'

      for (let i = 0; i < 6; i++) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, size)
        // Snowflake side branches
        if (size > 4) {
          ctx.moveTo(0, size * 0.5)
          ctx.lineTo(size * 0.3, size * 0.7)
          ctx.moveTo(0, size * 0.5)
          ctx.lineTo(-size * 0.3, size * 0.7)
        }
        ctx.stroke()
        ctx.rotate(Math.PI / 3)
      }
      ctx.restore()
    }

    const drawFirefly = (size, color, opacity, pulse) => {
      ctx.save()
      const glowAlpha = Math.max(0.1, (Math.sin(pulse) + 1) * 0.45 * opacity)
      ctx.globalAlpha = glowAlpha

      // Outer radial glow
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3)
      grad.addColorStop(0, color)
      grad.addColorStop(0.5, 'rgba(250, 204, 21, 0.2)')
      grad.addColorStop(1, 'transparent')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Inner intense core
      ctx.globalAlpha = Math.min(1, glowAlpha * 1.5)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.75, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawRainStreak = (length, color, opacity, vx, vy) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      ctx.lineCap = 'round'

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-vx * 0.8, -vy * 0.8)
      ctx.stroke()
      ctx.restore()
    }

    // MAIN ANIMATION LOOP
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Decay mouse velocity
      mouseRef.current.vx *= 0.85
      mouseRef.current.vy *= 0.85

      // Lightning handling (Storm season)
      if (season === 'storm') {
        lightningCooldown--
        if (lightningCooldown <= 0 && Math.random() < 0.015) {
          lightningRef.current = { active: true, opacity: 0.65 + Math.random() * 0.35, timer: 10 }
          lightningCooldown = 180 + Math.floor(Math.random() * 240)
        }

        if (lightningRef.current.active) {
          ctx.save()
          ctx.fillStyle = `rgba(165, 180, 252, ${lightningRef.current.opacity * 0.35})`
          ctx.fillRect(0, 0, width, height)
          ctx.restore()

          lightningRef.current.timer--
          lightningRef.current.opacity *= 0.75
          if (lightningRef.current.timer <= 0) {
            lightningRef.current.active = false
          }
        }
      }

      // Handle full-screen wind gust
      let gustVx = 0
      let gustVy = 0
      if (gustRef.current.active) {
        gustVx = gustRef.current.vx
        gustVy = gustRef.current.vy
        gustRef.current.duration--
        gustRef.current.vx *= 0.96
        gustRef.current.vy *= 0.96
        if (gustRef.current.duration <= 0) {
          gustRef.current.active = false
        }
      }

      // Render & update shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i]
        sw.radius += (sw.maxRadius - sw.radius) * 0.12
        sw.opacity *= 0.92

        ctx.save()
        ctx.beginPath()
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2)
        ctx.strokeStyle = sw.color
        ctx.lineWidth = Math.max(1, 3 * (sw.opacity / 0.8))
        ctx.globalAlpha = sw.opacity
        ctx.stroke()
        ctx.restore()

        if (sw.opacity < 0.02) {
          shockwavesRef.current.splice(i, 1)
        }
      }

      // Render & update particles
      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Shockwave displacement
        for (let j = 0; j < shockwavesRef.current.length; j++) {
          const sw = shockwavesRef.current[j]
          const dx = p.x - sw.x
          const dy = p.y - sw.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 0 && Math.abs(dist - sw.radius) < 60) {
            const force = ((60 - Math.abs(dist - sw.radius)) / 60) * 8 * sw.opacity
            p.x += (dx / dist) * force
            p.y += (dy / dist) * force
          }
        }

        // Mouse wake aerodynamics
        const mdx = p.x - mouseRef.current.x
        const mdy = p.y - mouseRef.current.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 140 && mdist > 0) {
          const proximity = (140 - mdist) / 140
          p.x += mouseRef.current.vx * proximity * 0.7
          p.y += mouseRef.current.vy * proximity * 0.7
          p.rotation += (mouseRef.current.vx * 0.02 + mouseRef.current.vy * 0.02) * proximity
        }

        // Apply velocities + gusts
        p.x += p.vx + gustVx
        p.y += p.vy + gustVy
        p.rotation += p.vRot
        p.flip += p.vFlip
        p.pulse += p.vPulse

        // Respawn wrap-around
        if (season === 'summer') {
          // Fireflies float upwards
          if (p.y < -30) {
            p.y = height + 20
            p.x = Math.random() * width
          }
        } else {
          // Downward falling items
          if (p.y > height + 40) {
            p.y = -30
            p.x = Math.random() * width
          }
        }

        if (p.x > width + 40) p.x = -30
        if (p.x < -40) p.x = width + 30

        // Draw particle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        if (season === 'autumn') {
          drawMapleLeaf(p.size, p.color, p.opacity, p.flip)
        } else if (season === 'winter') {
          drawSnowflake(p.size, p.color, p.opacity, p.rotation)
        } else if (season === 'spring') {
          drawSakuraPetal(p.size, p.color, p.opacity, p.flip)
        } else if (season === 'summer') {
          drawFirefly(p.size, p.color, p.opacity, p.pulse)
        } else if (season === 'storm') {
          drawRainStreak(p.size, p.color, p.opacity, p.vx, p.vy)
        }

        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }

    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [season, windSpeed, particleDensity, interactive])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-700"
      style={{ willChange: 'transform' }}
    />
  )
})

export default AtmosphericEngine
