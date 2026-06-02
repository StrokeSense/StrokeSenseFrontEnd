import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-sm',
  secondary:
    'bg-white text-primary border-2 border-primary hover:bg-teal-50',
  danger:
    'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
  ghost: 'bg-transparent text-muted hover:text-text hover:bg-slate-100',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variant === 'primary' ? 'relative overflow-hidden btn-shimmer' : ''} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
