import { useEffect, useRef } from 'react'

function isMobile() {
  return window.innerWidth < 768
}

function createPetal(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h - h,
    size: Math.random() * 10 + 5,
    speedY: Math.random() * 0.8 + 0.2,
    speedX: Math.random() * 0.5 - 0.25,
    rotation: Math.random() * 360,
    rotationSpeed: Math.random() * 1.5 - 0.75,
    opacity: Math.random() * 0.3 + 0.1,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.015 + 0.005,
  }
}

export default function FallingPetals() {
  const canvasRef = useRef(null)
  const petalsRef = useRef([])
  const animRef = useRef(null)
  const frameCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const mobile = isMobile()
    const petalCount = mobile ? 12 : 25
    // On mobile, skip every other frame to save CPU
    const frameSkip = mobile ? 2 : 1

    function resize() {
      // Use viewport size, not full document height — much lighter
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    petalsRef.current = Array.from({ length: petalCount }, () =>
      createPetal(canvas.width, canvas.height)
    )

    // Pre-compute a simple petal color (no gradient per frame on mobile)
    const petalColor = '#FFF0F5'
    const petalStroke = 'rgba(244, 160, 181, 0.2)'

    function drawPetalSimple(petal) {
      ctx.save()
      ctx.translate(petal.x, petal.y)
      ctx.rotate((petal.rotation * Math.PI) / 180)
      ctx.globalAlpha = petal.opacity

      ctx.beginPath()
      ctx.moveTo(0, -petal.size / 2)
      ctx.bezierCurveTo(
        petal.size / 2, -petal.size / 3,
        petal.size / 2, petal.size / 3,
        0, petal.size / 2
      )
      ctx.bezierCurveTo(
        -petal.size / 2, petal.size / 3,
        -petal.size / 2, -petal.size / 3,
        0, -petal.size / 2
      )

      ctx.fillStyle = petalColor
      ctx.fill()

      if (!mobile) {
        ctx.strokeStyle = petalStroke
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      ctx.restore()
    }

    function animate() {
      frameCountRef.current++

      // Skip frames on mobile
      if (frameCountRef.current % frameSkip !== 0) {
        animRef.current = requestAnimationFrame(animate)
        return
      }

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      petalsRef.current.forEach((petal) => {
        petal.wobble += petal.wobbleSpeed
        petal.x += petal.speedX + Math.sin(petal.wobble) * 0.4
        petal.y += petal.speedY
        petal.rotation += petal.rotationSpeed

        if (petal.y > h + 20) {
          petal.y = -20
          petal.x = Math.random() * w
        }
        if (petal.x > w + 20) petal.x = -20
        if (petal.x < -20) petal.x = w + 20

        drawPetalSimple(petal)
      })

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
