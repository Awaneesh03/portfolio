import { motion } from 'framer-motion'
import ProjectsSection from '@/components/sections/ProjectsSection'

export default function ProjectsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <ProjectsSection />
    </motion.div>
  )
}
