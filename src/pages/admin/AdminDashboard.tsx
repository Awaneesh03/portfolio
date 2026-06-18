import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactElement } from 'react'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard, FolderOpen, Award, Image, Zap, Trophy, FileText,
  LogOut, Menu, X, Code2, ChevronRight, MessageSquare, Settings
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import ProjectsPanel from './panels/ProjectsPanel'
import CertificatesPanel from './panels/CertificatesPanel'
import GalleryPanel from './panels/GalleryPanel'
import SkillsPanel from './panels/SkillsPanel'
import AchievementsPanel from './panels/AchievementsPanel'
import ResumePanel from './panels/ResumePanel'
import MessagesPanel from './panels/MessagesPanel'
import SettingsPanel from './panels/SettingsPanel'

type Panel = 'overview' | 'projects' | 'certificates' | 'gallery' | 'skills' | 'achievements' | 'resume' | 'messages' | 'settings'

const navItems: { id: Panel; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function OverviewPanel({ onNavigate }: { onNavigate: (panel: Panel) => void }) {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ projects: 0, certificates: 0, gallery: 0, unread: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('certificates').select('id', { count: 'exact', head: true }),
      supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
    ]).then(([p, c, g, m]) => {
      setCounts({
        projects: p.count ?? 0,
        certificates: c.count ?? 0,
        gallery: g.count ?? 0,
        unread: m.count ?? 0,
      })
    })
  }, [])

  const quickStats = [
    { label: 'Active Projects', value: String(counts.projects), color: '#fbbf24', icon: FolderOpen },
    { label: 'Certificates', value: String(counts.certificates), color: '#60a5fa', icon: Award },
    { label: 'Gallery Images', value: String(counts.gallery), color: '#34d399', icon: Image },
    { label: 'Unread Messages', value: String(counts.unread), color: '#fb923c', icon: MessageSquare },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">
          Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] ?? 'Admin'} 👋
        </h2>
        <p className="text-gray-400 text-sm">Here's an overview of your portfolio content</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-gray-500 text-sm mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-5">
        <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {navItems.slice(1).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors w-full text-left"
            >
              <Icon size={16} className="text-amber-400" />
              <span className="text-gray-300 text-sm">Manage {label}</span>
              <ChevronRight size={14} className="text-gray-600 ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState<Panel>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()

  const panels: Record<Panel, ReactElement> = {
    overview: <OverviewPanel onNavigate={setActivePanel} />,
    projects: <ProjectsPanel />,
    certificates: <CertificatesPanel />,
    gallery: <GalleryPanel />,
    skills: <SkillsPanel />,
    achievements: <AchievementsPanel />,
    resume: <ResumePanel />,
    messages: <MessagesPanel />,
    settings: <SettingsPanel />,
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          className="fixed lg:static z-50 lg:z-auto h-full lg:h-screen w-72 glass border-r border-white/5 flex flex-col lg:translate-x-0"
          style={{ minHeight: '100vh' }}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
                <Code2 size={14} className="text-white" />
              </div>
              <span className="font-bold text-white text-sm">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActivePanel(id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activePanel === id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-3">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.email?.[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{user?.user_metadata?.full_name ?? user?.email}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-600/10 text-sm transition-all"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </motion.aside>
      </>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <div className="h-16 glass border-b border-white/5 flex items-center justify-between px-5 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Menu size={18} />
            </button>
            <h1 className="font-semibold text-white">
              {navItems.find((n) => n.id === activePanel)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-amber-400 transition-colors"
          >
            View portfolio ↗
          </a>
        </div>

        {/* Panel content */}
        <div className="flex-1 p-5 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {panels[activePanel]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
