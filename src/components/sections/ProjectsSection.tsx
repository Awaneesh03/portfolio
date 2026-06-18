import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star, Folder, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIcon } from '@/components/ui/BrandIcons'
import SectionHeader from '@/components/ui/SectionHeader'
import Badge from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'
import { FALLBACK_PROJECTS } from '@/data'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number
  featured?: boolean
}

function ProjectCard({ project, index, featured }: ProjectCardProps) {
  const detailPath = project.slug ? `/projects/${project.slug}` : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className={`glass rounded-2xl overflow-hidden group transition-all duration-300 h-full flex flex-col ${
        featured
          ? 'hover:border-amber-500/40 border-amber-500/20'
          : 'hover:border-amber-500/25'
      }`}
    >
      {featured ? (
        /* ── Featured (MOTIF): side-by-side on sm+, stacked on xs ── */
        <div className="flex flex-col sm:flex-row h-full">
          <div className="relative sm:w-[52%] h-52 sm:h-auto overflow-hidden bg-gradient-to-br from-amber-900/20 via-slate-900 to-slate-900 flex-shrink-0">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Folder size={64} className="text-amber-500/30" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium">
              <Star size={10} fill="currentColor" />
              Startup Project
            </div>
            {/* gradient fades image into card body on desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--bg-card)] hidden sm:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent sm:hidden" />
          </div>

          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="font-black text-white text-xl sm:text-2xl tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <GithubIcon size={14} />
                  Code
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-all"
                >
                  <ExternalLink size={14} />
                  Live Demo
                </a>
              )}
              {detailPath && (
                <Link
                  to={detailPath}
                  className="flex items-center gap-1.5 text-sm text-amber-400/70 hover:text-amber-300 transition-colors ml-auto"
                >
                  Case study <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Regular card ── */
        <>
          <div className="relative h-44 overflow-hidden bg-gradient-to-br from-amber-900/10 via-blue-900/10 to-slate-900 flex-shrink-0">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Folder size={48} className="text-amber-500/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-amber-300 transition-colors">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
              {project.tech_stack.length > 4 && (
                <Badge>{`+${project.tech_stack.length - 4}`}</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-auto">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <GithubIcon size={14} />
                  Code
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <ExternalLink size={14} />
                  Live
                </a>
              )}
              {detailPath && (
                <Link
                  to={detailPath}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-400 transition-colors ml-auto"
                >
                  Details <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default function ProjectsSection({ limit }: { limit?: number }) {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('order_index')
      .then(({ data }) => {
        if (data && data.length > 0) setProjects(data)
      })
  }, [])

  const displayed = limit ? projects.slice(0, limit) : projects

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Projects"
          title="What I've Built"
          subtitle="A selection of projects that showcase my skills and passion for building great software"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayed.map((project, i) => (
            <div
              key={project.id}
              className={project.featured ? 'md:col-span-2 lg:col-span-2' : ''}
            >
              <ProjectCard project={project} index={i} featured={project.featured} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
