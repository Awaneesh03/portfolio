import { motion } from 'framer-motion'
import { Mail, ArrowDown, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { PERSONAL_INFO } from '@/data'
import { useEffect, useState } from 'react'
import { useAvailability } from '@/hooks/useAvailability'

const ROLES = [
  'Full Stack Developer',
  'AI & ML Enthusiast',
  'Open Source Contributor',
  'Problem Solver',
]

function useTypewriter(texts: string[], speed = 75, pause = 1800) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!deleting && subIndex === texts[index].length) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((p) => (p + 1) % texts.length)
      return
    }
    const t = setTimeout(
      () => setSubIndex((p) => p + (deleting ? -1 : 1)),
      deleting ? speed / 2 : speed,
    )
    return () => clearTimeout(t)
  }, [subIndex, index, deleting, texts, speed, pause])

  return texts[index].substring(0, subIndex)
}

export default function Hero() {
  const role = useTypewriter(ROLES)
  const availability = useAvailability()

  const socials = [
    { icon: GithubIcon, href: PERSONAL_INFO.github, label: 'GitHub' },
    { icon: LinkedinIcon, href: PERSONAL_INFO.linkedin, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${PERSONAL_INFO.email}`, label: 'Email' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background — warm diagonal gradient, no AI particle soup */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 15% 30%, rgba(245,158,11,0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 70%, rgba(239,68,68,0.07) 0%, transparent 55%)',
          }}
        />
        {/* Fine dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,220,100,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass text-sm font-medium mb-8 tracking-wide transition-colors ${
            availability.available
              ? 'border border-amber-500/25 text-amber-300/80'
              : 'border border-white/10 text-gray-500'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {availability.available && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                availability.available ? 'bg-green-400' : 'bg-gray-600'
              }`}
            />
          </span>
          {availability.label}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight"
        >
          <span className="text-white">Hi, I'm </span>
          <span className="gradient-text">Awaneesh</span>
          <br />
          <span className="text-white">Gupta</span>
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="h-8 flex items-center justify-center mb-5"
        >
          <span className="text-amber-300 text-lg font-medium font-mono">
            {role}
            <span className="animate-pulse text-amber-500">|</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {['B.Tech CSE (AI) Student', 'Full Stack Developer', 'Open Source Enthusiast'].map((tag) => (
            <span key={tag} className="px-3 py-1.5 rounded-full glass text-gray-300 text-sm border border-white/10">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 text-balance"
        >
          Building the future with AI and code. Passionate about creating impactful software at the intersection of machine learning and full-stack development.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all hover:scale-105 glow-sm"
          >
            View Projects
          </Link>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 px-6 py-3 glass border border-amber-500/30 hover:border-amber-500/60 text-amber-400 hover:text-amber-300 font-semibold rounded-xl transition-all hover:scale-105"
          >
            <Download size={16} />
            Resume
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 glass text-gray-400 hover:text-white font-semibold rounded-xl transition-all hover:scale-105 border border-white/10"
          >
            Contact Me
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          {socials.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-11 h-11 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-600"
          >
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
