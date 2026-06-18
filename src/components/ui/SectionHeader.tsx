import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  tag?: string
  title: string
  subtitle?: string
  gradient?: boolean
  center?: boolean
  children?: ReactNode
}

export default function SectionHeader({ tag, title, subtitle, gradient = false, center = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-14 ${center ? 'text-center' : ''}`}
    >
      {tag && (
        <p className={`text-xs font-mono uppercase tracking-widest text-gray-600 mb-3 ${center ? '' : ''}`}>
          {tag}
        </p>
      )}
      <h2 className={`text-3xl sm:text-4xl font-bold mb-3 ${gradient ? 'gradient-text' : 'text-white'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-gray-500 text-base leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
