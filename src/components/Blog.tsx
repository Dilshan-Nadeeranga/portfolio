import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, Tag, X, ArrowLeft, BookOpen } from 'lucide-react'
import { useBlogList, useBlogPost, type BlogPost } from '../hooks/useMarkdown'

function BlogCard({ post, onClick }: { post: BlogPost; onClick: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className="glass-card rounded-2xl p-6 cursor-pointer hover:border-primary-500/30 transition-all duration-300 group"
      data-cursor-hover
    >
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map(tag => (
          <span key={tag} className="tech-badge text-xs">
            <Tag size={10} className="inline mr-1" />{tag}
          </span>
        ))}
      </div>

      <h3 className="font-bold text-lg text-white group-hover:text-primary-300 transition-colors mb-2 leading-snug">
        {post.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readingTime} min read
          </span>
        </div>
        <span className="text-primary-400 text-xs font-medium group-hover:text-primary-300 transition-colors">
          Read more →
        </span>
      </div>
    </motion.article>
  )
}

function BlogPostView({ slug, onBack }: { slug: string; onBack: () => void }) {
  const { post, loading, error } = useBlogPost(slug)

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </button>

      {loading && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="skeleton h-10 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/3 rounded" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-4 rounded" style={{ width: `${75 + Math.random() * 25}%` }} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-gray-500">
          <p>Failed to load blog post.</p>
        </div>
      )}

      {post && (
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="tech-badge text-xs">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-black gradient-text mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime} min read
              </span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            />
          </div>
        </article>
      )}
    </motion.div>
  )
}

export default function Blog() {
  const { posts, loading, error } = useBlogList()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  return (
    <section id="blog" className="py-24 relative">
      <div className="absolute inset-0 opacity-15"
        style={{ background: 'radial-gradient(ellipse at center right, rgba(168,85,247,0.2) 0%, transparent 60%)' }} />

      <div className="section-container relative z-10">
        <AnimatePresence mode="wait">
          {!selectedSlug ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">Insights</span>
                <h2 className="text-4xl md:text-5xl font-black mb-4">
                  Blog & <span className="gradient-text">Learnings</span>
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto">
                  Technical deep-dives, lessons learned from real projects, and insights on modern software engineering.
                </p>
              </motion.div>

              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass-card rounded-2xl p-6 space-y-3">
                      <div className="skeleton h-3 w-2/3 rounded" />
                      <div className="skeleton h-5 w-full rounded" />
                      <div className="skeleton h-4 w-5/6 rounded" />
                      <div className="skeleton h-4 w-4/5 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center py-16 text-gray-500">
                  <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Could not load blog posts</p>
                </div>
              )}

              {!loading && posts.length === 0 && !error && (
                <div className="text-center py-16 text-gray-500">
                  <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No blog posts yet</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <BlogCard key={post.slug} post={post} onClick={() => setSelectedSlug(post.slug)} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="post">
              <BlogPostView slug={selectedSlug} onBack={() => setSelectedSlug(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
