import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { STATIC_SKILLS, SKILL_CATEGORY_LABELS, SKILL_CATEGORY_COLORS } from '@/data'
import { supabase } from '@/lib/supabase'
import type { Skill, SkillCategory } from '@/types'

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>(STATIC_SKILLS)

  useEffect(() => {
    supabase.from('skills').select('*').order('order_index').then(({ data }) => {
      if (data && data.length > 0) setSkills(data)
    })
  }, [])

  const categories = Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat)
    return acc
  }, {} as Record<SkillCategory, Skill[]>)

  return (
    <section id="skills" className="py-24 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Section label — left-aligned, no amber pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-gray-600 mb-3">Tech Stack</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">What I work with</h2>
        </motion.div>

        <div className="space-y-10">
          {categories.map((category, catIdx) => {
            const catSkills = grouped[category]
            if (!catSkills?.length) return null
            const color = SKILL_CATEGORY_COLORS[category]

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.06 }}
              >
                {/* Category label + line */}
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="text-xs font-mono uppercase tracking-widest flex-shrink-0"
                    style={{ color }}
                  >
                    {SKILL_CATEGORY_LABELS[category]}
                  </span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Skill chips — no progress bars, no percentages */}
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill, i) => (
                    <motion.span
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: catIdx * 0.04 + i * 0.03 }}
                      className="px-3 py-1.5 rounded-lg text-sm text-gray-300 border border-white/8 hover:border-white/20 hover:text-white transition-all cursor-default"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
