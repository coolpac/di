import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const photos = [
  { src: '/photos/diana-9.jpeg', caption: 'Красотка', tall: true },
  { src: '/photos/diana-11.jpeg', caption: 'Лето' },
  { src: '/photos/diana-1.jpeg', caption: 'Стиль' },
  { src: '/photos/diana-7.jpeg', caption: 'С другом' },
  { src: '/photos/diana-12.jpeg', caption: 'Сладкоежка', tall: true },
  { src: '/photos/diana-5.jpeg', caption: 'Милашка' },
  { src: '/photos/diana-2.jpeg', caption: 'Уютная', tall: true },
  { src: '/photos/diana-16.jpeg', caption: 'Butterfly' },
  { src: '/photos/diana-8.jpeg', caption: 'Взгляд' },
  { src: '/photos/diana-15.jpeg', caption: 'Настроение', tall: true },
  { src: '/photos/diana-6.jpeg', caption: 'Вечер' },
  { src: '/photos/diana-19.jpeg', caption: 'Закат' },
  { src: '/photos/diana-3.jpeg', caption: 'Glow', tall: true },
  { src: '/photos/diana-10.jpeg', caption: 'Ночь' },
  { src: '/photos/diana-17.jpeg', caption: 'Мороженка' },
  { src: '/photos/diana-13.jpeg', caption: 'Маленькая', tall: true },
  { src: '/photos/diana-4.jpeg', caption: 'Арт' },
  { src: '/photos/diana-21.jpeg', caption: 'Гррр' },
  { src: '/photos/diana-20.jpeg', caption: 'Огонь', tall: true },
  { src: '/photos/diana-14.jpeg', caption: 'Вайб' },
  { src: '/photos/diana-18.jpeg', caption: 'Воля' },
]

function PhotoCard({ photo, index, onClick }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.07,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        gridRow: photo.tall ? 'span 2' : 'span 1',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: isHovered
          ? '0 20px 60px rgba(232, 88, 122, 0.25)'
          : '0 4px 20px rgba(0, 0, 0, 0.06)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      <motion.img
        src={photo.src}
        alt={photo.caption}
        loading="lazy"
        animate={{ scale: isHovered ? 1.06 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '40px 20px 16px',
          background: 'linear-gradient(transparent, rgba(44, 24, 16, 0.65))',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: '1rem',
          color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {photo.caption}
        </span>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: '8px',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '10px',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}

function LightboxModal({ photo, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out',
        backdropFilter: 'blur(10px)',
      }}
    >
      <motion.img
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        src={photo.src}
        alt={photo.caption}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '12px',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.5)',
        }}
      />
    </motion.div>
  )
}

export default function PhotoGallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF0F5 50%, #FFE4EC 100%)',
        padding: '80px 20px',
        minHeight: 'auto',
      }}
    >
      <div ref={ref} style={{ maxWidth: '900px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '50px' }}
        >
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '16px',
          }}>
            Моя любимая
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--text-dark)',
            marginBottom: '16px',
          }}>
            Самая красивая
          </h2>
          <div style={{
            width: '40px',
            height: '1px',
            background: 'var(--gold)',
            margin: '0 auto',
          }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: '180px',
          gap: '12px',
        }}>
          {photos.map((photo, i) => (
            <PhotoCard
              key={i}
              photo={photo}
              index={i}
              onClick={() => setSelectedPhoto(photo)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <LightboxModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
