interface BadgeProps {
  children: string
  color?: string
}

export default function Badge({ children, color }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: color ? `${color}15` : 'rgba(124,58,237,0.15)',
        color: color || '#fbbf24',
        border: `1px solid ${color ? `${color}30` : 'rgba(124,58,237,0.3)'}`,
      }}
    >
      {children}
    </span>
  )
}
