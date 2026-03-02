import { useEffect, useRef } from 'react'

const PETAL_COUNT = 35

function createPetal(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    size: Math.random() * 12 + 6,
    speedY: Math.random() * 1.2 + 0.3,
    speedX: Math.random() * 0.8 - 0.4,
    rotation: Math.random() * 360,
    rotationSpeed: Math.random() * 2 - 1,
    opacity: Math.random() * 0.4 + 0.15,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.02 + 0.01,
  }
}

function drawPetal(ctx, petal) {
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

  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size)
  gradient.addColorStop(0, '#FFFFFF')
  gradient.addColorStop(0.5, '#FFF0F5')
  gradient.addColorStop(1, '#FFE4EC')
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.strokeStyle = 'rgba(244, 160, 181, 0.3)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  ctx.restore()
}

export default function FallingPetals() {
  const canvasRef = useRef(null)
  const petalsRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(document.documentElement)
    window.addEventListener('resize', resize)

    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => createPetal(canvas))

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      petalsRef.current.forEach((petal) => {
        petal.wobble += petal.wobbleSpeed
        petal.x += petal.speedX + Math.sin(petal.wobble) * 0.5
        petal.y += petal.speedY
        petal.rotation += petal.rotationSpeed

        if (petal.y > canvas.height + 20) {
          petal.y = -20
          petal.x = Math.random() * canvas.width
        }
        if (petal.x > canvas.width + 20) petal.x = -20
        if (petal.x < -20) petal.x = canvas.width + 20

        drawPetal(ctx, petal)
      })

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      resizeObserver.disconnect()
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
