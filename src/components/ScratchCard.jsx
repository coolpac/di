import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { HeartIcon, SparkleIcon } from './SvgIcons'

const SCRATCH_THRESHOLD = 0.55
const BRUSH_RADIUS = 28

const hiddenMessage = 'Ты — моё всё'
const hiddenSubtext = 'Моя любимая Дианочка'

export default function ScratchCard() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [revealed, setRevealed] = useState(false)
  const [scratchPercent, setScratchPercent] = useState(0)
  const [isScratching, setIsScratching] = useState(false)
  const [sparkles, setSparkles] = useState([])
  const isDrawing = useRef(false)
  const lastPos = useRef(null)

  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const cardW = mobile ? Math.min(340, window.innerWidth - 40) : 420
  const cardH = mobile ? 220 : 260

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = cardW * 2
    canvas.height = cardH * 2
    ctx.scale(2, 2)

    // Golden scratch overlay
    const grad = ctx.createLinearGradient(0, 0, cardW, cardH)
    grad.addColorStop(0, '#D4AF37')
    grad.addColorStop(0.3, '#F0D78C')
    grad.addColorStop(0.5, '#D4AF37')
    grad.addColorStop(0.7, '#C5981B')
    grad.addColorStop(1, '#D4AF37')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, cardW, cardH)

    // Decorative pattern
    ctx.save()
    ctx.globalAlpha = 0.15
    ctx.strokeStyle = '#FFF8F0'
    ctx.lineWidth = 0.5
    for (let i = 0; i < cardW + cardH; i += 16) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(0, i)
      ctx.stroke()
    }
    ctx.restore()

    // Text hint
    ctx.save()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = '#FFF8F0'
    ctx.font = `${mobile ? 13 : 15}px Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Потри, чтобы узнать секрет', cardW / 2, cardH / 2)
    ctx.restore()
  }, [cardW, cardH, mobile])

  const addSparkle = useCallback((x, y) => {
    const id = Date.now() + Math.random()
    setSparkles(prev => [...prev.slice(-8), { id, x, y }])
    setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 600)
  }, [])

  const scratch = useCallback((x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'

    if (lastPos.current) {
      const dx = x - lastPos.current.x
      const dy = y - lastPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.max(1, Math.floor(dist / 4))
      for (let i = 0; i <= steps; i++) {
        const px = lastPos.current.x + (dx * i) / steps
        const py = lastPos.current.y + (dy * i) / steps
        ctx.beginPath()
        ctx.arc(px * 2, py * 2, BRUSH_RADIUS * 2, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      ctx.beginPath()
      ctx.arc(x * 2, y * 2, BRUSH_RADIUS * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    lastPos.current = { x, y }

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let transparent = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++
    }
    const pct = transparent / (imageData.data.length / 4)
    setScratchPercent(pct)

    if (Math.random() > 0.6) addSparkle(x, y)

    if (pct >= SCRATCH_THRESHOLD && !revealed) {
      setRevealed(true)
    }
  }, [revealed, addSparkle])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
  }

  const handleStart = (e) => {
    e.preventDefault()
    if (revealed) return
    isDrawing.current = true
    lastPos.current = null
    setIsScratching(true)
    const { x, y } = getPos(e)
    scratch(x, y)
  }

  const handleMove = (e) => {
    e.preventDefault()
    if (!isDrawing.current || revealed) return
    const { x, y } = getPos(e)
    scratch(x, y)
  }

  const handleEnd = () => {
    isDrawing.current = false
    lastPos.current = null
    setIsScratching(false)
  }

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF0F5 0%, #FFF8F0 50%, #FFF0F5 100%)',
        padding: '80px 20px',
        minHeight: 'auto',
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
          Секрет
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: 400,
          color: 'var(--text-dark)',
          marginBottom: '16px',
        }}>
          Потри и узнай
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
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'relative',
          width: cardW,
          height: cardH,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: revealed
            ? '0 20px 60px rgba(232, 88, 122, 0.3), 0 0 40px rgba(212, 175, 55, 0.2)'
            : '0 10px 40px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.6s ease',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {/* Hidden content underneath */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 30%, #FFF8F0 60%, #FFF0F5 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '20px',
        }}>
          <motion.div
            animate={revealed ? { scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <HeartIcon size={mobile ? 40 : 48} color="#E8587A" />
          </motion.div>
          <motion.div
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: mobile ? 'clamp(1.4rem, 6vw, 1.8rem)' : '2rem',
              fontWeight: 700,
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, var(--rose-deep) 0%, var(--gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
            }}
          >
            {hiddenMessage}
          </motion.div>
          <motion.div
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: mobile ? '0.85rem' : '0.95rem',
              color: 'var(--text-light)',
              letterSpacing: '0.05em',
            }}
          >
            {hiddenSubtext}
          </motion.div>

          {/* Decorative corner ornaments */}
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              position: 'absolute',
              width: '30px',
              height: '30px',
              borderColor: 'var(--gold-light)',
              borderStyle: 'solid',
              borderWidth: 0,
              ...(i === 0 && { top: 16, left: 16, borderTopWidth: 1, borderLeftWidth: 1 }),
              ...(i === 1 && { top: 16, right: 16, borderTopWidth: 1, borderRightWidth: 1 }),
              ...(i === 2 && { bottom: 16, left: 16, borderBottomWidth: 1, borderLeftWidth: 1 }),
              ...(i === 3 && { bottom: 16, right: 16, borderBottomWidth: 1, borderRightWidth: 1 }),
              opacity: 0.5,
            }} />
          ))}
        </div>

        {/* Scratch canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            cursor: revealed ? 'default' : 'grab',
            opacity: revealed ? 0 : 1,
            transition: 'opacity 0.8s ease',
            pointerEvents: revealed ? 'none' : 'auto',
          }}
        />

        {/* Sparkles */}
        <AnimatePresence>
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                position: 'absolute',
                left: s.x - 6,
                top: s.y - 6,
                width: 12,
                height: 12,
                pointerEvents: 'none',
              }}
            >
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path
                  d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z"
                  fill="#D4AF37"
                />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Progress hint */}
      {!revealed && scratchPercent > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: '16px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-light)',
            textAlign: 'center',
          }}
        >
          {scratchPercent < 0.3 ? 'Продолжай...' : 'Почти готово!'}
        </motion.div>
      )}

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            marginTop: '20px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--rose-deep)',
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <SparkleIcon size={16} color="#D4AF37" /> Секрет раскрыт <SparkleIcon size={16} color="#D4AF37" />
          </span>
        </motion.div>
      )}
    </section>
  )
}
