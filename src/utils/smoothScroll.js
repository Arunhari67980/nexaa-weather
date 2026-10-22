import Lenis from 'lenis'

let lenisInstance = null

export function initSmoothScroll() {
  if (typeof window === 'undefined') return null

  // Prevent double instantiation
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }

  try {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    lenisInstance = lenis
    return lenis
  } catch (err) {
    console.warn('Lenis initialization warning:', err)
    return null
  }
}

export function destroySmoothScroll() {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}
