import { motion } from 'framer-motion'
import SkillsSection from '@/components/sections/SkillsSection'
import CodingProfilesSection from '@/components/sections/CodingProfilesSection'

export default function SkillsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <SkillsSection />
      <CodingProfilesSection />
    </motion.div>
  )
}
