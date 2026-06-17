import { motion } from 'framer-motion'
import GallerySection from '@/components/sections/GallerySection'

export default function GalleryPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <GallerySection />
    </motion.div>
  )
}
