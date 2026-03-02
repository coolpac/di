import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const GAME_DURATION = 35
const BASE_SPAWN_RATE = 55 // frames between spawns (decreases over time)

const FLOWER_TYPES = [
  { id: 'white-rose', good: true, points: 1, speed: 2.2, size: 38 },
  { id: 'pink-rose', good: true, points: 2, speed: 2.8, size: 34 },
  { id: 'tulip', good: false, points: -2, speed: 3, size: 36 },
  { id: 'weed', good: false, points: -3, speed: 3.5, size: 30 },
]

// Draw beautiful flowers using Canvas
function drawFlower(ctx, x, y, size, type, glow) {
  ctx.save()
  ctx.translate(x, y)

  if (glow) {
    ctx.shadowColor = type.good ? 'rgba(255,200,220,0.8)' : 'rgba(255,80,80,0.5)'
    ctx.shadowBlur = 15
  }

  // Stem
  ctx.beginPath()
  ctx.moveTo(0, size * 0.2)
  ctx.quadraticCurveTo(2, size * 0.5, 0, size * 0.7)
  ctx.strokeStyle = '#3a7d20'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.stroke()

  // Leaf
  ctx.beginPath()
  ctx.moveTo(0, size * 0.45)
  ctx.quadraticCurveTo(-size * 0.25, size * 0.35, -size * 0.15, size * 0.25)
  ctx.quadraticCurveTo(-size * 0.05, size * 0.35, 0, size * 0.45)
  ctx.fillStyle = '#4a9e28'
  ctx.fill()

  if (type.id === 'white-rose') {
    // Gorgeous white rose with layered petals
    const petalLayers = [
      { count: 7, r: size * 0.38, w: size * 0.2, color: '#fff5f8' },
      { count: 5, r: size * 0.25, w: size * 0.17, color: '#ffffff' },
      { count: 3, r: size * 0.12, w: size * 0.12, color: '#fff8fa' },
    ]
    petalLayers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 - Math.PI / 2
        ctx.save()
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.ellipse(0, -layer.r, layer.w, layer.r * 0.7, 0, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(0, -layer.r, 0, 0, -layer.r, layer.r * 0.7)
        g.addColorStop(0, '#ffffff')
        g.addColorStop(0.7, layer.color)
        g.addColorStop(1, '#ffe8ef')
        ctx.fillStyle = g
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,200,215,0.3)'
        ctx.lineWidth = 0.5
        ctx.stroke()
        ctx.restore()
      }
    })
    // Center
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.07, 0, Math.PI * 2)
    ctx.fillStyle = '#fffaf0'
    ctx.fill()
  } else if (type.id === 'pink-rose') {
    // Pink rose
    const petalLayers = [
      { count: 6, r: size * 0.35, w: size * 0.18, color: '#ffb6c8' },
      { count: 4, r: size * 0.22, w: size * 0.14, color: '#ffc8d8' },
    ]
    petalLayers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2
        ctx.save()
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.ellipse(0, -layer.r, layer.w, layer.r * 0.65, 0, 0, Math.PI * 2)
        ctx.fillStyle = layer.color
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,150,180,0.3)'
        ctx.lineWidth = 0.5
        ctx.stroke()
        ctx.restore()
      }
    })
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.06, 0, Math.PI * 2)
    ctx.fillStyle = '#ff8ab0'
    ctx.fill()
  } else if (type.id === 'tulip') {
    // Red tulip
    const colors = ['#ff4444', '#ff6666', '#cc2222']
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI - Math.PI / 2
      ctx.save()
      ctx.rotate(angle * 0.6)
      ctx.beginPath()
      ctx.ellipse(0, -size * 0.2, size * 0.12, size * 0.28, 0, 0, Math.PI * 2)
      ctx.fillStyle = colors[i % 3]
      ctx.fill()
      ctx.restore()
    }
  } else {
    // Weed/thistle - spiky
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 1.5
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const len = size * 0.25 + Math.random() * size * 0.1
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len - size * 0.1)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(0, -size * 0.05, size * 0.08, 0, Math.PI * 2)
    ctx.fillStyle = '#8b6db8'
    ctx.fill()
  }

  ctx.restore()
}

// Draw the vase
function drawVase(ctx, x, y, w, h, glowing) {
  ctx.save()
  ctx.translate(x, y)

  if (glowing) {
    ctx.shadowColor = 'rgba(212, 175, 55, 0.6)'
    ctx.shadowBlur = 25
  }

  // Vase body
  ctx.beginPath()
  ctx.moveTo(-w * 0.35, 0)
  ctx.quadraticCurveTo(-w * 0.5, -h * 0.5, -w * 0.3, -h * 0.85)
  ctx.lineTo(-w * 0.2, -h)
  ctx.lineTo(w * 0.2, -h)
  ctx.lineTo(w * 0.3, -h * 0.85)
  ctx.quadraticCurveTo(w * 0.5, -h * 0.5, w * 0.35, 0)
  ctx.closePath()

  const vaseGrad = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0)
  vaseGrad.addColorStop(0, '#f0d0da')
  vaseGrad.addColorStop(0.3, '#fff0f5')
  vaseGrad.addColorStop(0.7, '#fff0f5')
  vaseGrad.addColorStop(1, '#e8b0c0')
  ctx.fillStyle = vaseGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(200,150,170,0.5)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Vase rim
  ctx.beginPath()
  ctx.ellipse(0, -h, w * 0.22, h * 0.06, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#ffe0ea'
  ctx.fill()
  ctx.strokeStyle = 'rgba(200,150,170,0.4)'
  ctx.stroke()

  // Gold band
  ctx.beginPath()
  ctx.moveTo(-w * 0.42, -h * 0.3)
  ctx.quadraticCurveTo(0, -h * 0.25, w * 0.42, -h * 0.3)
  ctx.strokeStyle = 'rgba(212,175,55,0.5)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.restore()
}

// Particle system
class Particle {
  constructor(x, y, color, speed, life, size) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * speed
    this.vy = -Math.random() * speed * 1.5 - 1
    this.life = life
    this.maxLife = life
    this.color = color
    this.size = size || 3
    this.gravity = 0.05
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.gravity
    this.life--
  }
  draw(ctx) {
    const alpha = this.life / this.maxLife
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
  }
}

// Sparkle text effect
class FloatingText {
  constructor(x, y, text, color, size) {
    this.x = x
    this.y = y
    this.text = text
    this.color = color
    this.size = size || 20
    this.life = 60
    this.maxLife = 60
    this.vy = -1.5
  }
  update() {
    this.y += this.vy
    this.vy *= 0.97
    this.life--
  }
  draw(ctx) {
    const alpha = this.life / this.maxLife
    const scale = 1 + (1 - alpha) * 0.3
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.font = `bold ${this.size * scale}px 'Playfair Display', serif`
    ctx.fillStyle = this.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.text, this.x, this.y)
    ctx.restore()
  }
}

function GameCanvas({ onComplete }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    vaseX: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    flowers: [],
    particles: [],
    texts: [],
    collected: 0,
    missed: 0,
    frame: 0,
    timeLeft: GAME_DURATION,
    gameOver: false,
    gameStarted: false,
    shakeAmount: 0,
    glowVase: 0,
    lastSpawn: 0,
  })
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const animRef = useRef(null)
  const timerRef = useRef(null)

  const getCanvasScale = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return { sx: 1, sy: 1 }
    const rect = canvas.getBoundingClientRect()
    return { sx: canvas.width / rect.width, sy: canvas.height / rect.height }
  }, [])

  const handleMove = useCallback((clientX) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const { sx } = getCanvasScale()
    stateRef.current.vaseX = (clientX - rect.left) * sx
  }, [getCanvasScale])

  const handleMouseMove = useCallback((e) => handleMove(e.clientX), [handleMove])
  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }, [handleMove])

  const spawnFlower = useCallback((w) => {
    const s = stateRef.current
    const difficulty = 1 - s.timeLeft / GAME_DURATION // 0 to 1
    const isGood = Math.random() < (0.55 - difficulty * 0.15)
    const goodTypes = FLOWER_TYPES.filter(f => f.good)
    const badTypes = FLOWER_TYPES.filter(f => !f.good)
    const type = isGood
      ? goodTypes[Math.floor(Math.random() * goodTypes.length)]
      : badTypes[Math.floor(Math.random() * badTypes.length)]

    const speedMult = 1 + difficulty * 0.6
    s.flowers.push({
      x: 40 + Math.random() * (w - 80),
      y: -50,
      type,
      speed: type.speed * speedMult * (0.8 + Math.random() * 0.4),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
      rotation: (Math.random() - 0.5) * 0.3,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      size: type.size + Math.random() * 8,
    })
  }, [])

  const startGame = useCallback(() => {
    const s = stateRef.current
    s.score = 0
    s.combo = 0
    s.maxCombo = 0
    s.flowers = []
    s.particles = []
    s.texts = []
    s.collected = 0
    s.missed = 0
    s.frame = 0
    s.timeLeft = GAME_DURATION
    s.gameOver = false
    s.gameStarted = true
    s.shakeAmount = 0
    s.glowVase = 0
    s.lastSpawn = 0

    setScore(0)
    setCombo(0)
    setTimeLeft(GAME_DURATION)
    setGameStarted(true)
    setGameOver(false)

    timerRef.current = setInterval(() => {
      s.timeLeft -= 1
      setTimeLeft(s.timeLeft)
      if (s.timeLeft <= 0) {
        clearInterval(timerRef.current)
        s.gameOver = true
        setGameOver(true)
        setFinalScore(s.score)
        onComplete?.(s.score)
      }
    }, 1000)
  }, [onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    function resize() {
      const parent = canvas.parentElement
      const w = parent.getBoundingClientRect().width
      const h = 450
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stateRef.current.vaseX = w / 2
    }
    resize()
    window.addEventListener('resize', resize)

    function animate() {
      const s = stateRef.current
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      // Shake
      ctx.save()
      if (s.shakeAmount > 0) {
        ctx.translate(
          (Math.random() - 0.5) * s.shakeAmount,
          (Math.random() - 0.5) * s.shakeAmount
        )
        s.shakeAmount *= 0.9
        if (s.shakeAmount < 0.3) s.shakeAmount = 0
      }

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
      bgGrad.addColorStop(0, '#fff8f0')
      bgGrad.addColorStop(0.6, '#fff0f5')
      bgGrad.addColorStop(1, '#ffe8ef')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w, h)

      // Ground line
      ctx.beginPath()
      ctx.moveTo(0, h - 15)
      ctx.lineTo(w, h - 15)
      ctx.strokeStyle = 'rgba(200,160,170,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      if (s.gameStarted && !s.gameOver) {
        s.frame++

        // Spawn flowers
        const spawnRate = Math.max(20, BASE_SPAWN_RATE - s.frame * 0.03)
        if (s.frame - s.lastSpawn > spawnRate) {
          spawnFlower(w)
          s.lastSpawn = s.frame
          // Bonus spawn at higher difficulty
          if (s.frame > 300 && Math.random() < 0.3) spawnFlower(w)
        }

        // Vase dimensions
        const vaseW = 70
        const vaseH = 55
        const vaseY = h - 20
        const vX = Math.max(vaseW * 0.5, Math.min(w - vaseW * 0.5, s.vaseX))

        // Update & draw flowers
        s.flowers = s.flowers.filter(f => {
          f.wobble += f.wobbleSpeed
          f.rotation += f.rotSpeed
          f.y += f.speed
          f.x += Math.sin(f.wobble) * 1.2

          // Check if caught by vase
          if (f.y > vaseY - vaseH && f.y < vaseY &&
              f.x > vX - vaseW * 0.45 && f.x < vX + vaseW * 0.45) {
            if (f.type.good) {
              s.score += f.type.points * (1 + Math.floor(s.combo / 3))
              s.combo++
              s.maxCombo = Math.max(s.maxCombo, s.combo)
              s.collected++
              s.glowVase = 15
              setScore(s.score)
              setCombo(s.combo)

              // Particles burst
              const colors = ['#FFD700', '#FF69B4', '#FFF0F5', '#FF1493', '#FFFFFF']
              for (let i = 0; i < 12; i++) {
                s.particles.push(new Particle(f.x, f.y, colors[Math.floor(Math.random() * colors.length)], 4, 40, 2 + Math.random() * 3))
              }

              // Score text
              const bonus = 1 + Math.floor(s.combo / 3)
              const label = bonus > 1 ? `+${f.type.points * bonus}` : `+${f.type.points}`
              s.texts.push(new FloatingText(f.x, f.y - 20, label, '#2d5016', 18))

              // Combo text
              if (s.combo > 0 && s.combo % 5 === 0) {
                s.texts.push(new FloatingText(w / 2, h / 2, `COMBO x${s.combo}!`, '#D4AF37', 32))
                s.shakeAmount = 8
                for (let i = 0; i < 25; i++) {
                  s.particles.push(new Particle(w / 2 + (Math.random() - 0.5) * 200, h / 2, '#FFD700', 6, 50, 3))
                }
              }
            } else {
              s.combo = 0
              s.score = Math.max(0, s.score + f.type.points)
              s.shakeAmount = 6
              setScore(s.score)
              setCombo(0)

              // Bad particles
              for (let i = 0; i < 8; i++) {
                s.particles.push(new Particle(f.x, f.y, '#ff4444', 3, 30, 2))
              }
              s.texts.push(new FloatingText(f.x, f.y - 20, f.type.points.toString(), '#e8587a', 20))
            }
            return false
          }

          // Fell off screen
          if (f.y > h + 30) {
            if (f.type.good) {
              s.missed++
              s.combo = 0
              setCombo(0)
            }
            return false
          }

          // Draw flower
          ctx.save()
          ctx.translate(f.x, f.y)
          ctx.rotate(f.rotation)
          ctx.translate(-f.x, -f.y)
          drawFlower(ctx, f.x, f.y, f.size, f.type, false)
          ctx.restore()
          return true
        })

        // Glow decay
        if (s.glowVase > 0) s.glowVase--

        // Draw vase
        drawVase(ctx, vX, vaseY, vaseW, vaseH, s.glowVase > 0)

        // Collected roses in vase (small visual)
        const rosesInVase = Math.min(s.collected, 7)
        for (let i = 0; i < rosesInVase; i++) {
          const rx = vX + (i - rosesInVase / 2) * 8
          const ry = vaseY - vaseH - 5 - i * 3
          ctx.beginPath()
          ctx.arc(rx, ry, 4, 0, Math.PI * 2)
          ctx.fillStyle = i % 2 === 0 ? '#fff0f5' : '#ffb6c8'
          ctx.fill()
          ctx.strokeStyle = 'rgba(255,200,215,0.5)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Update & draw particles
      s.particles = s.particles.filter(p => {
        p.update()
        if (p.life <= 0) return false
        p.draw(ctx)
        return true
      })

      // Update & draw floating texts
      s.texts = s.texts.filter(t => {
        t.update()
        if (t.life <= 0) return false
        t.draw(ctx)
        return true
      })

      ctx.restore()
      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      clearInterval(timerRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [spawnFlower])

  // Timer bar color
  const timerRatio = timeLeft / GAME_DURATION
  const timerColor = timerRatio > 0.3 ? `hsl(${timerRatio * 120}, 70%, 60%)` : '#e8587a'

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '650px' }}>
      {/* HUD */}
      {gameStarted && !gameOver && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          padding: '0 4px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-dark)' }}>
            <span style={{ color: 'var(--rose-deep)', fontWeight: 700, fontSize: '1.4rem' }}>{score}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginLeft: '8px' }}>
              {'\u{1F339}'} {stateRef.current.collected}
            </span>
          </div>
          {combo >= 3 && (
            <motion.div
              key={combo}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--gold)',
              }}
            >
              COMBO x{combo}!
            </motion.div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '80px', height: '6px', borderRadius: '3px',
              background: 'rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${timerRatio * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{ height: '100%', borderRadius: '3px', background: timerColor }}
              />
            </div>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: timeLeft <= 10 ? 'var(--rose-deep)' : 'var(--text-medium)',
              fontWeight: timeLeft <= 10 ? 700 : 400,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {timeLeft}s
            </span>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div style={{
        borderRadius: '20px', overflow: 'hidden',
        border: '2px solid var(--rose-light)',
        position: 'relative',
        touchAction: 'none',
      }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          style={{ width: '100%', height: '450px', cursor: gameStarted && !gameOver ? 'none' : 'default', display: 'block' }}
        />

        {/* Start overlay */}
        <AnimatePresence>
          {!gameStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,248,240,0.97)', backdropFilter: 'blur(6px)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                style={{ fontSize: '3.5rem', marginBottom: '20px' }}
              >
                {'\u{1F490}'}
              </motion.div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-dark)', marginBottom: '10px' }}>
                Собери букет
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-medium)',
                textAlign: 'center', maxWidth: '320px', lineHeight: 1.7, marginBottom: '20px',
              }}>
                Двигай вазу мышкой и лови белые и розовые розы!
                <br /><span style={{ color: 'var(--rose-deep)' }}>Избегай тюльпанов и сорняков.</span>
              </p>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px',
                marginBottom: '28px', fontSize: '0.85rem', color: 'var(--text-medium)',
              }}>
                <span>{'\u{1F339}'} Белая роза: <strong style={{ color: '#2d5016' }}>+1</strong></span>
                <span>{'\u{1F33A}'} Розовая роза: <strong style={{ color: '#2d5016' }}>+2</strong></span>
                <span>{'\u{1F337}'} Тюльпан: <strong style={{ color: '#e8587a' }}>-2</strong></span>
                <span>{'\u{1F33F}'} Сорняк: <strong style={{ color: '#e8587a' }}>-3</strong></span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '20px' }}>
                Собирай комбо для множителя очков!
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(232,88,122,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.15rem',
                  padding: '16px 48px', border: 'none', borderRadius: '50px',
                  background: 'linear-gradient(135deg, var(--rose-deep), var(--rose))',
                  color: 'white', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(232,88,122,0.3)',
                }}
              >
                Играть!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game over overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,248,240,0.97)', backdropFilter: 'blur(8px)',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                style={{ fontSize: '4rem', marginBottom: '12px' }}
              >
                {finalScore >= 30 ? '\u{1F389}' : finalScore >= 15 ? '\u{1F490}' : '\u{1F339}'}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '6px' }}
              >
                {finalScore >= 30 ? 'Невероятный букет!' : finalScore >= 15 ? 'Шикарный букет!' : finalScore >= 5 ? 'Красивый букет!' : 'Милый букетик!'}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ textAlign: 'center', marginBottom: '20px' }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--rose-deep), var(--gold))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {finalScore}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px' }}>
                  {'\u{1F339}'} {stateRef.current.collected} собрано | Макс. комбо: {stateRef.current.maxCombo}
                </div>
              </motion.div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: '1rem',
                  padding: '12px 36px', border: '2px solid var(--rose)',
                  borderRadius: '50px', background: 'transparent',
                  color: 'var(--rose-deep)', cursor: 'pointer',
                }}
              >
                Ещё раз!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {gameStarted && !gameOver && (
        <div style={{
          textAlign: 'center', marginTop: '8px',
          fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-light)',
        }}>
          Двигай мышкой / пальцем чтобы ловить цветы
        </div>
      )}
    </div>
  )
}

export default function BouquetGame({ onComplete }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 50%, #FFF8F0 100%)',
        padding: '80px 20px',
      }}
    >
      <div ref={ref} style={{ maxWidth: '700px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px',
          }}>
            Мини-игра
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 400, color: 'var(--text-dark)', marginBottom: '16px',
          }}>
            Собери букет для Дианы
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <GameCanvas onComplete={onComplete} />
        </motion.div>
      </div>
    </section>
  )
}
