import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Eye, Star } from 'lucide-react'
import { fetchData } from '../utils/fetchData'
import ProjectModal, { type Project } from './ProjectModal'

const CATEGORIES = ['All', 'MERN', 'Mobile', 'AI', 'DevOps']

const CATEGORY_GRADIENTS: Record<string, string> = {
  AI:     'from-violet-600/20 to-purple-600/20',
  MERN:   'from-blue-600/20 to-cyan-600/20',
  Mobile: 'from-pink-600/20 to-rose-600/20',
  DevOps: 'from-orange-600/20 to-amber-600/20',
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const gradient = CATEGORY_GRADIENTS[project.category] ?? 'from-primary-600/20 to-indigo-600/20'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative glass-card rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 cursor-pointer"
      onClick={onClick}
      data-cursor-hover
    >
      {/* Card header */}
      <div className={`h-40 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black opacity-10 gradient-text">{project.title[0]}</span>
        </div>

        <div className="absolute top-3 left-3">
          <span className="tech-badge text-xs">{project.category}</span>
        </div>

        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Featured</span>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-primary-950/80 backdrop-blur-sm flex items-center justify-center gap-3"
        >
          <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white">
            <Eye size={20} />
          </div>
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors mb-2 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.shortDesc}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 4).map(tech => (
            <span key={tech} className="tech-badge text-xs">{tech}</span>
          ))}
          {project.techStack.length > 4 && (
            <span className="tech-badge text-xs">+{project.techStack.length - 4}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                aria-label="Live Demo"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          <button
            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
            onClick={onClick}
          >
            Case Study →
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [projects, setProjects]         = useState<Project[]>([])
  const [loading, setLoading]           = useState(true)
  const [activeCategory, setActive]     = useState('All')
  const [selectedProject, setSelected] = useState<Project | null>(null)

  useEffect(() => {
    fetchData<Project[]>('/data/projects.json')
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="projects" className="py-24 relative">
      <div
        className="absolute inset-0 opacity-10 dark:opacity-20"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(168,85,247,0.3) 0%, transparent 60%)' }}
      />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            A collection of projects that showcase my skills across web, mobile, AI, and DevOps domains.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'glass-card text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white hover:border-primary-500/30'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-2 text-xs opacity-60">
                  ({projects.filter(p => p.category === cat).length})
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden glass-card">
                <div className="skeleton h-40" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-5/6 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelected(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500 dark:text-gray-500"
          >
            No projects in this category yet.
          </motion.div>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelected(null)} />
    </section>
  )
}
