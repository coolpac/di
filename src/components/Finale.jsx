import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

function FloatingHeart({ heart, onRemove }) {
  return (
    <motion.div
      initial={{ x: heart.x, y: heart.y, scale: 0, opacity: 1 }}
      animate={{
        y: heart.y - 150 - Math.random() * 400,
        x: heart.x + (Math.random() - 0.5) * 300,
        scale: [0, 1.3, 1, 0.6],
        opacity: [1, 1, 0.8, 0],
        rotate: (Math.random() - 0.5) * 90,
      }}
      transition={{ duration: 2.5 + Math.random() * 1.5, ease: 'easeOut' }}
      onAnimationComplete={onRemove}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        fontSize: `${heart.size}px`,
        filter: heart.glow ? 'drop-shadow(0 0 8px rgba(255,100,150,0.6))' : 'none',
      }}
    >
      {heart.emoji}
    </motion.div>
  )
}

// Canvas firework effect for the kiss button
function KissFireworks({ active, containerRef }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const container = containerRef.current

    function resize() {
      if (!container) return
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2
      ctx.scale(2, 2)
    }
    resize()

    // Create firework particles
    const w = canvas.width / 2
    const h = canvas.height / 2
    const colors = [
      '#FF69B4', '#FFD700', '#FF1493', '#FF6B8A', '#FFF0F5',
      '#E8587A', '#D4AF37', '#FF85A2', '#FFB6C1', '#FFFFFF',
    ]

    // Multiple explosion centers
    const centers = [
      { x: w * 0.5, y: h * 0.4 },
      { x: w * 0.3, y: h * 0.3 },
      { x: w * 0.7, y: h * 0.35 },
      { x: w * 0.2, y: h * 0.5 },
      { x: w * 0.8, y: h * 0.5 },
    ]

    // Staggered explosions
    centers.forEach((center, ci) => {
      setTimeout(() => {
        const count = 40 + Math.floor(Math.random() * 20)
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
          const speed = 2 + Math.random() * 5
          const isHeart = Math.random() < 0.3
          particlesRef.current.push({
            x: center.x, y: center.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: isHeart ? 6 + Math.random() * 8 : 2 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 80 + Math.random() * 60,
            maxLife: 80 + Math.random() * 60,
            gravity: 0.03 + Math.random() * 0.02,
            isHeart,
            trail: [],
          })
        }
      }, ci * 200)
    })

    function drawHeart(ctx, x, y, size, color, alpha) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      const s = size / 2
      ctx.moveTo(x, y + s * 0.3)
      ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.1)
      ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s * 1.2)
      ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1)
      ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3)
      ctx.fill()
      ctx.restore()
    }

    function animate() {
      ctx.clearRect(0, 0, w, h)

      particlesRef.current = particlesRef.current.filter(p => {
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 6) p.trail.shift()

        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= 0.99
        p.life--

        const alpha = Math.max(0, p.life / p.maxLife)

        // Draw trail
        if (!p.isHeart && p.trail.length > 1) {
          for (let i = 1; i < p.trail.length; i++) {
            const t = p.trail[i]
            const ta = (i / p.trail.length) * alpha * 0.3
            ctx.beginPath()
            ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.globalAlpha = ta
            ctx.fill()
            ctx.globalAlpha = 1
          }
        }

        if (p.isHeart) {
          drawHeart(ctx, p.x, p.y, p.size, p.color, alpha)
        } else {
          ctx.save()
          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 6
          ctx.fill()
          ctx.restore()
        }

        return p.life > 0
      })

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate)
      }
    }
    animRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animRef.current)
  }, [active, containerRef])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  )
}

export default function Finale({ showExtra }) {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hearts, setHearts] = useState([])
  const [kissTriggered, setKissTriggered] = useState(false)
  const [fireworksActive, setFireworksActive] = useState(false)
  const [kissCount, setKissCount] = useState(0)
  const [showFlash, setShowFlash] = useState(false)

  const spawnHearts = useCallback((e) => {
    const rect = e?.currentTarget?.getBoundingClientRect() || { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 }
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const emojis = ['\u2764\uFE0F', '\u{1F497}', '\u{1F496}', '\u{1F495}', '\u{1F49E}', '\u{1F48B}', '\u2728', '\u{1F31F}', '\u{1F339}', '\u{1F490}']

    // Flash effect
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 200)

    // Multiple waves of hearts
    const waves = [0, 150, 350, 600]
    waves.forEach((delay, wi) => {
      setTimeout(() => {
        const count = 12 + wi * 3
        const newHearts = Array.from({ length: count }, (_, i) => ({
          id: Date.now() + i + wi * 100,
          x: centerX + (Math.random() - 0.5) * (150 + wi * 80),
          y: centerY + (Math.random() - 0.5) * 60,
          size: 18 + Math.random() * 28,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          glow: Math.random() < 0.4,
        }))
        setHearts(prev => [...prev, ...newHearts])
      }, delay)
    })

    // Fireworks!
    setFireworksActive(false)
    setTimeout(() => setFireworksActive(true), 50)
    setTimeout(() => setFireworksActive(false), 4000)

    setKissTriggered(true)
    setKissCount(prev => prev + 1)
  }, [])

  const removeHeart = useCallback((id) => {
    setHearts(prev => prev.filter(h => h.id !== id))
  }, [])

  // Auto hearts on first view
  useEffect(() => {
    if (isInView && !kissTriggered) {
      const timer = setTimeout(() => {
        const emojis = ['\u2764\uFE0F', '\u{1F497}', '\u{1F496}', '\u2728']
        const newHearts = Array.from({ length: 6 }, (_, i) => ({
          id: Date.now() + i,
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          y: window.innerHeight * 0.6,
          size: 16 + Math.random() * 18,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          glow: false,
        }))
        setHearts(prev => [...prev, ...newHearts])
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isInView, kissTriggered])

  return (
    <section
      ref={containerRef}
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF8F0 0%, #FFE4EC 40%, #FFF0F5 70%, #FFF8F0 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* Pink flash on kiss */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, rgba(255,105,180,0.3), transparent 70%)',
              zIndex: 40,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Canvas fireworks */}
      <KissFireworks active={fireworksActive} containerRef={containerRef} />

      {/* Pulsing background glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.06, 0.1, 0.06],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--rose) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div ref={ref} style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '600px', padding: '0 20px' }}>
        {/* Big heart */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', marginBottom: '24px' }}
          >
            {'\u2764\uFE0F'}
          </motion.div>
        </motion.div>

        {/* Main text */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 5vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--text-dark)',
            lineHeight: 1.4,
            marginBottom: '16px',
          }}
        >
          Ты — лучшее, что
          <br />
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, var(--rose-deep), var(--gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
          }}>
            случилось в моей жизни
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            color: 'var(--text-medium)',
            marginBottom: '40px',
            lineHeight: 1.7,
          }}
        >
          С праздником, моя любимая Диана!
          <br />
          Пусть каждый день будет наполнен
          <br />
          теплом, радостью и нашей любовью.
        </motion.p>

        {/* Kiss button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(232, 88, 122, 0.45)' }}
          whileTap={{ scale: 0.92 }}
          onClick={spawnHearts}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            padding: '16px 44px',
            border: 'none',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, var(--rose-deep), #FF69B4)',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 25px rgba(232, 88, 122, 0.35)',
            marginBottom: '12px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>
            {'\u{1F48B}'} Отправить виртуальный поцелуй
          </span>
        </motion.button>

        {/* Kiss counter */}
        <AnimatePresence>
          {kissCount > 0 && (
            <motion.p
              key={kissCount}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--rose)',
                marginBottom: '30px',
              }}
            >
              {kissCount === 1 ? 'Поцелуй отправлен!' :
               kissCount < 5 ? `Уже ${kissCount} поцелуя!` :
               `${kissCount} поцелуев! Диана счастлива!`} {'\u{1F48B}'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Game bonus */}
        <AnimatePresence>
          {showExtra && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
              style={{
                padding: '20px 28px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid var(--rose-light)',
                marginBottom: '30px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                color: 'var(--rose-deep)',
                fontSize: '1rem',
              }}>
                {'\u{1F490}'} Букет собран и ждёт тебя!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 1 }}
        >
          <div style={{
            width: '40px',
            height: '1px',
            background: 'var(--gold)',
            margin: '0 auto 20px',
          }} />
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            color: 'var(--text-dark)',
          }}>
            С любовью, навсегда твой {'\u2764\uFE0F'}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-light)',
            marginTop: '40px',
            letterSpacing: '0.1em',
          }}>
            8 марта 2026
          </p>
        </motion.div>
      </div>

      {/* Floating hearts */}
      <AnimatePresence>
        {hearts.map(heart => (
          <FloatingHeart
            key={heart.id}
            heart={heart}
            onRemove={() => removeHeart(heart.id)}
          />
        ))}
      </AnimatePresence>
    </section>
  )
}
