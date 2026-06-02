import { motion } from 'framer-motion'

export default function Card({ children, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl bg-gradient-to-b from-white to-slate-50/60 p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
