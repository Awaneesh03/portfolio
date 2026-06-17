import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
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
    <section id="skills" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Skills"
          title="Tech Stack"
          subtitle="Technologies I work with and am currently exploring"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, catIdx) => {
            const catSkills = grouped[category]
            if (!catSkills?.length) return null
            const color = SKILL_CATEGORY_COLORS[category]

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.08 }}
                className="glass rounded-2xl p-6 hover:border-amber-500/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                  />
                  <h3 className="font-semibold text-white">{SKILL_CATEGORY_LABELS[category]}</h3>
                </div>

                <div className="space-y-3">
                  {catSkills.map((skill, i) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                        <span className="text-xs" style={{ color }}>{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: catIdx * 0.08 + i * 0.05 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
                        />
                      </div>
                    </div>
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
