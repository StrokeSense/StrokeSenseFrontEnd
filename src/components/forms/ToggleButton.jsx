import { motion } from 'framer-motion'

export default function ToggleButton({ options, value, onChange, name }) {
  return (
    <div className="relative flex flex-wrap gap-2" role="group" aria-label={name}>
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative z-10 min-h-11 flex-1 rounded-full border-2 bg-transparent px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:min-w-[100px] ${
              selected
                ? 'border-primary text-white'
                : 'border-slate-200 text-muted hover:text-text'
            }`}
          >
            {selected && (
              <motion.div
                layoutId={`toggle-pill-${name}`}
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
