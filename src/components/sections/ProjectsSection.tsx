import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star, Folder } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import SectionHeader from '@/components/ui/SectionHeader'
import Badge from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types'

const FALLBACK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'IdeaForge',
    description: 'AI-powered idea management platform with smart categorization, brainstorming assistance, and team collaboration features built with Spring Boot and React.',
    long_description: '',
    tech_stack: ['React', 'Spring Boot', 'PostgreSQL', 'OpenAI API', 'JWT'],
    github_url: 'https://github.com/awaneeshgupta/ideaforge',
    live_url: '',
    image_url: '',
    featured: true,
    order_index: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Serina AI Assistant',
    description: 'Conversational AI assistant with context memory, multi-model support, and a beautiful chat interface. Features real-time streaming responses and custom personas.',
    long_description: '',
    tech_stack: ['React', 'FastAPI', 'Python', 'LangChain', 'Supabase'],
    github_url: 'https://github.com/awaneeshgupta/serina',
    live_url: '',
    image_url: '',
    featured: true,
    order_index: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Portfolio v2',
    description: 'This very portfolio! A production-grade developer portfolio with admin dashboard, Supabase backend, and stunning animations built with React + TypeScript.',
    long_description: '',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
    github_url: 'https://github.com/awaneeshgupta/portfolio',
    live_url: '',
    image_url: '',
    featured: false,
    order_index: 3,
    created_at: '',
    updated_at: '',
  },
]

interface ProjectCardProps {
  project: Project
  index: number
}

function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="glass rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all duration-300"
    >
      {/* Image / placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-900/20 via-blue-900/20 to-slate-900">
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
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
            <Star size={10} fill="currentColor" />
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-amber-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {project.tech_stack.length > 4 && (
            <Badge>{`+${project.tech_stack.length - 4}`}</Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
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
              Live Demo
            </a>
          )}
        </div>
      </div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
