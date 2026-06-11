import { useState, useEffect } from 'react'
import { marked, type Renderer } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import json from 'highlight.js/lib/languages/json'
import java from 'highlight.js/lib/languages/java'
import kotlin from 'highlight.js/lib/languages/kotlin'
import dart from 'highlight.js/lib/languages/dart'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import sql from 'highlight.js/lib/languages/sql'
import php from 'highlight.js/lib/languages/php'
import csharp from 'highlight.js/lib/languages/csharp'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('java', java)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('dart', dart)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('php', php)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('cs', csharp)

export interface BlogPost {
  slug: string
  file: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  readingTime: number
}

export interface BlogPostFull extends BlogPost {
  content: string
  htmlContent: string
}

// Use markedHighlight-style integration via marked.use for syntax highlighting
marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    code(this: Renderer, code: string, infostring: string | undefined): string {
      const lang = infostring ?? ''
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
      const highlighted = hljs.highlight(code, { language }).value
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
    },
  } as Partial<Renderer>,
})

export function useBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/blog/blog-manifest.json')
      .then(r => r.json())
      .then((data: BlogPost[]) => {
        const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setPosts(sorted)
      })
      .catch(() => setError('Failed to load blog posts'))
      .finally(() => setLoading(false))
  }, [])

  return { posts, loading, error }
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPostFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function load() {
      try {
        const manifestRes = await fetch('/blog/blog-manifest.json')
        const manifest: BlogPost[] = await manifestRes.json()
        const meta = manifest.find(p => p.slug === slug)
        if (!meta) throw new Error('Post not found')

        const mdRes = await fetch(meta.file)
        if (!mdRes.ok) throw new Error('Failed to load post')
        const raw = await mdRes.text()

        // Strip YAML frontmatter
        const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\n/, '')
        const htmlContent = await marked(withoutFrontmatter)

        setPost({ ...meta, content: withoutFrontmatter, htmlContent })
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [slug])

  return { post, loading, error }
}
