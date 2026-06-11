import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Award, MapPin, Calendar } from 'lucide-react'
import { fetchData } from '../utils/fetchData'

interface Experience {
  id: number
  type: 'work' | 'education'
  title: string
  company: string
  companyUrl: string
  location: string
  date: string
  descriptionPoints: string[]
  skills: string[]
}

interface Certification {
  id: number
  name: string
  issuer: string
  date: string
  status: string
  link: string
  icon: string
}

export default function Timeline() {
  const [experiences, setExperiences]     = useState<Experience[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading]             = useState(true)
  const [activeTab, setActiveTab]         = useState<'experience' | 'certifications'>('experience')

  useEffect(() => {
    Promise.all([
      fetchData<Experience[]>('/data/experience.json'),
      fetchData<Certification[]>('/data/certifications.json'),
    ])
      .then(([exp, certs]) => { setExperiences(exp); setCertifications(certs) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="experience" className="py-24 relative">
      <div
        className="absolute inset-0 opacity-10 dark:opacity-15"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(99,102,241,0.4) 0%, transparent 60%)' }}
      />

      <div className="section-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
            Experience &amp; <span className="gradient-text">Education</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            My professional journey, academic background, and continuous learning path.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {(['experience', 'certifications'] as const).map(tab => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab === 'experience' ? 'Timeline' : 'Certifications'}
            </motion.button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-36 rounded-2xl" />
            ))}
          </div>
        ) : activeTab === 'experience' ? (
          /* ── Timeline ─────────────────────────────────────────── */
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 via-accent-purple to-transparent" />

              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-16"
                  >
                    {/* Icon node */}
                    <div
                      className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        exp.type === 'work'
                          ? 'bg-gradient-to-br from-primary-600 to-accent-purple'
                          : 'bg-gradient-to-br from-accent-cyan to-emerald-500'
                      }`}
                      style={{
                        boxShadow: exp.type === 'work'
                          ? '0 0 20px rgba(99,102,241,0.4)'
                          : '0 0 20px rgba(6,182,212,0.4)',
                      }}
                    >
                      {exp.type === 'work'
                        ? <Briefcase size={20} className="text-white" />
                        : <GraduationCap size={20} className="text-white" />
                      }
                    </div>

                    {/* Card */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="glass-card rounded-2xl p-5 transition-all duration-300 hover:border-primary-500/30"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{exp.title}</h3>
                          <div className="mt-1">
                            {exp.companyUrl ? (
                              <a
                                href={exp.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors"
                              >
                                {exp.company}
                              </a>
                            ) : (
                              <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                                {exp.company}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
                            <Calendar size={12} />
                            <span>{exp.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
                            <MapPin size={12} />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-1.5 mb-4">
                        {exp.descriptionPoints.map((point, j) => (
                          <li key={j} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                            <span className="text-primary-500 dark:text-primary-400 mt-1.5 shrink-0">▸</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map(skill => (
                          <span key={skill} className="tech-badge text-xs">{skill}</span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Certifications ───────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
          >
            {certifications.map((cert, i) => (
              <motion.a
                key={cert.id}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="glass-card rounded-2xl p-5 hover:border-primary-500/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shrink-0">
                    <Award size={20} className="text-white" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    cert.status === 'Completed'
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                      : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mb-1 text-sm leading-snug">
                  {cert.name}
                </h3>
                <div className="text-xs text-gray-500">{cert.issuer}</div>
                <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">{cert.date}</div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
