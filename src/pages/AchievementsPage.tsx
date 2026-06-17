import { motion } from 'framer-motion'
import AchievementsSection from '@/components/sections/AchievementsSection'

export default function AchievementsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <AchievementsSection />
    </motion.div>
  )
}
