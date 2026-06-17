import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  delay?: number
}

export default function Card({ children, className = '', hover = true, glow = false, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={`glass rounded-2xl p-6 transition-all duration-300 ${glow ? 'hover:glow' : 'hover:border-amber-500/20'} ${className}`}
    >
      {children}
    </motion.div>
  )
}
