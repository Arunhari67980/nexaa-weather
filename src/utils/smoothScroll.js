import Lenis from 'lenis'

let lenisInstance = null
let rafId = null

export function initSmoothScroll() {
  if (typeof window === 'undefined') return null

  // Clean up any existing instance first
  destroySmoothScroll()

  // On mobile or touch devices, rely on native 60/120Hz hardware momentum scrolling.
  // Smooth scroll libraries intercept touch events and cause noticeable latency/lag on mobile.
  const isTouchOrMobile =
    window.innerWidth < 768 ||
    'ontouchstart' in window ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)

  if (isTouchOrMobile) {
    return null
  }

  try {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false,
    })

    function raf(time) {
      if (lenisInstance) {
        lenisInstance.raf(time)
        rafId = requestAnimationFrame(raf)
      }
    }

    rafId = requestAnimationFrame(raf)
    lenisInstance = lenis
    return lenis
  } catch (err) {
    console.warn('Lenis initialization warning:', err)
    return null
  }
}

export function destroySmoothScroll() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}

