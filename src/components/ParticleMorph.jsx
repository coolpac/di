import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

const PHOTO_SRC = '/photos/diana-34.jpeg' // Holding hands in snow — romantic
const PARTICLE_SIZE = 3

// Heart shape parametric function
function heartPoint(t, scale, cx, cy) {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  return {
    x: cx + x * scale,
    y: cy + y * scale,
  }
}

export default function ParticleMorph() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [phase, setPhase] = useState('idle') // idle, photo, morphing, heart, returning
  const [isReady, setIsReady] = useState(false)
  const particles = useRef([])
  const animRef = useRef(null)
  const imgRef = useRef(null)

  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const canvasW = mobile ? Math.min(340, window.innerWidth - 40) : 450
  const canvasH = mobile ? 340 : 450
  const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1

  // Load image and sample pixels
  const initParticles = useCallback(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgRef.current = img

      // Draw image to offscreen canvas to sample pixels
      const offscreen = document.createElement('canvas')
      const imgSize = Math.min(canvasW, canvasH) * 0.8
      offscreen.width = imgSize
      offscreen.height = imgSize

      const ctx = offscreen.getContext('2d')
      // Cover crop
      const aspect = img.width / img.height
      let sw, sh, sx, sy
      if (aspect > 1) {
        sh = img.height
        sw = img.height
        sx = (img.width - sw) / 2
        sy = 0
      } else {
        sw = img.width
        sh = img.width
        sx = 0
        sy = (img.height - sh) / 2
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, imgSize, imgSize)

      const imageData = ctx.getImageData(0, 0, imgSize, imgSize)
      const data = imageData.data

      // Sample particles from image
      const step = mobile ? 5 : 4
      const cx = canvasW / 2
      const cy = canvasH / 2
      const offsetX = (canvasW - imgSize) / 2
      const offsetY = (canvasH - imgSize) / 2
      const pts = []

      for (let y = 0; y < imgSize; y += step) {
        for (let x = 0; x < imgSize; x += step) {
          const i = (y * imgSize + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          if (a < 128) continue

          // Image position
          const imgX = offsetX + x
          const imgY = offsetY + y

          // Heart position
          const heartScale = mobile ? 8 : 10.5
          const angle = Math.random() * Math.PI * 2
          const { x: hx, y: hy } = heartPoint(angle, heartScale, cx, cy * 0.95)
          // Add slight randomness to fill the heart
          const rad = Math.random() * heartScale * 3
          const innerAngle = Math.random() * Math.PI * 2
          const heartX = hx + Math.cos(innerAngle) * rad * 0.3
          const heartY = hy + Math.sin(innerAngle) * rad * 0.3

          pts.push({
            x: imgX,
            y: imgY,
            homeX: imgX,
            homeY: imgY,
            heartX,
            heartY,
            targetX: imgX,
            targetY: imgY,
            r, g, b,
            size: PARTICLE_SIZE + Math.random() * 1,
            vx: 0,
            vy: 0,
          })
        }
      }

      // Re-distribute heart positions evenly
      const heartPoints = []
      const numPts = pts.length
      for (let i = 0; i < numPts; i++) {
        const t = (i / numPts) * Math.PI * 2
        const heartScale = mobile ? 8.5 : 11
        const { x: hx, y: hy } = heartPoint(t, heartScale, cx, cy * 0.95)
        // Fill the interior
        const fill = Math.random()
        const fx = cx + (hx - cx) * fill
        const fy = cy * 0.95 + (hy - cy * 0.95) * fill
        heartPoints.push({ x: fx, y: fy })
      }

      // Sort by distance for better mapping
      heartPoints.sort((a, b) => {
        const da = Math.atan2(a.y - cy, a.x - cx)
        const db = Math.atan2(b.y - cy, b.x - cx)
        return da - db
      })

      pts.forEach((p, i) => {
        const hp = heartPoints[i % heartPoints.length]
        p.heartX = hp.x
        p.heartY = hp.y
      })

      particles.current = pts
      setIsReady(true)
    }
    img.src = PHOTO_SRC
  }, [canvasW, canvasH, mobile])

  useEffect(() => {
    if (isInView) initParticles()
  }, [isInView, initParticles])

  // Animation loop
  useEffect(() => {
    if (!isReady) return

    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvasW * pixelRatio
    canvas.height = canvasH * pixelRatio
    const ctx = canvas.getContext('2d')
    ctx.scale(pixelRatio, pixelRatio)

    let running = true

    const animate = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvasW, canvasH)

      const pts = particles.current
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        // Ease toward target
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        p.vx += dx * 0.06
        p.vy += dy * 0.06
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += p.vx
        p.y += p.vy

        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      running = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isReady, canvasW, canvasH, pixelRatio])

  // Start sequence when visible
  useEffect(() => {
    if (!isReady || !isInView) return
    // Show photo first
    setPhase('photo')

    const t1 = setTimeout(() => {
      // Morph to heart
      setPhase('morphing')
      particles.current.forEach(p => {
        p.targetX = p.heartX
        p.targetY = p.heartY
      })
    }, 2500)

    const t2 = setTimeout(() => {
      setPhase('heart')
    }, 4500)

    const t3 = setTimeout(() => {
      // Return to photo
      setPhase('returning')
      particles.current.forEach(p => {
        p.targetX = p.homeX
        p.targetY = p.homeY
      })
    }, 7000)

    const t4 = setTimeout(() => {
      setPhase('photo')
      // Loop: morph again
      const loop = () => {
        const lt1 = setTimeout(() => {
          setPhase('morphing')
          particles.current.forEach(p => {
            p.targetX = p.heartX
            p.targetY = p.heartY
          })
        }, 3000)

        const lt2 = setTimeout(() => setPhase('heart'), 5000)

        const lt3 = setTimeout(() => {
          setPhase('returning')
          particles.current.forEach(p => {
            p.targetX = p.homeX
            p.targetY = p.homeY
          })
        }, 8000)

        const lt4 = setTimeout(() => {
          setPhase('photo')
          loop()
        }, 10000)

        return [lt1, lt2, lt3, lt4]
      }
      loop()
    }, 9000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [isReady, isInView])

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF0F5 50%, #FFE4EC 100%)',
        padding: '80px 20px',
        minHeight: 'auto',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '16px',
        }}>
          Магия
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: 400,
          color: 'var(--text-dark)',
          marginBottom: '16px',
        }}>
          Мы — одно целое
        </h2>
        <div style={{
          width: '40px',
          height: '1px',
          background: 'var(--gold)',
          margin: '0 auto',
        }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView && isReady ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ position: 'relative' }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: canvasW,
            height: canvasH,
            borderRadius: '20px',
          }}
        />

        {/* Phase label */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1rem',
            color: 'var(--text-light)',
          }}
        >
          {phase === 'morphing' && 'Превращается в любовь...'}
          {phase === 'heart' && '❤️'}
          {phase === 'returning' && 'И снова мы...'}
        </motion.div>
      </motion.div>

      {!isReady && isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--text-light)',
          }}
        >
          Загрузка...
        </motion.div>
      )}
    </section>
  )
}
