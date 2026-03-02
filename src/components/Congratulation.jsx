import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import useMobile from '../hooks/useMobile'

const sentences = [
  'Дорогая Диана, в этот прекрасный весенний день хочу сказать тебе, как много ты значишь для меня.',
  'Ты — мой свет, моя радость, моё вдохновение.',
  'Пусть каждый день приносит тебе улыбки, а жизнь будет полна любви, тепла и самых ярких моментов.',
  'Ты заслуживаешь всего самого лучшего в этом мире!',
]

function AnimatedRose({ isInView, isMobile }) {
  if (isMobile) {
    // Simpler static rose on mobile — no motion.path animations
    return (
      <motion.svg
        width="120"
        height="170"
        viewBox="0 0 200 280"
        style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, zIndex: 0 }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.1 } : {}}
        transition={{ duration: 1 }}
      >
        <path d="M100 120 Q95 160, 100 200 Q105 230, 100 270" stroke="#4A7C2E" strokeWidth="3" fill="none" />
        <path d="M100 180 Q75 165, 60 145 Q80 160, 100 180" fill="#4A7C2E" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <ellipse key={angle} cx="100" cy="90" rx="20" ry="35"
            fill={i % 2 === 0 ? '#FFF0F5' : '#FFFFFF'} stroke="#FFE4EC" strokeWidth="0.5"
            transform={`rotate(${angle}, 100, 90)`} opacity="0.8" />
        ))}
        <circle cx="100" cy="85" r="12" fill="#FFF8F0" />
      </motion.svg>
    )
  }

  return (
    <motion.svg
      width="200"
      height="280"
      viewBox="0 0 200 280"
      style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.15, zIndex: 0 }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 0.15 } : {}}
      transition={{ duration: 2 }}
    >
      <motion.path d="M100 120 Q95 160, 100 200 Q105 230, 100 270"
        stroke="#4A7C2E" strokeWidth="3" fill="none"
        initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 2, delay: 0.5 }} />
      <motion.path d="M100 180 Q75 165, 60 145 Q80 160, 100 180"
        fill="#4A7C2E" initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.8 }} style={{ transformOrigin: '100px 180px' }} />
      <motion.path d="M100 210 Q125 195, 140 175 Q120 195, 100 210"
        fill="#4A7C2E" initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }} style={{ transformOrigin: '100px 210px' }} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.ellipse key={angle} cx="100" cy="90" rx="20" ry="35"
          fill={i % 2 === 0 ? '#FFF0F5' : '#FFFFFF'} stroke="#FFE4EC" strokeWidth="0.5"
          transform={`rotate(${angle}, 100, 90)`}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 0.8 } : {}}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
          style={{ transformOrigin: '100px 90px' }} />
      ))}
      <motion.circle cx="100" cy="85" r="12" fill="#FFF8F0"
        initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.5 }} style={{ transformOrigin: '100px 85px' }} />
    </motion.svg>
  )
}

export default function Congratulation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isMobile = useMobile()

  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFE4EC 0%, #FFF0F5 30%, #FFF8F0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div ref={ref} style={{
        maxWidth: '700px', position: 'relative', zIndex: 2,
        textAlign: 'center', padding: '0 20px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '40px' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '12px',
          }}>Поздравление</div>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto' }} />
        </motion.div>

        {/* Animate by sentence instead of per-word — much fewer motion elements */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
          lineHeight: 1.8,
          color: 'var(--text-medium)',
          fontWeight: 400,
        }}>
          {sentences.map((sentence, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.4 + i * 0.5,
                duration: 0.7,
                ease: 'easeOut',
              }}
              style={{ marginBottom: '0.5em' }}
            >
              {sentence}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2.5, duration: 0.8 }}
          style={{
            marginTop: '40px', fontFamily: 'var(--font-display)',
            fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--rose-deep)',
          }}
        >
          с нежностью и любовью...
        </motion.div>
      </div>

      <AnimatedRose isInView={isInView} isMobile={isMobile} />
    </section>
  )
}
