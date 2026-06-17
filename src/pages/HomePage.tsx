import Hero from '@/components/sections/Hero'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import CodingProfilesSection from '@/components/sections/CodingProfilesSection'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function SeeMoreBanner({ to, label }: { to: string; label: string }) {
  return (
    <div className="flex justify-center pb-8">
      <Link
        to={to}
        className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-amber-400 hover:text-amber-300 text-sm font-medium transition-all hover:scale-105"
      >
        {label}
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <SeeMoreBanner to="/skills" label="View all skills" />
      <ProjectsSection limit={3} />
      <SeeMoreBanner to="/projects" label="View all projects" />
      <CodingProfilesSection />
    </motion.div>
  )
}
