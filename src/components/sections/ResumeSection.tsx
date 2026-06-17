import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Eye } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import { supabase } from '@/lib/supabase'
import type { Resume } from '@/types'

export default function ResumeSection() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('resumes')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setResume(data)
        setLoading(false)
      })
  }, [])

  return (
    <section id="resume" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          tag="Resume"
          title="My Resume"
          subtitle="A snapshot of my education, skills, and experience"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <FileText size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Awaneesh Gupta — Resume</p>
                <p className="text-gray-500 text-sm">
                  {resume ? `Last updated: ${new Date(resume.uploaded_at).toLocaleDateString()}` : 'PDF Document'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {resume?.file_url && (
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-gray-300 hover:text-white text-sm transition-all hover:border-white/20"
                >
                  <Eye size={14} />
                  View
                </a>
              )}
              {resume?.file_url && (
                <a
                  href={resume.file_url}
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-500 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105 glow-sm"
                >
                  <Download size={14} />
                  Download
                </a>
              )}
            </div>
          </div>

          {/* Preview area */}
          <div className="aspect-[8.5/11] relative bg-gradient-to-br from-[#0f0f17] to-[#16161e] flex items-center justify-center">
            {loading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading resume...</p>
              </div>
            ) : resume?.file_url ? (
              <iframe
                src={`${resume.file_url}#view=FitH`}
                className="w-full h-full border-0"
                title="Resume Preview"
              />
            ) : (
              <div className="text-center p-8">
                <FileText size={64} className="text-amber-500/20 mx-auto mb-4" />
                <p className="text-gray-500 text-sm mb-2">Resume not yet uploaded</p>
                <p className="text-gray-600 text-xs">The admin can upload a PDF resume from the dashboard</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
