import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Brain, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../ui/Button'
import { useLanguage } from '../../i18n/LanguageContext'

const navLabels = {
  en: {
    home: 'Home',
    checkRisk: 'Check Risk',
    history: 'History',
    checkNow: 'Check Risk Now',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  id: {
    home: 'Beranda',
    checkRisk: 'Cek Risiko',
    history: 'Riwayat',
    checkNow: 'Cek Risiko Sekarang',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
  },
}

const navLinks = [
  { to: '/', key: 'home' },
  { to: '/check', key: 'checkRisk' },
  { to: '/dashboard', key: 'history' },
]

const linkClass = ({ isActive }) =>
  `min-h-11 inline-flex items-center px-3 text-sm font-medium transition-colors ${
    isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-muted hover:text-primary'
  }`

function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`min-h-8 rounded-full px-3 transition ${
          language === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-muted hover:text-primary'
        }`}
        aria-label="Switch language to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('id')}
        className={`min-h-8 rounded-full px-3 transition ${
          language === 'id'
            ? 'bg-primary text-white shadow-sm'
            : 'text-muted hover:text-primary'
        }`}
        aria-label="Ganti bahasa ke Indonesia"
      >
        ID
      </button>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()
  const labels = navLabels[language] ?? navLabels.en

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

          <div className="hidden items-center gap-2 md:flex">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={linkClass}
                    end={link.to === '/'}
                  >
                    {labels[link.key]}
                  </NavLink>
                </li>
              ))}
            </ul>

            <LanguageToggle />

            <Link to="/check" className="ml-1">
              <Button className="px-4 py-1.5 text-xs">
                {labels.checkNow}
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />

            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:bg-slate-100"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? labels.closeMenu : labels.openMenu}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
                      {labels[link.key]}
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
