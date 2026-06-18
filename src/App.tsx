import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import Layout from '@/components/layout/Layout'
import CommandPalette from '@/components/ui/CommandPalette'
import { PageLoader } from '@/components/ui/LoadingSpinner'

// Lazy-load every page — each becomes its own JS chunk
const HomePage          = lazy(() => import('@/pages/HomePage'))
const AboutPage         = lazy(() => import('@/pages/AboutPage'))
const SkillsPage        = lazy(() => import('@/pages/SkillsPage'))
const ProjectsPage      = lazy(() => import('@/pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'))
const OpenSourcePage    = lazy(() => import('@/pages/OpenSourcePage'))
const AchievementsPage  = lazy(() => import('@/pages/AchievementsPage'))
const CertificatesPage  = lazy(() => import('@/pages/CertificatesPage'))
const GalleryPage       = lazy(() => import('@/pages/GalleryPage'))
const ResumePage        = lazy(() => import('@/pages/ResumePage'))
const ContactPage       = lazy(() => import('@/pages/ContactPage'))
const AdminPage         = lazy(() => import('@/pages/admin/AdminPage'))

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
            error:   { iconTheme: { primary: '#f87171', secondary: '#16161e' } },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/" element={<PortfolioLayout><HomePage /></PortfolioLayout>} />
            <Route path="/about" element={<PortfolioLayout><AboutPage /></PortfolioLayout>} />
            <Route path="/skills" element={<PortfolioLayout><SkillsPage /></PortfolioLayout>} />
            <Route path="/projects" element={<PortfolioLayout><ProjectsPage /></PortfolioLayout>} />
            <Route path="/projects/:slug" element={<PortfolioLayout><ProjectDetailPage /></PortfolioLayout>} />
            <Route path="/open-source" element={<PortfolioLayout><OpenSourcePage /></PortfolioLayout>} />
            <Route path="/achievements" element={<PortfolioLayout><AchievementsPage /></PortfolioLayout>} />
            <Route path="/certificates" element={<PortfolioLayout><CertificatesPage /></PortfolioLayout>} />
            <Route path="/gallery" element={<PortfolioLayout><GalleryPage /></PortfolioLayout>} />
            <Route path="/resume" element={<PortfolioLayout><ResumePage /></PortfolioLayout>} />
            <Route path="/contact" element={<PortfolioLayout><ContactPage /></PortfolioLayout>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
