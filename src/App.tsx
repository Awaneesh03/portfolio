import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import Layout from '@/components/layout/Layout'
import CommandPalette from '@/components/ui/CommandPalette'

import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import SkillsPage from '@/pages/SkillsPage'
import ProjectsPage from '@/pages/ProjectsPage'
import OpenSourcePage from '@/pages/OpenSourcePage'
import AchievementsPage from '@/pages/AchievementsPage'
import CertificatesPage from '@/pages/CertificatesPage'
import GalleryPage from '@/pages/GalleryPage'
import ResumePage from '@/pages/ResumePage'
import ContactPage from '@/pages/ContactPage'
import AdminPage from '@/pages/admin/AdminPage'

function PortfolioLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CommandPalette />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#16161e',
              color: '#f0f0ff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#16161e' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#16161e' } },
          }}
        />
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<PortfolioLayout><HomePage /></PortfolioLayout>} />
          <Route path="/about" element={<PortfolioLayout><AboutPage /></PortfolioLayout>} />
          <Route path="/skills" element={<PortfolioLayout><SkillsPage /></PortfolioLayout>} />
          <Route path="/projects" element={<PortfolioLayout><ProjectsPage /></PortfolioLayout>} />
          <Route path="/open-source" element={<PortfolioLayout><OpenSourcePage /></PortfolioLayout>} />
          <Route path="/achievements" element={<PortfolioLayout><AchievementsPage /></PortfolioLayout>} />
          <Route path="/certificates" element={<PortfolioLayout><CertificatesPage /></PortfolioLayout>} />
          <Route path="/gallery" element={<PortfolioLayout><GalleryPage /></PortfolioLayout>} />
          <Route path="/resume" element={<PortfolioLayout><ResumePage /></PortfolioLayout>} />
          <Route path="/contact" element={<PortfolioLayout><ContactPage /></PortfolioLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
