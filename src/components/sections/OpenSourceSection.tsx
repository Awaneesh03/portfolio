import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GitFork, Star, ExternalLink, Code2, Users, BookOpen } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import SectionHeader from '@/components/ui/SectionHeader'
import { PERSONAL_INFO } from '@/data'

interface GithubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  fork: boolean
}

interface GithubUser {
  public_repos: number
  followers: number
  following: number
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  Rust: '#dea584',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

export default function OpenSourceSection() {
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [user, setUser] = useState<GithubUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = 'Awaneesh03'

    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((r) => r.json()),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`).then((r) => r.json()),
    ])
      .then(([userData, repoData]) => {
        if (!userData.message) setUser(userData)
        if (Array.isArray(repoData)) {
          const ownRepos = (repoData as GithubRepo[]).filter((r) => !r.fork).slice(0, 6)
          setRepos(ownRepos)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Public Repos', value: user?.public_repos ?? '—', icon: BookOpen, color: '#fbbf24' },
    { label: 'Followers', value: user?.followers ?? '—', icon: Users, color: '#34d399' },
    { label: 'Following', value: user?.following ?? '—', icon: Users, color: '#60a5fa' },
  ]

  return (
    <section id="open-source" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Open Source"
          title="My GitHub Activity"
          subtitle="Building in public — real repositories, real code, real progress"
        />

        {/* GitHub profile link */}
        <motion.a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -3 }}
          className="flex items-center gap-4 glass rounded-2xl p-5 mb-8 hover:border-amber-500/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
            <GithubIcon size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold">github.com/Awaneesh03</p>
            <p className="text-gray-500 text-sm">View full profile and contribution history</p>
          </div>
          <ExternalLink size={16} className="text-gray-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
        </motion.a>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 text-center"
            >
              <Icon size={24} className="mx-auto mb-2" style={{ color }} />
              <div className="text-2xl font-bold text-white mb-1">{String(value)}</div>
              <div className="text-gray-400 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Repos grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-white/5 rounded mb-3 w-2/3" />
                <div className="h-3 bg-white/5 rounded mb-2" />
                <div className="h-3 bg-white/5 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : repos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo, i) => {
              const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? '#8b8ba8') : '#8b8ba8'
              return (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-5 flex flex-col gap-3 hover:border-amber-500/25 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Code2 size={15} className="text-amber-400 flex-shrink-0" />
                      <span className="text-white font-semibold text-sm truncate group-hover:text-amber-300 transition-colors">
                        {repo.name}
                      </span>
                    </div>
                    <ExternalLink size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5" />
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">
                    {repo.description ?? 'No description provided'}
                  </p>

                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-gray-500 text-xs">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColor }} />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={11} />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={11} />
                      {repo.forks_count}
                    </span>
                  </div>
                </motion.a>
              )
            })}
          </div>
        ) : (
          <div className="glass rounded-2xl p-10 text-center">
            <GithubIcon size={48} className="text-amber-500/20 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Could not load repositories. Visit GitHub to see all projects.</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-amber-400 hover:text-amber-300 text-sm font-medium transition-all hover:scale-105 border border-amber-500/20"
          >
            <GithubIcon size={15} />
            View all repositories on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
