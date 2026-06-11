import { useEffect, useId, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchData } from '../utils/fetchData'

interface Skill {
  name: string
  icon: string
  proficiency: number
  category: string
}

const TECH_COLORS: Record<string, string> = {
  react:      '#0BA5C7', // darkened from #61DAFB — too light on white
  typescript: '#3178C6',
  javascript: '#D4A800', // darkened from #F7DF1E for visibility on light bg
  nodejs:     '#3D8A3D',
  python:     '#3776AB',
  dotnet:     '#512BD4',
  csharp:     '#9B4F96',
  docker:     '#2496ED',
  kubernetes: '#326CE5',
  mongodb:    '#47A248',
  postgresql: '#336791',
  mssql:      '#CC2927',
  flutter:    '#027DFD',
  kotlin:     '#7F52FF',
  firebase:   '#E8950A', // darkened from #FFCA28
  tailwind:   '#0694A2',
  git:        '#E05C2A',
  express:    '#4B5563', // was #FFFFFF — invisible on any bg
  aspnet:     '#512BD4',
  java:       '#ED8B00',
  figma:      '#F24E1E',
  gemini:     '#4285F4',
}

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'from-cyan-500 to-blue-500',
  Backend:  'from-emerald-500 to-teal-500',
  DevOps:   'from-orange-500 to-red-500',
  Database: 'from-green-500 to-emerald-500',
  Mobile:   'from-purple-500 to-pink-500',
  Language: 'from-yellow-600 to-orange-500',
  Design:   'from-pink-500 to-rose-500',
  AI:       'from-violet-500 to-purple-500',
}

interface OrbitRingProps {
  skills: Skill[]
  radius: number
  speed: number
  reverse?: boolean
  gradientId: string
}

function OrbitRing({ skills, radius, speed, reverse = false, gradientId }: OrbitRingProps) {
  const circumference = 2 * Math.PI * radius
  const [hoveredSkill, setHovered] = useState<string | null>(null)

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      style={{
        width:  radius * 2,
        height: radius * 2,
        left:   `calc(50% - ${radius}px)`,
        top:    `calc(50% - ${radius}px)`,
      }}
    >
      {skills.map((skill, i) => {
        const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2
        const x     = Math.cos(angle) * radius
        const y     = Math.sin(angle) * radius
        const color = TECH_COLORS[skill.icon] ?? '#6366f1'
        const isHov = hoveredSkill === skill.name

        return (
          <motion.div
            key={skill.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            animate={{ rotate: reverse ? 360 : -360 }}
            transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
            whileHover={{ scale: 1.35, zIndex: 10 }}
            onHoverStart={() => setHovered(skill.name)}
            onHoverEnd={() => setHovered(null)}
          >
            <div className="relative group">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                style={{
                  background:  `${color}22`,
                  border:      `2px solid ${color}60`,
                  boxShadow:   isHov ? `0 0 18px ${color}70` : 'none',
                }}
              >
                <span className="text-[11px] font-bold font-mono leading-none" style={{ color }}>
                  {skill.name.slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                <div className="glass-card rounded-lg px-3 py-1.5 text-xs shadow-xl">
                  <div className="font-semibold text-gray-900 dark:text-white">{skill.name}</div>
                  <div className="text-gray-500 dark:text-gray-400">{skill.proficiency}% proficiency</div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Dashed ring */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={radius * 2}
        height={radius * 2}
        style={{ opacity: 0.18 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle
          cx={radius} cy={radius} r={radius - 6}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          strokeDasharray={`${circumference * 0.65} ${circumference * 0.35}`}
        />
      </svg>
    </motion.div>
  )
}

export default function TechOrbit() {
  const [skills, setSkills]               = useState<Skill[]>([])
  const [selectedCategory, setCategory]   = useState<string>('All')
  const [loading, setLoading]             = useState(true)
  const uid = useId()

  useEffect(() => {
    fetchData<Skill[]>('/data/skills.json')
      .then(setSkills)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))]
  const filtered   = selectedCategory === 'All' ? skills : skills.filter(s => s.category === selectedCategory)
  const ring1      = filtered.slice(0, Math.ceil(filtered.length / 2))
  const ring2      = filtered.slice(Math.ceil(filtered.length / 2))

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 dark:opacity-30"
        style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
      />

      <div className="section-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Arsenal
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
            <span className="gradient-text">Tech Stack</span> &amp; Skills
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Technologies I work with daily – from full-stack web to DevOps and mobile development.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'glass-card text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white hover:border-primary-500/30'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="relative mx-auto" style={{ width: 480, height: 480, maxWidth: '100%' }}>
            {/* Center badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            >
              <div className="text-center glass-card rounded-2xl p-6 neumorphic pointer-events-auto">
                <div className="text-3xl font-black gradient-text">{filtered.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Technologies</div>
                <div className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">{selectedCategory}</div>
              </div>
            </motion.div>

            {ring1.length > 0 && (
              <OrbitRing skills={ring1} radius={200} speed={30} gradientId={`${uid}-r1`} />
            )}
            {ring2.length > 0 && (
              <OrbitRing skills={ring2} radius={145} speed={20} reverse gradientId={`${uid}-r2`} />
            )}
          </div>
        )}

        {/* Skill bars grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((skill, i) => {
            const color = TECH_COLORS[skill.icon] ?? '#6366f1'
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl p-4 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {/* Icon chip */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0"
                      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                    >
                      {skill.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{skill.name}</span>
                  </div>
                  <span className="text-xs font-mono text-primary-600 dark:text-primary-400 shrink-0">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.04, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_COLORS[skill.category] ?? 'from-primary-500 to-accent-purple'}`}
                  />
                </div>

                <div className="mt-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-500">{skill.category}</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
