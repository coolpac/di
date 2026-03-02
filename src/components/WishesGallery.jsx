import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const wishes = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <motion.path
          d="M24 42s-14-8.35-14-19c0-5.52 4.48-10 10-10 3.78 0 7.09 2.09 8.8 5.18C30.51 15.09 33.82 13 37.6 13c5.52 0 10 4.48 10 10 0 10.65-14 19-14 19h-9.6z"
          fill="none"
          stroke="var(--rose-deep)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
        <path d="M24 42s-14-8.35-14-19c0-5.52 4.48-10 10-10 3.78 0 7.09 2.09 8.8 5.18C30.51 15.09 33.82 13 37.6 13c5.52 0 10 4.48 10 10 0 10.65-14 19-14 19h-9.6z"
          fill="var(--rose-deep)" opacity="0.15" />
      </svg>
    ),
    title: 'Любви',
    text: 'Пусть любовь наполняет каждый твой день теплом и нежностью',
    gradient: 'linear-gradient(135deg, #FFF0F5, #FFE4EC)',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill="var(--gold)" opacity="0.15" />
        <path d="M24 8l4 8 8 1.5-6 5.5 1.5 8L24 28l-7.5 3 1.5-8-6-5.5 8-1.5z"
          fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Счастья',
    text: 'Желаю безграничного счастья и ярких, незабываемых моментов',
    gradient: 'linear-gradient(135deg, #FFF8F0, #F0D78C22)',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill="var(--green-leaf)" opacity="0.12" />
        <path d="M16 32c0-8 8-16 16-16-4 4-6 10-6 16H16z" fill="none" stroke="var(--green-leaf)" strokeWidth="2" />
        <path d="M20 28c2-6 6-10 12-12" fill="none" stroke="var(--green-leaf)" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    title: 'Здоровья',
    text: 'Крепкого здоровья и энергии для исполнения всех твоих мечтаний',
    gradient: 'linear-gradient(135deg, #F0FFF0, #E8F5E8)',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill="var(--rose)" opacity="0.15" />
        <path d="M24 14v10l6 6" fill="none" stroke="var(--rose-deep)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="24" r="14" fill="none" stroke="var(--rose)" strokeWidth="1.5" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
          <line
            key={deg}
            x1={24 + 12 * Math.cos(deg * Math.PI / 180)}
            y1={24 + 12 * Math.sin(deg * Math.PI / 180)}
            x2={24 + 14 * Math.cos(deg * Math.PI / 180)}
            y2={24 + 14 * Math.sin(deg * Math.PI / 180)}
            stroke="var(--rose)"
            strokeWidth="1"
          />
        ))}
      </svg>
    ),
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
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        rotateY: 5,
        rotateX: 5,
        boxShadow: '0 20px 60px rgba(244, 160, 181, 0.2)',
      }}
      style={{
        background: wish.gradient,
        borderRadius: '20px',
        padding: '40px 30px',
        textAlign: 'center',
        cursor: 'default',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{ marginBottom: '20px' }}
      >
        {wish.icon}
      </motion.div>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--text-dark)',
        marginBottom: '12px',
      }}>
        {wish.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.95rem',
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
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '16px',
          }}>
            Пожелания
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--text-dark)',
            marginBottom: '16px',
          }}>
            От всего сердца
          </h2>
          <div style={{
            width: '40px',
            height: '1px',
            background: 'var(--gold)',
            margin: '0 auto',
          }} />
        </motion.div>

        {/* Карточки */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}>
          {wishes.map((wish, i) => (
            <WishCard key={i} wish={wish} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
