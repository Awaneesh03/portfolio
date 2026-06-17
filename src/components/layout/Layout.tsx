import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
