import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail, ChevronDown } from 'lucide-react'

const ROLES = [
  'Software Engineer',
  'Full-Stack Developer',
  'DevOps Engineer',
  'AI Integrator',
  'Mobile Developer',
]

const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}))

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Typewriter effect
  useEffect(() => {
    const current = ROLES[roleIndex]
    const speed = isDeleting ? 40 : 80

    if (!isDeleting && displayText === current) {
      typingRef.current = setTimeout(() => setIsDeleting(true), 2000)
      return
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setRoleIndex(prev => (prev + 1) % ROLES.length)
      return
    }

    typingRef.current = setTimeout(() => {
      setDisplayText(prev =>
        isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
      )
    }, speed)

    return () => { if (typingRef.current) clearTimeout(typingRef.current) }
  }, [displayText, isDeleting, roleIndex])

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-60" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(${Math.random() > 0.5 ? '99,102,241' : '168,85,247'},${Math.random() * 0.5 + 0.2})`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium glass-card text-primary-300 border-primary-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for opportunities
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight"
        >
          <span className="block text-white dark:text-white text-gray-900">Dilshan</span>
          <span className="block gradient-text">Nadeeranga</span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="h-14 md:h-16 flex items-center justify-center mb-6"
        >
          <p className="text-2xl md:text-3xl font-light text-gray-300">
            <span className="text-primary-400 font-semibold font-mono">
              {displayText}
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-primary-400 ml-0.5"
            >|</motion.span>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Passionate Software Engineer with 1 year of industry experience, specializing in
          Full-Stack development, DevOps, and AI integrations.
          Building scalable solutions from Gampaha, Sri Lanka 🇱🇰
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <motion.button
            onClick={scrollToProjects}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2 text-base"
          >
            View My Work
            <ArrowRight size={18} />
          </motion.button>

          <motion.a
            href="/Dilshan_Nadeeranga_CV.pdf"
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary flex items-center gap-2 text-base"
          >
            Download Resume
          </motion.a>

          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-400 hover:text-white transition-all border border-white/10 hover:border-white/20 hover:bg-white/5 text-base"
          >
            <Mail size={16} />
            Contact Me
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-4"
        >
          {[
            { icon: Github, href: 'https://github.com/Dilshan-Nadeeranga', label: 'GitHub' },
            { icon: Linkedin, href: 'https://www.linkedin.com/in/dilshan-nadeeranga-206a342b6/', label: 'LinkedIn' },
            { icon: Mail, href: 'mailto:nadeerangadilshan03@gmail.com', label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.2, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl glass-card text-gray-400 hover:text-primary-400 transition-colors"
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gray-500 hover:text-primary-400 cursor-pointer transition-colors"
            onClick={() => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <ChevronDown size={28} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
