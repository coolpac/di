import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const reasons = [
  'За твою улыбку, от которой всё вокруг светлеет',
  'За то, как ты смеёшься — громко и заразительно',
  'За твои глаза, в которых я тону каждый раз',
  'За то, как ты обнимаешь — крепко, будто навсегда',
  'За твою доброту ко всему живому',
  'За то, как ты заботишься о наших пушистых',
  'За твоё тепло, которое чувствую даже на расстоянии',
  'За то, как ты танцуешь, когда думаешь что никто не видит',
  'За твою силу — ты сильнее, чем думаешь',
  'За то, как ты засыпаешь у меня на плече',
  'За каждое "доброе утро" в наших переписках',
  'За то, что ты делаешь мой мир красивее',
  'За твой характер — огонь, который меня зажигает',
  'За наши разговоры до утра',
  'За то, что ты — это ты, и я люблю тебя такой',
]

function TypewriterLine({ text, index, isActive, isComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    if (!isActive) return
    setShowCursor(true)
    let i = 0
    setDisplayed('')

    const speed = 35 + Math.random() * 20
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setTimeout(() => setShowCursor(false), 400)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [isActive, text])

  if (!isActive && !isComplete) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        marginBottom: '14px',
      }}
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        style={{
          color: 'var(--rose-deep)',
          fontSize: '1.1rem',
          lineHeight: '1.7',
          flexShrink: 0,
        }}
      >
        ♥
      </motion.span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.95rem',
        color: isComplete ? 'var(--text-medium)' : 'var(--text-dark)',
        lineHeight: 1.7,
        transition: 'color 0.5s ease',
      }}>
        {isComplete ? text : displayed}
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ color: 'var(--rose-deep)', fontWeight: 300 }}
          >
            |
          </motion.span>
        )}
      </span>
    </motion.div>
  )
}

export default function TypewriterLove() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [completedLines, setCompletedLines] = useState(new Set())

  useEffect(() => {
    if (!isInView) return
    // Start the first line after a small delay
    const timer = setTimeout(() => setCurrentIndex(0), 800)
    return () => clearTimeout(timer)
  }, [isInView])

  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= reasons.length) return

    const lineLength = reasons[currentIndex].length
    const typingTime = lineLength * 45 + 600

    const timer = setTimeout(() => {
      setCompletedLines(prev => new Set([...prev, currentIndex]))
      if (currentIndex < reasons.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 300)
      }
    }, typingTime)

    return () => clearTimeout(timer)
  }, [currentIndex])

  const allDone = completedLines.size === reasons.length
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF0F5 50%, #FFF8F0 100%)',
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
          Признание
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: 400,
          color: 'var(--text-dark)',
          marginBottom: '16px',
        }}>
          За что я тебя люблю
        </h2>
        <div style={{
          width: '40px',
          height: '1px',
          background: 'var(--gold)',
          margin: '0 auto',
        }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          maxWidth: mobile ? '100%' : '600px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: mobile ? '28px 20px' : '40px 36px',
          border: '1px solid rgba(244, 160, 181, 0.2)',
          boxShadow: '0 8px 32px rgba(232, 88, 122, 0.08)',
        }}
      >
        {reasons.map((reason, i) => (
          <TypewriterLine
            key={i}
            text={reason}
            index={i}
            isActive={currentIndex === i}
            isComplete={completedLines.has(i)}
          />
        ))}

        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              textAlign: 'center',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(244, 160, 181, 0.2)',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '1.3rem',
              color: 'var(--rose-deep)',
            }}>
              ...и за миллион других причин
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ fontSize: '1.5rem', marginTop: '12px' }}
            >
              ❤️
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
