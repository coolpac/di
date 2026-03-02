import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { HeartIcon } from './SvgIcons'

const PHOTO_SRC = '/photos/diana-34.jpeg' // Holding hands in snow

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
  const [phase, setPhase] = useState('idle')
  const [isReady, setIsReady] = useState(false)
  const [showPhoto, setShowPhoto] = useState(true)
  const particles = useRef([])
  const animRef = useRef(null)
  const timersRef = useRef([])

  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const canvasW = mobile ? Math.min(320, window.innerWidth - 40) : 400
  const canvasH = mobile ? 400 : 500
  const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1

  // Photo display dimensions (same as canvas)
  const photoSize = Math.min(canvasW, canvasH) * 0.85

  const initParticles = useCallback(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const offscreen = document.createElement('canvas')
      const imgW = photoSize
      const imgH = photoSize
      offscreen.width = imgW
      offscreen.height = imgH

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
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, imgW, imgH)

      const imageData = ctx.getImageData(0, 0, imgW, imgH)
      const data = imageData.data

      // Denser sampling for recognizable photo
      const step = mobile ? 3 : 2
      const particleSize = mobile ? 3 : 2
      const cx = canvasW / 2
      const cy = canvasH / 2
      const offsetX = (canvasW - imgW) / 2
      const offsetY = (canvasH - imgH) / 2
      const pts = []

      for (let y = 0; y < imgH; y += step) {
        for (let x = 0; x < imgW; x += step) {
          const i = (y * imgW + x) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          if (a < 128) continue

          const imgX = offsetX + x
          const imgY = offsetY + y

          pts.push({
            x: imgX,
            y: imgY,
            homeX: imgX,
            homeY: imgY,
            heartX: 0,
            heartY: 0,
            targetX: imgX,
            targetY: imgY,
            r, g, b,
            size: particleSize,
            vx: 0,
            vy: 0,
          })
        }
      }

      // Distribute heart positions
      const numPts = pts.length
      for (let i = 0; i < numPts; i++) {
        const t = (i / numPts) * Math.PI * 2
        const heartScale = mobile ? 9 : 12
        const { x: hx, y: hy } = heartPoint(t, heartScale, cx, cy * 0.92)
        // Fill interior
        const fill = Math.sqrt(Math.random()) // sqrt for more uniform fill
        const fx = cx + (hx - cx) * fill
        const fy = cy * 0.92 + (hy - cy * 0.92) * fill
        pts[i].heartX = fx
        pts[i].heartY = fy
      }

      // Sort particles by position for spatial coherence in heart mapping
      pts.sort((a, b) => {
        const angleA = Math.atan2(a.homeY - cy, a.homeX - cx)
        const angleB = Math.atan2(b.homeY - cy, b.homeX - cx)
        return angleA - angleB
      })

      particles.current = pts
      setIsReady(true)
    }
    img.src = PHOTO_SRC
  }, [canvasW, canvasH, photoSize, mobile])

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
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        p.vx += dx * 0.08
        p.vy += dy * 0.08
        p.vx *= 0.85
        p.vy *= 0.85
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

  // Clear all timers helper
  const clearTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
  }

  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }

  // Animation sequence
  useEffect(() => {
    if (!isReady || !isInView) return

    setPhase('photo')
    setShowPhoto(true)

    const runCycle = (delay = 0) => {
      // Hide photo and show particles as photo
      addTimer(() => {
        setShowPhoto(false)
      }, delay + 1000)

      // Morph to heart
      addTimer(() => {
        setPhase('morphing')
        particles.current.forEach(p => {
          p.targetX = p.heartX
          p.targetY = p.heartY
        })
      }, delay + 2500)

      addTimer(() => {
        setPhase('heart')
      }, delay + 4500)

      // Return to photo
      addTimer(() => {
        setPhase('returning')
        particles.current.forEach(p => {
          p.targetX = p.homeX
          p.targetY = p.homeY
        })
      }, delay + 7000)

      // Show real photo again
      addTimer(() => {
        setPhase('photo')
        setShowPhoto(true)
      }, delay + 9000)

      // Loop
      addTimer(() => {
        runCycle(0)
      }, delay + 12000)
    }

    runCycle(500)

    return () => clearTimers()
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
        style={{ position: 'relative', width: canvasW, height: canvasH }}
      >
        {/* Real photo — shown during "photo" phase for clarity */}
        <motion.img
          src={PHOTO_SRC}
          alt="Мы"
          initial={{ opacity: 0 }}
          animate={{ opacity: showPhoto ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: photoSize,
            height: photoSize,
            objectFit: 'cover',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: canvasW,
            height: canvasH,
            borderRadius: '20px',
            position: 'relative',
            zIndex: 1,
          }}
        />

        {/* Phase label */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1rem',
            color: 'var(--text-light)',
            position: 'absolute',
            bottom: -40,
            left: 0,
            right: 0,
          }}
        >
          {phase === 'morphing' && 'Превращается в любовь...'}
          {phase === 'heart' && <HeartIcon size={20} color="#E8587A" style={{ display: 'inline-block', verticalAlign: 'middle' }} />}
          {phase === 'returning' && 'И снова мы...'}
        </motion.div>
      </motion.div>

      {/* Spacer for phase label */}
      <div style={{ height: '50px' }} />

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
