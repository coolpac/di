import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

const BAR_COUNT = 32

export default function MusicVisualizer() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const canvasRef = useRef(null)
  const audioRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const animFrameRef = useRef(null)
  const audioCtxRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [heartScale, setHeartScale] = useState(1)
  const [loaded, setLoaded] = useState(false)

  const mobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    const audio = new Audio('/audio/pharaoh.mp3')
    audio.preload = 'metadata'
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setLoaded(true)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setProgress(0)
    })

    return () => {
      audio.pause()
      audio.src = ''
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (audioCtxRef.current) audioCtxRef.current.close()
    }
  }, [])

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    audioCtxRef.current = ctx
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.75
    analyserRef.current = analyser

    const source = ctx.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(ctx.destination)
    sourceRef.current = source
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(data)

    ctx.clearRect(0, 0, w, h)

    // Compute bass energy for heart pulse
    let bassEnergy = 0
    for (let i = 0; i < 8; i++) bassEnergy += data[i]
    bassEnergy /= 8
    const scale = 1 + (bassEnergy / 255) * 0.35
    setHeartScale(scale)

    const barW = (w / BAR_COUNT) * 0.7
    const gap = (w / BAR_COUNT) * 0.3
    const centerX = w / 2

    for (let i = 0; i < BAR_COUNT; i++) {
      const val = data[i % data.length] / 255
      const barH = Math.max(3, val * h * 0.75)

      // Mirror from center
      const offset = (i < BAR_COUNT / 2)
        ? centerX - (BAR_COUNT / 2 - i) * (barW + gap)
        : centerX + (i - BAR_COUNT / 2) * (barW + gap)

      // Gradient color based on frequency
      const hue = 340 + (i / BAR_COUNT) * 40 // rose to pink-gold
      const sat = 60 + val * 30
      const light = 55 + val * 20
      ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${0.6 + val * 0.4})`

      const y = (h - barH) / 2
      ctx.beginPath()
      ctx.roundRect(offset, y, barW, barH, barW / 2)
      ctx.fill()
    }

    // Update progress
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime / audioRef.current.duration || 0)
    }

    animFrameRef.current = requestAnimationFrame(draw)
  }, [])

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    initAudio()

    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume()
    }

    if (isPlaying) {
      audio.pause()
      cancelAnimationFrame(animFrameRef.current)
      setIsPlaying(false)
    } else {
      await audio.play()
      setIsPlaying(true)
      draw()
    }
  }, [isPlaying, initAudio, draw])

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    if (audioRef.current && duration) {
      audioRef.current.currentTime = pct * duration
      setProgress(pct)
    }
  }

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const canvasW = mobile ? Math.min(360, window.innerWidth - 40) : 500
  const canvasH = mobile ? 120 : 160

  // SVG heart path
  const heartPath = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF0F5 0%, #2C1810 30%, #1a0f0a 70%, #FFF0F5 100%)',
        padding: '80px 20px',
        minHeight: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      {isPlaying && (
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(232, 88, 122, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 2 }}
      >
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '16px',
        }}>
          Наша песня
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: 400,
          color: '#FFF8F0',
          marginBottom: '8px',
        }}>
          PHARAOH
        </h2>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          color: 'var(--rose)',
          marginBottom: '16px',
        }}>
          Одним целым
        </div>
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
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          maxWidth: mobile ? '100%' : '520px',
          width: '100%',
        }}
      >
        {/* Heart + Visualizer */}
        <div style={{ position: 'relative', width: canvasW, height: canvasH + 80 }}>
          {/* Pulsing heart behind canvas */}
          <motion.div
            animate={{ scale: heartScale }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <svg
              width={mobile ? 60 : 80}
              height={mobile ? 60 : 80}
              viewBox="0 0 24 24"
              style={{ filter: 'drop-shadow(0 0 20px rgba(232, 88, 122, 0.5))' }}
            >
              <path d={heartPath} fill="var(--rose-deep)" opacity="0.3" />
            </svg>
          </motion.div>

          {/* Canvas for bars */}
          <canvas
            ref={canvasRef}
            width={canvasW * 2}
            height={(canvasH + 80) * 2}
            style={{
              width: canvasW,
              height: canvasH + 80,
              position: 'relative',
              zIndex: 2,
            }}
          />
        </div>

        {/* Play button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          disabled={!loaded}
          style={{
            width: mobile ? 60 : 70,
            height: mobile ? 60 : 70,
            borderRadius: '50%',
            border: '2px solid var(--rose)',
            background: isPlaying
              ? 'rgba(232, 88, 122, 0.15)'
              : 'linear-gradient(135deg, var(--rose-deep), var(--rose))',
            cursor: loaded ? 'pointer' : 'wait',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isPlaying
              ? '0 0 30px rgba(232, 88, 122, 0.3)'
              : '0 8px 24px rgba(232, 88, 122, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          {isPlaying ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFF8F0">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFF8F0">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>

        {/* Progress bar */}
        <div style={{ width: '100%', maxWidth: canvasW }}>
          <div
            onClick={handleSeek}
            onTouchStart={handleSeek}
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 248, 240, 0.15)',
              borderRadius: '3px',
              cursor: 'pointer',
              position: 'relative',
              touchAction: 'none',
            }}
          >
            <motion.div
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--rose-deep), var(--gold))',
                borderRadius: '3px',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                right: -4,
                top: -3,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--gold)',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)',
              }} />
            </motion.div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            color: 'rgba(255, 248, 240, 0.5)',
          }}>
            <span>{formatTime(progress * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
