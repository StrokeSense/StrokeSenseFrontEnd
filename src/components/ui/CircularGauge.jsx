import { motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import { getRiskColor } from '../../utils/riskUtils'

const SIZE = 200
const STROKE = 14
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function CircularGauge({ percent, riskLevel }) {
  const color = getRiskColor(riskLevel)
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <NumberFlow
          value={Math.round(percent)}
          suffix="%"
          className="text-4xl font-extrabold text-text"
        />
        <span className="text-sm text-muted">Stroke Risk</span>
      </div>
    </div>
  )
}
