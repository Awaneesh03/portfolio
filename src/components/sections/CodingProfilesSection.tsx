import { motion } from 'framer-motion'
import { Code, Terminal, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import SectionHeader from '@/components/ui/SectionHeader'
import { CODING_PROFILES } from '@/data'
import type { SVGProps, ReactElement } from 'react'

type AnyIcon = (props: SVGProps<SVGSVGElement> & { size?: number }) => ReactElement

const iconMap: Record<string, AnyIcon> = {
  github: GithubIcon,
  code: Code as unknown as AnyIcon,
  terminal: Terminal as unknown as AnyIcon,
  'chef-hat': Code as unknown as AnyIcon,
}

export default function CodingProfilesSection() {
  return (
    <section id="coding-profiles" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Coding Profiles"
          title="Where I Code"
          subtitle="Platforms where I practice, compete, and build"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CODING_PROFILES.map((profile, i) => {
            const Icon = iconMap[profile.icon] || Code
            return (
              <motion.a
                key={profile.platform}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-2xl p-6 group hover:border-opacity-50 transition-all duration-300 block"
                style={{ '--hover-color': profile.color } as React.CSSProperties}
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ background: `${profile.color}15`, border: `1px solid ${profile.color}30` }}
                  >
                    <Icon size={22} style={{ color: profile.color }} />
                  </div>
                  <ExternalLink size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>

                <h3 className="font-bold text-white text-lg mb-0.5 group-hover:text-opacity-90">
                  {profile.platform}
                </h3>
                <p className="text-gray-500 text-sm font-mono mb-4">@{profile.username}</p>

                {profile.stats && (
                  <div className="space-y-2">
                    {Object.entries(profile.stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs capitalize">{key}</span>
                        <span className="text-sm font-semibold" style={{ color: profile.color }}>
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
