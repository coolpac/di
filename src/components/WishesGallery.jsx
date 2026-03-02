import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const wishes = [
  {
    emoji: '\u2764\uFE0F',
    title: 'Любви',
    text: 'Пусть любовь наполняет каждый твой день теплом и нежностью',
    gradient: 'linear-gradient(135deg, #FFF0F5, #FFE4EC)',
  },
  {
    emoji: '\u2B50',
    title: 'Счастья',
    text: 'Желаю безграничного счастья и ярких, незабываемых моментов',
    gradient: 'linear-gradient(135deg, #FFF8F0, #FEF3E2)',
  },
  {
    emoji: '\u{1F33F}',
    title: 'Здоровья',
    text: 'Крепкого здоровья и энергии для исполнения всех твоих мечтаний',
    gradient: 'linear-gradient(135deg, #F0FFF0, #E8F5E8)',
  },
  {
    emoji: '\u{1F338}',
    title: 'Красоты',
    text: 'Ты прекрасна! Пусть каждое зеркало напоминает тебе об этом',
    gradient: 'linear-gradient(135deg, #FFF0F5, #F5E6FF)',
  },
]

function WishCard({ wish, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.12,
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{ y: -6 }}
      style={{
        background: wish.gradient,
        borderRadius: '20px',
        padding: '36px 24px',
        textAlign: 'center',
        cursor: 'default',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ fontSize: '2.2rem', marginBottom: '16px' }}>
        {wish.emoji}
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--text-dark)',
        marginBottom: '10px',
      }}>
        {wish.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        color: 'var(--text-medium)',
        lineHeight: 1.7,
        fontWeight: 300,
      }}>
        {wish.text}
      </p>
    </motion.div>
  )
}

export default function WishesGallery() {
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
      <div ref={ref} style={{ maxWidth: '900px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '50px' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '16px',
          }}>Пожелания</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 400, color: 'var(--text-dark)', marginBottom: '16px',
          }}>От всего сердца</h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto' }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {wishes.map((wish, i) => (
            <WishCard key={i} wish={wish} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
