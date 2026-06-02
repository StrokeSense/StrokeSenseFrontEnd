import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Info } from 'lucide-react'

export default function InfoTooltip({ content }) {
  const [open, setOpen] = useState(false)
  const [touchOpen, setTouchOpen] = useState(false)

  const show = open || touchOpen

  const handleClick = () => {
    setTouchOpen((v) => !v)
  }

  return (
    <span className="relative inline-flex items-center gap-1">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-primary"
        aria-label="More information"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false)
          setTouchOpen(false)
        }}
        onClick={handleClick}
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 z-50 mb-2 w-max min-w-[260px] max-w-xs rounded-xl bg-white px-4 py-3 text-base leading-relaxed text-text shadow-lg sm:left-1/2 sm:-translate-x-1/2"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
