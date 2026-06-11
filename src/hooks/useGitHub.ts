import { useState, useEffect } from 'react'

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  homepage: string | null
}

interface UseGitHubReturn {
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
  rateLimited: boolean
}

export function useGitHub(username: string, count = 6): UseGitHubReturn {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem(`github-repos-${username}`)
    if (cached) {
      try {
        setRepos(JSON.parse(cached))
        setLoading(false)
        return
      } catch {
        // ignore parse errors, re-fetch
      }
    }

    const controller = new AbortController()

    async function fetchRepos() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=${count}&type=public`,
          { signal: controller.signal }
        )

        if (res.status === 403 || res.status === 429) {
          setRateLimited(true)
          setLoading(false)
          return
        }

        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)

        const data: GitHubRepo[] = await res.json()
        const sorted = data
          .sort((a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count)
          .slice(0, count)

        setRepos(sorted)
        sessionStorage.setItem(`github-repos-${username}`, JSON.stringify(sorted))
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Failed to load GitHub repositories')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
    return () => controller.abort()
  }, [username, count])

  return { repos, loading, error, rateLimited }
}
