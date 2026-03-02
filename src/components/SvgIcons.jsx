// Beautiful hand-crafted SVG icons — optimized, no emojis
// Each icon accepts size (default 24) and color props

export function HeartIcon({ size = 24, color = '#E8587A', className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </svg>
  )
}

export function HeartOutlineIcon({ size = 24, color = '#E8587A', strokeWidth = 1.5, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </svg>
  )
}

export function StarIcon({ size = 24, color = '#D4AF37', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path
        d="M12 2l2.94 6.26L22 9.27l-5 5.14L18.18 22 12 18.56 5.82 22 7 14.41l-5-5.14 7.06-1.01L12 2z"
        fill={color}
      />
      <path
        d="M12 2l2.94 6.26L22 9.27l-5 5.14L18.18 22 12 18.56 5.82 22 7 14.41l-5-5.14 7.06-1.01L12 2z"
        fill="url(#starShine)"
        opacity="0.3"
      />
      <defs>
        <linearGradient id="starShine" x1="2" y1="2" x2="22" y2="22">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function LeafIcon({ size = 24, color = '#4A7C2E', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 13c3.17-2 5.33-4.5 7-8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

export function FlowerIcon({ size = 24, color = '#F4A0B5', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      {/* Petals */}
      <ellipse cx="12" cy="7.5" rx="3" ry="4" fill={color} opacity="0.7" />
      <ellipse cx="12" cy="7.5" rx="3" ry="4" fill={color} opacity="0.7" transform="rotate(72 12 12)" />
      <ellipse cx="12" cy="7.5" rx="3" ry="4" fill={color} opacity="0.7" transform="rotate(144 12 12)" />
      <ellipse cx="12" cy="7.5" rx="3" ry="4" fill={color} opacity="0.7" transform="rotate(216 12 12)" />
      <ellipse cx="12" cy="7.5" rx="3" ry="4" fill={color} opacity="0.7" transform="rotate(288 12 12)" />
      {/* Center */}
      <circle cx="12" cy="12" r="2.5" fill="#D4AF37" />
      <circle cx="12" cy="12" r="1.5" fill="#F0D78C" />
    </svg>
  )
}

export function SparkleIcon({ size = 24, color = '#D4AF37', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={color}
      />
      <path
        d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z"
        fill={color}
        opacity="0.6"
      />
      <path
        d="M5 2l.5 1.5L7 4l-1.5.5L5 6l-.5-1.5L3 4l1.5-.5L5 2z"
        fill={color}
        opacity="0.4"
      />
    </svg>
  )
}

export function TargetIcon({ size = 24, color = '#E8587A', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  )
}

export function RoseIcon({ size = 24, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      {/* Stem */}
      <path d="M12 14v8" stroke="#4A7C2E" strokeWidth="1.2" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M12 18q-3-1.5-4-4 2 .5 4 4z" fill="#4A7C2E" opacity="0.7" />
      {/* Petals */}
      <ellipse cx="12" cy="9" rx="3" ry="4.5" fill="#F4A0B5" opacity="0.6" />
      <ellipse cx="10" cy="8.5" rx="2.5" ry="4" fill="#FFE4EC" opacity="0.7" transform="rotate(-15 10 8.5)" />
      <ellipse cx="14" cy="8.5" rx="2.5" ry="4" fill="#FFE4EC" opacity="0.7" transform="rotate(15 14 8.5)" />
      <ellipse cx="11" cy="7.5" rx="2" ry="3.5" fill="#FFF0F5" opacity="0.8" transform="rotate(-8 11 7.5)" />
      <ellipse cx="13" cy="7.5" rx="2" ry="3.5" fill="#FFF0F5" opacity="0.8" transform="rotate(8 13 7.5)" />
      <circle cx="12" cy="7" r="1.5" fill="#FFF8F0" />
    </svg>
  )
}

export function KissIcon({ size = 24, color = '#E8587A', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      {/* Upper lip */}
      <path
        d="M4 13c0-3 3-5 5.5-5C11 8 12 9.5 12 9.5S13 8 14.5 8C17 8 20 10 20 13"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        opacity="0.8"
        strokeLinecap="round"
      />
      {/* Lower lip */}
      <path
        d="M4 13c0 3 3.5 5.5 8 5.5s8-2.5 8-5.5"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        opacity="0.6"
        strokeLinecap="round"
      />
      {/* Shine */}
      <ellipse cx="9" cy="12" rx="1.5" ry="1" fill="#fff" opacity="0.3" />
    </svg>
  )
}

export function PartyIcon({ size = 24, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      {/* Cone */}
      <path d="M4 21L10 5l6 16H4z" fill="#D4AF37" opacity="0.8" />
      <path d="M4 21L10 5l6 16H4z" fill="url(#partyGrad)" />
      {/* Stripes */}
      <path d="M6.5 16l2-6" stroke="#E8587A" strokeWidth="1" opacity="0.5" />
      <path d="M8.5 16l2-6" stroke="#F4A0B5" strokeWidth="1" opacity="0.5" />
      {/* Confetti */}
      <circle cx="14" cy="4" r="1" fill="#E8587A" />
      <circle cx="18" cy="6" r="0.8" fill="#D4AF37" />
      <circle cx="16" cy="8" r="0.7" fill="#F4A0B5" />
      <rect x="19" y="3" width="1.5" height="1.5" rx="0.3" fill="#4A7C2E" transform="rotate(30 19 3)" />
      <rect x="13" cy="7" width="1.2" height="1.2" rx="0.3" fill="#D4AF37" transform="rotate(15 13 7)" />
      <defs>
        <linearGradient id="partyGrad" x1="4" y1="21" x2="16" y2="5">
          <stop offset="0%" stopColor="#E8587A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function RefreshIcon({ size = 24, color = '#E8587A', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path
        d="M4 12a8 8 0 0114.93-4M20 12a8 8 0 01-14.93 4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M20 4v4h-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20v-4h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BouquetIcon({ size = 24, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      {/* Wrapper */}
      <path d="M8 14l-2 8h12l-2-8" fill="#F0D78C" opacity="0.5" />
      <path d="M8 14l-2 8h12l-2-8" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
      {/* Flowers */}
      <circle cx="10" cy="9" r="3" fill="#F4A0B5" opacity="0.7" />
      <circle cx="10" cy="9" r="1.2" fill="#FFF8F0" />
      <circle cx="14.5" cy="8" r="2.5" fill="#FFE4EC" opacity="0.7" />
      <circle cx="14.5" cy="8" r="1" fill="#FFF8F0" />
      <circle cx="12" cy="6" r="2.8" fill="#E8587A" opacity="0.5" />
      <circle cx="12" cy="6" r="1.1" fill="#FFF0F5" />
      {/* Leaves */}
      <path d="M7 11q-2-1-2-3 2 0 2 3z" fill="#4A7C2E" opacity="0.6" />
      <path d="M17 10q2-1 2-3-2 0-2 3z" fill="#4A7C2E" opacity="0.6" />
    </svg>
  )
}

// Decorative ornamental divider
export function OrnamentDivider({ width = 120, color = '#D4AF37', style }) {
  return (
    <svg width={width} height="16" viewBox="0 0 120 16" fill="none" style={style}>
      <line x1="0" y1="8" x2="42" y2="8" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <line x1="78" y1="8" x2="120" y2="8" stroke={color} strokeWidth="0.5" opacity="0.4" />
      {/* Center diamond ornament */}
      <path d="M60 2l4 6-4 6-4-6z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" />
      <path d="M60 5l2 3-2 3-2-3z" fill={color} opacity="0.3" />
      {/* Side dots */}
      <circle cx="46" cy="8" r="1" fill={color} opacity="0.4" />
      <circle cx="74" cy="8" r="1" fill={color} opacity="0.4" />
      <circle cx="50" cy="8" r="0.5" fill={color} opacity="0.3" />
      <circle cx="70" cy="8" r="0.5" fill={color} opacity="0.3" />
    </svg>
  )
}
