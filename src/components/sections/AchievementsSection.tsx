import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Zap, Medal } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import { supabase } from '@/lib/supabase'
import type { Achievement } from '@/types'

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'First Open Source Contribution',
    description: 'Successfully merged my first pull request to a major open source project',
    date: '2025-08',
    category: 'open-source',
    icon: '🎉',
    created_at: '',
  },
  {
    id: '2',
    title: 'B.Tech Admission (AI Specialization)',
    description: 'Secured admission to B.Tech CSE with AI specialization at Vedam School of Technology',
    date: '2025-07',
    category: 'academic',
    icon: '🎓',
    created_at: '',
  },
  {
    id: '3',
    title: 'Built First Full-Stack App',
    description: 'Completed and deployed IdeaForge, a full-stack AI-powered application from scratch',
    date: '2025-09',
    category: 'project',
    icon: '🚀',
    created_at: '',
  },
  {
    id: '4',
    title: '100 LeetCode Problems',
    description: 'Solved 100+ algorithmic problems on LeetCode, strengthening DSA fundamentals',
    date: '2025-11',
    category: 'competitive',
    icon: '⚡',
    created_at: '',
  },
]


export default function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>(FALLBACK_ACHIEVEMENTS)

  useEffect(() => {
    supabase
      .from('achievements')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setAchievements(data)
      })
  }, [])

  const stats = [
    { label: 'Projects Built', value: '10+', icon: Zap, color: '#fbbf24' },
    { label: 'Achievements', value: `${achievements.length}+`, icon: Trophy, color: '#fbbf24' },
    { label: 'Contributions', value: '200+', icon: Star, color: '#34d399' },
    { label: 'Problems Solved', value: '100+', icon: Medal, color: '#60a5fa' },
  ]

  return (
    <section id="achievements" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Achievements"
          title="Milestones & Wins"
          subtitle="Key achievements and moments that define my journey"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="glass rounded-2xl p-5 text-center"
            >
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-blue-600/30 to-transparent" />

          <div className="space-y-8">
            {achievements.map((achievement, i) => {
              const isLeft = i % 2 === 0

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative pl-12 md:pl-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}
                >
                  {/* Dot — always left on mobile; right-edge on desktop for right-side items */}
                  <div
                    className={`absolute top-5 w-5 h-5 rounded-full bg-amber-500 border-2 border-amber-400 z-10
                      left-[8px] md:left-auto
                      ${isLeft ? 'md:right-[-10px]' : 'md:left-[-10px]'}
                    `}
                  />

                  <div className="glass rounded-2xl p-5 hover:border-amber-500/20 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{achievement.icon || '🏆'}</span>
                      <div>
                        <div className="text-xs text-amber-400 font-mono mb-1">{achievement.date}</div>
                        <h3 className="font-bold text-white mb-1">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
