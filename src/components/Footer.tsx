import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart, ArrowUp, Download } from 'lucide-react'

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/Dilshan-Nadeeranga', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/dilshan-nadeeranga-206a342b6/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:nadeerangadilshan03@gmail.com', label: 'Email' },
]

const NAV_LINKS = [
  { label: 'Hero', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-gray-200 dark:border-white/5 pt-16 pb-8">
      <div className="absolute inset-0 opacity-10 dark:opacity-15"
        style={{ background: 'radial-gradient(ellipse at top center, rgba(99,102,241,0.3) 0%, transparent 70%)' }} />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-black font-mono gradient-text mb-3">&lt;DN /&gt;</div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              Software Engineer from Sri Lanka, building scalable web, mobile, and AI-powered solutions.
            </p>
            <div className="flex gap-3 mt-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/Dilshan_Nadeeranga_CV.pdf"
                  download
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                >
                  <Download size={14} />
                  Download Resume
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Dilshan-Nadeeranga"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                >
                  <Github size={14} />
                  GitHub Profile
                </a>
              </li>
              <li>
                <a
                  href="mailto:nadeerangadilshan03@gmail.com"
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                >
                  <Mail size={14} />
                  Send Email
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Currently working at</div>
              <a
                href="https://www.invertcode.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Invert Code →
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-xs flex items-center gap-1.5">
            © {new Date().getFullYear()} Dilshan Nadeeranga. Built with
            <Heart size={12} className="text-red-400 fill-red-400" />
            using React, Vite & Tailwind CSS
          </p>

          <motion.button
            onClick={scrollTop}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-primary-500/30 transition-all text-sm"
            aria-label="Scroll to top"
          >
            <ArrowUp size={14} />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
