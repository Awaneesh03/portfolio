import { motion } from 'framer-motion'
import OpenSourceSection from '@/components/sections/OpenSourceSection'

export default function OpenSourcePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <OpenSourceSection />
    </motion.div>
  )
}
