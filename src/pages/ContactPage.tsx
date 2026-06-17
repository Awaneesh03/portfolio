import { motion } from 'framer-motion'
import ContactSection from '@/components/sections/ContactSection'

export default function ContactPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <ContactSection />
    </motion.div>
  )
}
