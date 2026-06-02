import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Brain, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../ui/Button'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/check', label: 'Check Risk' },
  { to: '/dashboard', label: 'History' },
]

const linkClass = ({ isActive }) =>
  `min-h-11 inline-flex items-center px-3 text-sm font-medium transition-colors ${
    isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-muted hover:text-primary'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex min-h-11 items-center gap-2 text-lg font-bold text-primary"
          >
            <Brain className="h-7 w-7" aria-hidden="true" />
            StrokeSense
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={linkClass}
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link to="/check" className="ml-2">
              <Button className="px-4 py-1.5 text-xs">Check Risk Now</Button>
            </Link>
          </div>

          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
            >
              <ul className="flex flex-col px-4 py-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={linkClass}
                      end={link.to === '/'}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="pointer-events-none h-3 bg-gradient-to-b from-slate-100/60 to-transparent" />
    </>
  )
}
