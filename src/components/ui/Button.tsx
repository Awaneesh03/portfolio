import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  children: ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  loading,
  disabled,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-500 text-white glow-sm',
    secondary: 'glass border-amber-500/30 hover:border-amber-500/60 text-amber-400 hover:text-amber-300',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </motion.button>
  )
}
