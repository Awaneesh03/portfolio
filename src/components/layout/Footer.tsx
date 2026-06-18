import { Mail, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { PERSONAL_INFO } from '@/data'

export default function Footer() {
  const socials = [
    { icon: GithubIcon, href: PERSONAL_INFO.github, label: 'GitHub' },
    { icon: LinkedinIcon, href: PERSONAL_INFO.linkedin, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${PERSONAL_INFO.email}`, label: 'Email' },
  ]

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">Awaneesh<span className="text-amber-400">.dev</span></span>
          </Link>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <p className="text-gray-600 text-sm font-mono">
            © {new Date().getFullYear()} Awaneesh Gupta
          </p>
        </div>
      </div>
    </footer>
  )
}
