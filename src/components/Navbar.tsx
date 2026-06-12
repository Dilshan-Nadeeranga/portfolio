import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Download } from 'lucide-react'

interface NavbarProps {
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const NAV_LINKS = [
  { label: 'Home',       href: '#hero' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'GitHub',     href: '#github' },
  { label: 'Blog',       href: '#blog' },
  { label: 'Contact',    href: '#contact' },
]

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen]         = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [activeSection, setActive]  = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -40% 0px' }
    )
    NAV_LINKS.forEach(l => { const el = document.querySelector(l.href); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/10 bg-white/90 dark:bg-gray-950/85 shadow-sm dark:shadow-none'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('#hero')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xl font-bold font-mono"
        >
          <span className="gradient-text">&lt;DN /&gt;</span>
        </motion.button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <button
                onClick={() => scrollTo(link.href)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  activeSection === link.href.slice(1)
                    ? scrolled ? 'text-primary-600 dark:text-primary-400' : 'text-primary-300'
                    : scrolled
                      ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      : 'text-white/70 hover:text-white'
                }`}
              >
                {activeSection === link.href.slice(1) && (
                  <motion.span
                    layoutId="active-pill"
                    className={`absolute inset-0 rounded-lg ${
                      scrolled
                        ? 'bg-primary-500/10 border border-primary-500/20'
                        : 'bg-white/10 border border-white/20'
                    }`}
                  />
                )}
                <span className="relative">{link.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-xl transition-all ${
              scrolled
                ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <motion.a
            href={`${import.meta.env.BASE_URL}Dilshan_Nadeeranga_CV.pdf`}
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 btn-primary text-sm"
          >
            <Download size={14} />
            Resume
          </motion.a>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`md:hidden p-2 rounded-xl transition-all ${
              scrolled
                ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-gray-950/95 border-t border-gray-200/60 dark:border-white/10"
          >
            <div className="section-container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all font-medium"
                >
                  {link.label}
                </motion.button>
              ))}
              <a
                href={`${import.meta.env.BASE_URL}Dilshan_Nadeeranga_CV.pdf`}
                download
                className="flex items-center gap-2 mt-2 btn-primary justify-center"
              >
                <Download size={14} />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
