import { motion } from 'framer-motion'
import { Mail, ArrowDown, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { useAvailability } from '@/hooks/useAvailability'
import { useProfile } from '@/hooks/useProfile'

export default function Hero() {
  const availability = useAvailability()
  const profile = useProfile()

  const socials = [
    { icon: GithubIcon,  href: profile.github,              label: 'GitHub' },
    { icon: LinkedinIcon,href: profile.linkedin,             label: 'LinkedIn' },
    { icon: Mail,        href: `mailto:${profile.email}`,    label: 'Email' },
  ]

  return (
    <section className="relative min-h-screen flex items-center px-4 sm:px-8 overflow-hidden">
      {/* Single soft warm glow — top-left corner only, very subtle */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '-5%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-5xl w-full mx-auto pt-28 pb-20 sm:pt-0 sm:pb-0">

        {/* Availability — plain text indicator, no pill/badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex items-center gap-2"
        >
          <span className="relative flex h-1.5 w-1.5">
            {availability.available && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${availability.available ? 'bg-green-400' : 'bg-gray-600'}`} />
          </span>
          <span className={`text-sm font-medium tracking-wide ${availability.available ? 'text-green-400' : 'text-gray-600'}`}>
            {availability.label}
          </span>
        </motion.div>

        {/* Name — huge, left-aligned, no gradient */}
        <div className="mb-8 overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-black text-white leading-[0.88] tracking-tighter select-none"
            style={{ fontSize: 'clamp(52px, 9.5vw, 112px)' }}
          >
            Awaneesh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="font-black leading-[0.88] tracking-tighter select-none"
            style={{ fontSize: 'clamp(52px, 9.5vw, 112px)', color: 'rgba(250,250,248,0.18)' }}
          >
            Gupta.
          </motion.p>
        </div>

        {/* Tagline with amber left-bar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-start gap-4 mb-10 max-w-lg"
        >
          <div className="w-0.5 h-14 bg-amber-500/50 flex-shrink-0 mt-1 rounded-full" />
          <div>
            <p className="text-gray-300 text-lg leading-relaxed">
              B.Tech CSE (AI) student building full-stack software at the intersection of AI and the web.
            </p>
            <p className="text-gray-600 text-sm mt-2 font-mono">
              Vedam School of Technology &nbsp;·&nbsp; India
            </p>
          </div>
        </motion.div>

        {/* CTAs + socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all text-sm"
          >
            See my work
          </Link>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 px-5 py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors border border-white/10 hover:border-white/20 rounded-xl"
          >
            <Download size={14} />
            Resume
          </Link>
          <Link
            to="/contact"
            className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors hidden sm:block"
          >
            Get in touch →
          </Link>

          {/* Socials pushed to the right */}
          <div className="flex items-center gap-2 sm:ml-auto">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -2 }}
                className="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors border border-white/5 hover:border-white/15"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-4 sm:left-8 flex items-center gap-2 text-gray-700"
        >
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown size={16} />
          </motion.div>
          <span className="text-xs font-mono tracking-wider">scroll</span>
        </motion.div>
      </div>
    </section>
  )
}
