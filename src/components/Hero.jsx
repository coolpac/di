import { motion } from 'framer-motion'

const title = 'С 8 марта'
const name = 'Диана'

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.8 + i * 0.08,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const nameLetterVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: 2.0 + i * 0.12,
      duration: 0.5,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  }),
}

const flowerVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      delay: 3.2,
      duration: 1,
      type: 'spring',
      stiffness: 100,
    },
  },
}

const scrollHintVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 4, duration: 1 },
  },
  bounce: {
    y: [0, 10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export default function Hero() {
  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF0F5 50%, #FFE4EC 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Декоративные круги */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--gold-light) 0%, transparent 70%)',
          top: '-200px',
          right: '-200px',
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.08 }}
        transition={{ duration: 2.5, delay: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--rose) 0%, transparent 70%)',
          bottom: '-100px',
          left: '-100px',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Декоративная линия */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          style={{
            width: '60px',
            height: '1px',
            background: 'var(--gold)',
            margin: '0 auto 30px',
          }}
        />

        {/* С 8 марта */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 400,
            color: 'var(--text-dark)',
            lineHeight: 1.2,
            marginBottom: '20px',
            perspective: '1000px',
          }}
        >
          {title.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'inline-block', minWidth: char === ' ' ? '0.3em' : 'auto' }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Диана */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 12vw, 7rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, var(--rose-deep) 0%, var(--gold) 50%, var(--rose-deep) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
            marginBottom: '30px',
          }}
        >
          {name.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={nameLetterVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </h2>

        {/* Роза SVG */}
        <motion.div
          variants={flowerVariants}
          initial="hidden"
          animate="visible"
        >
          <svg width="80" height="80" viewBox="0 0 100 100" style={{ margin: '0 auto' }}>
            {/* Стебель */}
            <motion.path
              d="M50 60 Q48 75, 50 95"
              stroke="#4A7C2E"
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 3.5, duration: 1 }}
            />
            {/* Листик */}
            <motion.path
              d="M50 78 Q40 72, 35 65 Q42 70, 50 78"
              fill="#4A7C2E"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 4, duration: 0.5 }}
              style={{ transformOrigin: '50px 78px' }}
            />
            {/* Лепестки розы */}
            <motion.ellipse cx="50" cy="45" rx="12" ry="18" fill="#FFF0F5" stroke="#FFE4EC" strokeWidth="0.5"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.3, duration: 0.5 }} style={{ transformOrigin: '50px 45px' }} />
            <motion.ellipse cx="42" cy="42" rx="10" ry="16" fill="#FFFFFF" stroke="#FFE4EC" strokeWidth="0.5" transform="rotate(-20, 42, 42)"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.4, duration: 0.5 }} style={{ transformOrigin: '42px 42px' }} />
            <motion.ellipse cx="58" cy="42" rx="10" ry="16" fill="#FFFFFF" stroke="#FFE4EC" strokeWidth="0.5" transform="rotate(20, 58, 42)"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.5, duration: 0.5 }} style={{ transformOrigin: '58px 42px' }} />
            <motion.ellipse cx="46" cy="38" rx="8" ry="14" fill="#FFF8F0" stroke="#FFE4EC" strokeWidth="0.5" transform="rotate(-10, 46, 38)"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.6, duration: 0.5 }} style={{ transformOrigin: '46px 38px' }} />
            <motion.ellipse cx="54" cy="38" rx="8" ry="14" fill="#FFF8F0" stroke="#FFE4EC" strokeWidth="0.5" transform="rotate(10, 54, 38)"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.7, duration: 0.5 }} style={{ transformOrigin: '54px 38px' }} />
            {/* Центр */}
            <motion.circle cx="50" cy="40" r="6" fill="#FFF0F5"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.8, duration: 0.4 }} style={{ transformOrigin: '50px 40px' }} />
          </svg>
        </motion.div>

        {/* Декоративная линия */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 3.5, duration: 0.8, ease: 'easeOut' }}
          style={{
            width: '60px',
            height: '1px',
            background: 'var(--gold)',
            margin: '30px auto 0',
          }}
        />
      </div>

      {/* Скролл-хинт */}
      <motion.div
        variants={scrollHintVariants}
        initial="hidden"
        animate={['visible', 'bounce']}
        style={{
          position: 'absolute',
          bottom: '40px',
          textAlign: 'center',
          color: 'var(--text-light)',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.1em',
        }}
      >
        <div style={{ marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.7rem' }}>
          scroll
        </div>
        <svg width="20" height="30" viewBox="0 0 20 30">
          <rect x="1" y="1" width="18" height="28" rx="9" fill="none" stroke="var(--text-light)" strokeWidth="1.5" />
          <motion.circle
            cx="10" cy="10" r="2.5"
            fill="var(--text-light)"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </section>
  )
}
