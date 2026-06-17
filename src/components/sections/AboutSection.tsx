import { motion } from 'framer-motion'
import { GraduationCap, Target, MapPin, Calendar, Lightbulb } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import { PERSONAL_INFO } from '@/data'

export default function AboutSection() {
  const stats = [
    { label: 'Year of Study', value: '1st Year', icon: Calendar },
    { label: 'Location', value: PERSONAL_INFO.location, icon: MapPin },
    { label: 'Focus', value: 'AI + Web Dev', icon: Lightbulb },
  ]

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="About Me"
          title="Who I Am"
          subtitle="A passionate developer on a journey to build impactful technology"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              {PERSONAL_INFO.about}
            </p>
            <p className="text-gray-400 leading-relaxed">
              My journey in tech started when I wrote my first "Hello, World!" program and instantly became fascinated by the power of code. Since then, I've been on a continuous learning path — exploring everything from frontend aesthetics to backend architecture to the exciting world of AI.
            </p>
            <p className="text-gray-400 leading-relaxed">
              When I'm not coding, you'll find me contributing to open source, solving competitive programming problems, or experimenting with the latest AI models.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/10 text-sm">
                  <Icon size={14} className="text-amber-400" />
                  <span className="text-gray-400">{label}:</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cards */}
          <div className="space-y-5">
            <Card delay={0.1} className="border-amber-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Education</h3>
                  <p className="text-amber-400 font-medium">{PERSONAL_INFO.education.institution}</p>
                  <p className="text-gray-400 text-sm">{PERSONAL_INFO.education.degree}</p>
                  <p className="text-gray-500 text-sm">{PERSONAL_INFO.education.duration}</p>
                </div>
              </div>
            </Card>

            <Card delay={0.2} className="border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Target size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">Career Goals</h3>
                  <ul className="space-y-2">
                    {PERSONAL_INFO.goals.map((goal) => (
                      <li key={goal} className="flex items-start gap-2 text-gray-400 text-sm">
                        <span className="text-blue-400 mt-1 flex-shrink-0">→</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card delay={0.3} className="border-emerald-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Learning Journey</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Currently diving deep into AI/ML, system design, and cloud architecture. Every day is a new opportunity to learn something that will make a real difference.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
