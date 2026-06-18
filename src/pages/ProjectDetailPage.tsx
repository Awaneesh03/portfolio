import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, CheckCircle2, Folder, Calendar, User, Layers } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import Badge from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'
import { FALLBACK_PROJECTS, PROJECT_DETAILS } from '@/data'
import type { Project } from '@/types'

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Live: 'bg-green-500/15 text-green-400 border-green-500/30',
    'In Progress': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${colors[status] ?? colors['Completed']}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Live' ? 'bg-green-400 animate-pulse' : status === 'In Progress' ? 'bg-amber-400' : 'bg-blue-400'}`} />
      {status}
    </span>
  )
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null | undefined>(undefined)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single()
        if (data) {
          setProject(data as Project)
        } else {
          setProject(FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null)
        }
      } catch {
        setProject(FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null)
      }
    }
    load()
  }, [slug])

  // loading
  if (project === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  // not found
  if (project === null) return <Navigate to="/projects" replace />

  const extras = PROJECT_DETAILS[project.id]
  const otherProjects = FALLBACK_PROJECTS.filter((p) => p.id !== project.id).slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-400 transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to projects
        </Link>
      </motion.div>

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-amber-900/20 via-slate-900 to-slate-900"
        style={{ aspectRatio: '16/7' }}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Folder size={80} className="text-amber-500/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {project.featured && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wide">
            Startup Project
          </div>
        )}
      </motion.div>

      {/* Title row + CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            {project.title}
          </h1>
          {extras && <StatusPill status={extras.status} />}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 hover:border-amber-500/40 text-gray-300 hover:text-white text-sm font-medium transition-all"
            >
              <GithubIcon size={15} />
              View Code
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-all"
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </motion.div>

      {/* Meta row */}
      {extras && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10"
        >
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <User size={16} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Role</p>
              <p className="text-white text-sm font-medium">{extras.role}</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <Calendar size={16} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Year</p>
              <p className="text-white text-sm font-medium">{extras.year}</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
            <Layers size={16} className="text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-500 text-xs mb-0.5">Stack</p>
              <p className="text-white text-sm font-medium truncate">{project.tech_stack.slice(0, 3).join(', ')}{project.tech_stack.length > 3 ? '…' : ''}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content: description + features | tech sidebar */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-8 mb-16">
        {/* Left: about + features */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {/* About */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">About this project</h2>
            <p className="text-gray-300 leading-relaxed text-[15px]">
              {project.long_description || project.description}
            </p>
          </div>

          {/* Features */}
          {extras?.features && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5">What I built</h2>
              <ul className="space-y-3">
                {extras.features.map((feat, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed"
                  >
                    <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    {feat}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Right sidebar: tech stack */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-5"
        >
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>

          {project.github_url && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Repository</h3>
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors text-sm group"
              >
                <GithubIcon size={16} className="flex-shrink-0" />
                <span className="truncate group-hover:text-amber-400 transition-colors">
                  {project.github_url.replace('https://github.com/', '')}
                </span>
                <ExternalLink size={12} className="flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          )}

          {project.live_url && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Live Site</h3>
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors text-sm group"
              >
                <ExternalLink size={14} className="flex-shrink-0 text-amber-400" />
                <span className="truncate group-hover:text-amber-400 transition-colors">
                  {project.live_url.replace('https://', '')}
                </span>
              </a>
            </div>
          )}
        </motion.aside>
      </div>

      {/* Other projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-white mb-6">Other Projects</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={p.slug ? `/projects/${p.slug}` : '/projects'}
                className="glass rounded-xl overflow-hidden flex flex-col group hover:border-amber-500/25 transition-all h-full block"
              >
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-amber-900/10 to-slate-900 flex-shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Folder size={32} className="text-amber-500/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm group-hover:text-amber-300 transition-colors mb-1">{p.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2">{p.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
