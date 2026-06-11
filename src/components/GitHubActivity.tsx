import { motion } from 'framer-motion'
import { Github, Star, GitFork, Circle, ExternalLink, AlertTriangle } from 'lucide-react'
import { useGitHub } from '../hooks/useGitHub'

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#ED8B00',
  Kotlin: '#7F52FF',
  Dart: '#00B4AB',
  'C#': '#9B4F96',
  PHP: '#777BB4',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Shell: '#89E051',
}

function RepoCard({ repo, index }: { repo: ReturnType<typeof useGitHub>['repos'][0]; index: number }) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#6366f1') : '#6b7280'

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-card rounded-2xl p-5 hover:border-primary-500/30 transition-all duration-300 group flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Github size={18} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
          <span className="font-semibold text-gray-200 group-hover:text-white transition-colors text-sm">
            {repo.name}
          </span>
        </div>
        <ExternalLink size={14} className="text-gray-600 group-hover:text-primary-400 transition-colors shrink-0 ml-2" />
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
        {repo.description ?? 'No description available'}
      </p>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {repo.topics.slice(0, 3).map(topic => (
            <span key={topic} className="text-xs px-2 py-0.5 rounded-full bg-primary-900/50 text-primary-400 border border-primary-700/30">
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-white/5">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <Circle size={10} style={{ color: langColor, fill: langColor }} />
            <span>{repo.language}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Star size={12} className="text-yellow-500" />
          <span>{repo.stargazers_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork size={12} className="text-gray-500" />
          <span>{repo.forks_count}</span>
        </div>
        <span className="ml-auto text-gray-600 text-xs">
          {new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </motion.a>
  )
}

function RepoSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="skeleton h-px w-full rounded mt-auto" />
      <div className="skeleton h-3 w-1/3 rounded" />
    </div>
  )
}

export default function GitHubActivity() {
  const { repos, loading, error, rateLimited } = useGitHub('Dilshan-Nadeeranga', 6)

  return (
    <section id="github" className="py-24 relative">
      <div className="absolute inset-0 opacity-15"
        style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.2) 0%, transparent 60%)' }} />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">Open Source</span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            GitHub <span className="gradient-text">Activity</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Latest public repositories — real-time data fetched from the GitHub API.
          </p>

          <motion.a
            href="https://github.com/Dilshan-Nadeeranga"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 mt-6 btn-secondary text-sm"
          >
            <Github size={16} />
            View Full Profile
          </motion.a>
        </motion.div>

        {rateLimited && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto mb-8 p-4 rounded-xl glass-card border-amber-500/20 text-center"
          >
            <AlertTriangle size={24} className="text-amber-400 mx-auto mb-2" />
            <p className="text-amber-300 text-sm font-medium">GitHub API rate limit reached</p>
            <p className="text-gray-400 text-xs mt-1">Please try again in a few minutes.</p>
          </motion.div>
        )}

        {error && !rateLimited && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto mb-8 p-4 rounded-xl glass-card border-red-500/20 text-center"
          >
            <p className="text-red-400 text-sm">Failed to load GitHub repositories</p>
            <a
              href="https://github.com/Dilshan-Nadeeranga"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 text-xs mt-1 hover:text-primary-300"
            >
              View profile directly →
            </a>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? [...Array(6)].map((_, i) => <RepoSkeleton key={i} />)
            : repos.map((repo, i) => <RepoCard key={repo.id} repo={repo} index={i} />)
          }
        </div>

        {/* GitHub Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card rounded-2xl p-6 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">GitHub Contribution Stats</p>
          <img
            src="https://github-readme-stats.vercel.app/api?username=Dilshan-Nadeeranga&show_icons=true&theme=transparent&title_color=6366f1&text_color=9ca3af&icon_color=a855f7&border_color=ffffff20&hide_border=false"
            alt="GitHub Stats"
            loading="lazy"
            className="mx-auto rounded-xl max-w-full"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
