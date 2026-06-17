import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  tag?: string
  title: string
  subtitle?: string
  gradient?: boolean
  children?: ReactNode
}

export default function SectionHeader({ tag, title, subtitle, gradient = true }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      {tag && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
          {tag}
        </div>
      )}
      <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${gradient ? 'gradient-text' : 'text-white'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-lg max-w-2xl mx-auto text-balance">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
