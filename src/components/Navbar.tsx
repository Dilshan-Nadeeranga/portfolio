import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Download } from 'lucide-react'

interface NavbarProps {
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'GitHub', href: '#github' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )

    NAV_LINKS.forEach(link => {
      const el = document.querySelector(link.href)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 backdrop-blur-xl border-b border-white/10 bg-gray-950/80 dark:bg-gray-950/80'
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

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <button
                onClick={() => scrollTo(link.href)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  activeSection === link.href.slice(1)
                    ? 'text-primary-400'
                    : 'text-gray-400 hover:text-gray-100 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                {activeSection === link.href.slice(1) && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-lg bg-primary-500/10 border border-primary-500/20"
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
            className="p-2 rounded-xl text-gray-400 hover:text-gray-100 hover:bg-white/5 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <motion.a
            href="/Dilshan_Nadeeranga_CV.pdf"
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
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-gray-100 hover:bg-white/5 transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden backdrop-blur-xl bg-gray-950/95 border-t border-white/10"
          >
            <div className="section-container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                >
                  {link.label}
                </motion.button>
              ))}
              <a
                href="/Dilshan_Nadeeranga_CV.pdf"
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
