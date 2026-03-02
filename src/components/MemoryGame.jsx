import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const PHOTO_PAIRS = [
  { src: '/photos/diana-9.jpeg', label: 'Красотка' },
  { src: '/photos/diana-12.jpeg', label: 'Сладкоежка' },
  { src: '/photos/diana-16.jpeg', label: 'Butterfly' },
  { src: '/photos/diana-21.jpeg', label: 'Гррр' },
  { src: '/photos/diana-5.jpeg', label: 'Милашка' },
  { src: '/photos/diana-15.jpeg', label: 'Настроение' },
  { src: '/photos/diana-1.jpeg', label: 'Стиль' },
  { src: '/photos/diana-2.jpeg', label: 'Уютная' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createCards(pairCount) {
  const pairs = PHOTO_PAIRS.slice(0, pairCount)
  const cards = pairs.flatMap((p, i) => [
    { id: i * 2, pairId: i, ...p },
    { id: i * 2 + 1, pairId: i, ...p },
  ])
  return shuffle(cards)
}

function preloadImages(srcs) {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = resolve
          img.src = src
        })
    )
  )
}

const cardBackStyle = {
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  borderRadius: '14px',
  background: 'linear-gradient(145deg, rgba(244, 160, 181, 0.85) 0%, rgba(232, 88, 122, 0.9) 50%, rgba(212, 70, 122, 0.95) 100%)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px solid rgba(255, 255, 255, 0.35)',
  boxShadow: '0 4px 15px rgba(232, 88, 122, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  transform: 'translateZ(1px)',
}

const cardBackInnerStyle = {
  width: '55%',
  height: '55%',
  borderRadius: '12px',
  border: '1.5px solid rgba(255, 255, 255, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.1)',
}

function GameCard({ card, isFlipped, isMatched, onClick, index }) {
  const [justMatched, setJustMatched] = useState(false)

  useEffect(() => {
    if (isMatched) {
      setJustMatched(true)
      const t = setTimeout(() => setJustMatched(false), 800)
      return () => clearTimeout(t)
    }
  }, [isMatched])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{
        perspective: '1000px',
        cursor: isMatched ? 'default' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      whileTap={!isMatched ? { scale: 0.95 } : undefined}
    >
      <motion.div
        animate={{
          rotateY: isFlipped || isMatched ? 180 : 0,
          scale: justMatched ? [1, 1.08, 1] : 1,
        }}
        transition={{
          rotateY: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          scale: { duration: 0.5, delay: 0.2 },
        }}
        style={{
          width: '100%',
          aspectRatio: '3/4',
          position: 'relative',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Back face (visible by default) */}
        <div style={cardBackStyle}>
          <div style={cardBackInnerStyle}>
            <span style={{ fontSize: '1.3rem', opacity: 0.7 }}>{'\u{1F490}'}</span>
          </div>
        </div>

        {/* Front face (photo) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
            borderRadius: '14px',
            overflow: 'hidden',
            border: isMatched
              ? '2.5px solid rgba(232, 88, 122, 0.6)'
              : '1.5px solid rgba(255, 255, 255, 0.5)',
            boxShadow: isMatched
              ? '0 4px 20px rgba(232, 88, 122, 0.35)'
              : '0 4px 15px rgba(0, 0, 0, 0.08)',
          }}
        >
          <img
            src={card.src}
            alt={card.label}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
          {/* Photo label overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px 8px 6px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '0.65rem',
                color: '#fff',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
            >
              {card.label}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Match sparkle */}
      {justMatched && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.8, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            fontSize: '2rem',
          }}
        >
          {'\u2728'}
        </motion.div>
      )}
    </motion.div>
  )
}

function WinCelebration({ moves, onReset }) {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    size: Math.random() * 14 + 12,
    emoji: ['\u2764\uFE0F', '\u{1F339}', '\u2728', '\u{1F33A}', '\u{1F497}', '\u{1F48B}', '\u{1F31F}'][i % 7],
  }))

  let rating = '\u2B50\u2B50\u2B50'
  let ratingText = 'Идеально!'
  if (moves > 12) {
    rating = '\u2B50\u2B50'
    ratingText = 'Отлично!'
  }
  if (moves > 18) {
    rating = '\u2B50'
    ratingText = 'Хорошо!'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        textAlign: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {particles.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -250, opacity: 0 }}
          transition={{ duration: 2.5, delay: h.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: `${h.x}%`,
            bottom: 0,
            fontSize: `${h.size}px`,
            pointerEvents: 'none',
          }}
        >
          {h.emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 150, delay: 0.2 }}
        style={{ fontSize: '2.5rem', marginBottom: '12px' }}
      >
        {'\u{1F389}'}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
          fontWeight: 400,
          color: 'var(--text-dark)',
          marginBottom: '8px',
        }}
      >
        Все пары найдены!
      </motion.h3>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ fontSize: '1.8rem', marginBottom: '4px' }}
      >
        {rating}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'var(--text-light)',
          marginBottom: '24px',
        }}
      >
        {ratingText + ' ' + moves + ' ходов \u{1F496}'}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={onReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          padding: '12px 32px',
          border: 'none',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, var(--rose-deep), #FF69B4)',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(232, 88, 122, 0.3)',
        }}
      >
        {'\u{1F504}'} Играть ещё
      </motion.button>
    </motion.div>
  )
}

export default function MemoryGame({ onComplete }) {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const pairCount = mobile ? 6 : 8
  const columns = mobile ? 3 : 4

  const [cards, setCards] = useState(() => createCards(pairCount))
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [imagesReady, setImagesReady] = useState(false)

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  // Preload all card images
  useEffect(() => {
    const srcs = PHOTO_PAIRS.slice(0, pairCount).map((p) => p.src)
    preloadImages(srcs).then(() => setImagesReady(true))
  }, [pairCount])

  const resetGame = useCallback(() => {
    setCards(createCards(pairCount))
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLocked(false)
    setGameWon(false)
    setGameStarted(true)
  }, [pairCount])

  useEffect(() => {
    if (matched.size === pairCount && gameStarted) {
      setTimeout(() => {
        setGameWon(true)
        onComplete?.()
      }, 600)
    }
  }, [matched.size, pairCount, gameStarted, onComplete])

  function handleCardClick(card) {
    if (locked || flipped.includes(card.id) || matched.has(card.pairId)) return
    if (!gameStarted) setGameStarted(true)

    const next = [...flipped, card.id]
    setFlipped(next)

    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [firstId, secondId] = next
      const first = cards.find((c) => c.id === firstId)
      const second = cards.find((c) => c.id === secondId)

      if (first.pairId === second.pairId) {
        setTimeout(() => {
          setMatched((prev) => new Set([...prev, first.pairId]))
          setFlipped([])
        }, 400)
      } else {
        setLocked(true)
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    }
  }

  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF0F5 0%, #FFF8F0 50%, #FFF0F5 100%)',
        padding: '80px 20px',
        minHeight: 'auto',
      }}
    >
      <div ref={sectionRef} style={{ maxWidth: '520px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '30px' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '16px',
            }}
          >
            Мини-игра
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 400,
              color: 'var(--text-dark)',
              marginBottom: '12px',
            }}
          >
            Найди пары
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'var(--text-light)',
              marginBottom: '8px',
            }}
          >
            Переверни карточки и найди одинаковые фото
          </p>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto' }} />
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: mobile ? '16px' : '24px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
            {'\u{1F3AF}'} Ходов: <strong>{moves}</strong>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
            {'\u2764\uFE0F'} Пар: <strong>{matched.size}</strong> / {pairCount}
          </div>
          {gameStarted && !gameWon && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={resetGame}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'var(--rose-deep)',
                background: 'none',
                border: '1px solid var(--rose)',
                borderRadius: '20px',
                padding: '4px 14px',
                cursor: 'pointer',
              }}
            >
              {'\u{1F504}'} Заново
            </motion.button>
          )}
        </motion.div>

        {/* Card grid or loading or win */}
        <AnimatePresence mode="wait">
          {!imagesReady ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                padding: '60px 0',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-light)',
                fontSize: '0.9rem',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: '2rem', marginBottom: '12px', display: 'inline-block' }}
              >
                {'\u{1F338}'}
              </motion.div>
              <div>Загружаем фоточки...</div>
            </motion.div>
          ) : gameWon ? (
            <WinCelebration key="win" moves={moves} onReset={resetGame} />
          ) : (
            <motion.div
              key="game"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: mobile ? '8px' : '10px',
              }}
            >
              {cards.map((card, i) => (
                <GameCard
                  key={card.id}
                  card={card}
                  index={i}
                  isFlipped={flipped.includes(card.id)}
                  isMatched={matched.has(card.pairId)}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
