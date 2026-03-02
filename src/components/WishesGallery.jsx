import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HeartIcon, StarIcon, LeafIcon, FlowerIcon, OrnamentDivider } from './SvgIcons'

const wishes = [
  {
    Icon: HeartIcon,
    iconColor: '#E8587A',
    title: 'Любви',
    text: 'Пусть любовь наполняет каждый твой день теплом и нежностью',
    accent: '#E8587A',
    bgFrom: 'rgba(232, 88, 122, 0.08)',
    bgTo: 'rgba(244, 160, 181, 0.12)',
    borderColor: 'rgba(232, 88, 122, 0.15)',
  },
  {
    Icon: StarIcon,
    iconColor: '#D4AF37',
    title: 'Счастья',
    text: 'Желаю безграничного счастья и ярких, незабываемых моментов',
    accent: '#D4AF37',
    bgFrom: 'rgba(212, 175, 55, 0.06)',
    bgTo: 'rgba(240, 215, 140, 0.12)',
    borderColor: 'rgba(212, 175, 55, 0.15)',
  },
  {
    Icon: LeafIcon,
    iconColor: '#4A7C2E',
    title: 'Здоровья',
    text: 'Крепкого здоровья и энергии для исполнения всех твоих мечтаний',
    accent: '#4A7C2E',
    bgFrom: 'rgba(74, 124, 46, 0.06)',
    bgTo: 'rgba(74, 124, 46, 0.1)',
    borderColor: 'rgba(74, 124, 46, 0.12)',
  },
  {
    Icon: FlowerIcon,
    iconColor: '#F4A0B5',
    title: 'Красоты',
    text: 'Ты прекрасна! Пусть каждое зеркало напоминает тебе об этом',
    accent: '#C77DBA',
    bgFrom: 'rgba(244, 160, 181, 0.08)',
    bgTo: 'rgba(199, 125, 186, 0.1)',
    borderColor: 'rgba(199, 125, 186, 0.15)',
  },
]

function WishCard({ wish, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const { Icon } = wish
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={mobile ? undefined : { y: -8, scale: 1.02 }}
      style={{
        background: `linear-gradient(145deg, ${wish.bgFrom}, ${wish.bgTo})`,
        borderRadius: '24px',
        padding: mobile ? '28px 16px' : '40px 28px',
        textAlign: 'center',
        cursor: 'default',
        border: `1px solid ${wish.borderColor}`,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background circle */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${wish.accent}08, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Icon with glow ring */}
      <motion.div
        animate={isInView ? { scale: [0, 1.15, 1] } : {}}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.5, ease: 'easeOut' }}
        style={{
          width: mobile ? 52 : 64,
          height: mobile ? 52 : 64,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${wish.accent}12, ${wish.accent}06)`,
          border: `1.5px solid ${wish.accent}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <Icon size={mobile ? 26 : 30} color={wish.iconColor} />
      </motion.div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: mobile ? '1.1rem' : '1.35rem',
        fontWeight: 700,
        color: 'var(--text-dark)',
        marginBottom: '10px',
      }}>
        {wish.title}
      </h3>

      <div style={{
        width: '24px',
        height: '1px',
        background: wish.accent,
        margin: '0 auto 12px',
        opacity: 0.3,
      }} />

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: mobile ? '0.8rem' : '0.9rem',
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
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 50%, #FFF8F0 100%)',
        padding: mobile ? '60px 16px' : '80px 20px',
        minHeight: 'auto',
      }}
    >
      <div ref={ref} style={{ maxWidth: '900px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: mobile ? '36px' : '50px' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--gold)', marginBottom: '16px',
          }}>Пожелания</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 400, color: 'var(--text-dark)', marginBottom: '20px',
          }}>От всего сердца</h2>
          <OrnamentDivider width={120} style={{ margin: '0 auto' }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: mobile ? '12px' : '20px',
        }}>
          {wishes.map((wish, i) => (
            <WishCard key={i} wish={wish} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
