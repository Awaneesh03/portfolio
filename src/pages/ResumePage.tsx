import { motion } from 'framer-motion'
import ResumeSection from '@/components/sections/ResumeSection'

export default function ResumePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <ResumeSection />
    </motion.div>
  )
}
