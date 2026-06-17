import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search, Home, User, Code2, FolderGit2, GitPullRequest,
  Trophy, Award, Image, FileText, Mail, X, ArrowRight, Command,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { PERSONAL_INFO } from '@/data'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  group: string
  action: () => void
  keywords: string
}

function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return { open, setOpen }
}

export default function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIdx(0)
  }, [setOpen])

  const go = useCallback(
    (action: () => void) => {
      close()
      action()
    },
    [close],
  )

  const commands: CommandItem[] = [
    { id: 'home', label: 'Home', description: 'Back to the start', icon: <Home size={16} />, group: 'Navigate', action: () => navigate('/'), keywords: 'home start landing' },
    { id: 'about', label: 'About', description: 'Who I am', icon: <User size={16} />, group: 'Navigate', action: () => navigate('/about'), keywords: 'about me bio story' },
    { id: 'skills', label: 'Skills', description: 'My tech stack', icon: <Code2 size={16} />, group: 'Navigate', action: () => navigate('/skills'), keywords: 'skills tech stack languages tools' },
    { id: 'projects', label: 'Projects', description: 'Things I\'ve built', icon: <FolderGit2 size={16} />, group: 'Navigate', action: () => navigate('/projects'), keywords: 'projects work portfolio built' },
    { id: 'opensource', label: 'Open Source', description: 'My GitHub contributions', icon: <GitPullRequest size={16} />, group: 'Navigate', action: () => navigate('/open-source'), keywords: 'open source github contributions pr' },
    { id: 'achievements', label: 'Achievements', description: 'Milestones & wins', icon: <Trophy size={16} />, group: 'Navigate', action: () => navigate('/achievements'), keywords: 'achievements milestones wins' },
    { id: 'certificates', label: 'Certificates', description: 'My certifications', icon: <Award size={16} />, group: 'Navigate', action: () => navigate('/certificates'), keywords: 'certificates certifications courses' },
    { id: 'gallery', label: 'Gallery', description: 'Photos & memories', icon: <Image size={16} />, group: 'Navigate', action: () => navigate('/gallery'), keywords: 'gallery photos memories events' },
    { id: 'resume', label: 'Resume', description: 'View & download my CV', icon: <FileText size={16} />, group: 'Navigate', action: () => navigate('/resume'), keywords: 'resume cv download' },
    { id: 'contact', label: 'Contact', description: 'Get in touch with me', icon: <Mail size={16} />, group: 'Navigate', action: () => navigate('/contact'), keywords: 'contact reach out hire' },
    {
      id: 'github',
      label: 'GitHub',
      description: PERSONAL_INFO.github,
      icon: <GithubIcon size={16} />,
      group: 'Connect',
      action: () => window.open(PERSONAL_INFO.github, '_blank'),
      keywords: 'github code repos',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      description: PERSONAL_INFO.linkedin,
      icon: <LinkedinIcon size={16} />,
      group: 'Connect',
      action: () => window.open(PERSONAL_INFO.linkedin, '_blank'),
      keywords: 'linkedin network professional',
    },
    {
      id: 'email',
      label: 'Send Email',
      description: PERSONAL_INFO.email,
      icon: <Mail size={16} />,
      group: 'Connect',
      action: () => { window.location.href = `mailto:${PERSONAL_INFO.email}` },
      keywords: 'email contact mail',
    },
  ]

  const filtered = query.trim()
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.keywords.toLowerCase().includes(query.toLowerCase()) ||
        (c.description ?? '').toLowerCase().includes(query.toLowerCase()),
      )
    : commands

  const groups = Array.from(new Set(filtered.map((c) => c.group)))

  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx((p) => (p + 1) % filtered.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx((p) => (p - 1 + filtered.length) % filtered.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[activeIdx]) go(filtered[activeIdx].action)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, activeIdx, go])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  let globalIdx = -1

  return (
    <>
      {/* Trigger hint in navbar area — shown as a floating kbd hint */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2 glass rounded-xl text-gray-400 hover:text-amber-400 text-xs font-medium transition-all hover:border-amber-500/30 hover:scale-105 shadow-lg"
        title="Open command palette"
      >
        <Command size={13} />
        <span className="hidden sm:inline">Command palette</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={close}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
            >
              <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
                  <Search size={16} className="text-gray-500 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search pages, links, actions…"
                    className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="text-gray-600 hover:text-gray-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-600 text-[10px] font-mono flex-shrink-0">esc</kbd>
                </div>

                {/* Results */}
                <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
                  {filtered.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">No results for "{query}"</p>
                  ) : (
                    groups.map((group) => (
                      <div key={group}>
                        <p className="px-4 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-gray-600">
                          {group}
                        </p>
                        {filtered
                          .filter((c) => c.group === group)
                          .map((cmd) => {
                            globalIdx++
                            const idx = globalIdx
                            const isActive = idx === activeIdx
                            return (
                              <button
                                key={cmd.id}
                                data-idx={idx}
                                onClick={() => go(cmd.action)}
                                onMouseEnter={() => setActiveIdx(idx)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                  isActive ? 'bg-amber-500/10 text-white' : 'text-gray-300 hover:bg-white/5'
                                }`}
                              >
                                <span className={`flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-500'}`}>
                                  {cmd.icon}
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="text-sm font-medium block">{cmd.label}</span>
                                  {cmd.description && (
                                    <span className="text-xs text-gray-500 truncate block">{cmd.description}</span>
                                  )}
                                </span>
                                {isActive && (
                                  <ArrowRight size={14} className="text-amber-400 flex-shrink-0" />
                                )}
                              </button>
                            )
                          })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-4 text-[10px] text-gray-600">
                  <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                  <span><kbd className="font-mono">↵</kbd> open</span>
                  <span><kbd className="font-mono">esc</kbd> close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
