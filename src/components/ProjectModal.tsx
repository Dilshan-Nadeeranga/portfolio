import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, Calendar } from 'lucide-react'

export interface Project {
  id: number
  title: string
  shortDesc: string
  fullDesc: string
  problem: string
  solution: string
  techStack: string[]
  thumbnail: string
  githubUrl: string
  liveUrl: string
  category: string
  featured: boolean
  date: string
}

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (project) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Case study: ${project.title}`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-primary-500/20 shadow-2xl"
            style={{ boxShadow: '0 0 50px rgba(99,102,241,0.2)' }}
          >
            {/* Header image placeholder */}
            <div className="h-48 rounded-t-2xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-2 font-black gradient-text">{project.title[0]}</div>
                  <div className="text-primary-300 font-mono text-sm">{project.category}</div>
                </div>
              </div>
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99,102,241,1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, rgba(168,85,247,1) 0%, transparent 50%)`,
                }} />
            </div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700 transition-all z-10"
              aria-label="Close modal"
            >
              <X size={18} />
            </motion.button>

            <div className="p-6 md:p-8">
              {/* Title + date */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black gradient-text mb-1">{project.title}</h2>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={14} />
                    <span>{project.date}</span>
                  </div>
                </div>
                <span className="tech-badge text-sm">{project.category}</span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">{project.fullDesc}</p>

              {/* Problem & Solution */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="glass-card rounded-xl p-4 border-l-4 border-red-500/50">
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">Problem</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{project.problem}</p>
                </div>
                <div className="glass-card rounded-xl p-4 border-l-4 border-emerald-500/50">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Solution</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{project.solution}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 btn-primary"
                  >
                    <Github size={16} />
                    View Code
                  </motion.a>
                )}
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 btn-secondary"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
