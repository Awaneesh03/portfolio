import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ExternalLink, Calendar, X, ZoomIn } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import { supabase } from '@/lib/supabase'
import type { Certificate } from '@/types'

const FALLBACK_CERTS: Certificate[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    issuer: 'Coursera / Stanford University',
    issue_date: '2025-09',
    credential_url: '',
    image_url: '',
    description: 'Supervised and unsupervised learning, neural networks fundamentals',
    created_at: '',
  },
  {
    id: '2',
    title: 'React - The Complete Guide',
    issuer: 'Udemy',
    issue_date: '2025-08',
    credential_url: '',
    image_url: '',
    description: 'Hooks, Context API, Redux, React Router, and advanced patterns',
    created_at: '',
  },
  {
    id: '3',
    title: 'Full Stack Web Development',
    issuer: 'freeCodeCamp',
    issue_date: '2025-07',
    credential_url: '',
    image_url: '',
    description: 'HTML, CSS, JavaScript, Node.js, MongoDB, and REST APIs',
    created_at: '',
  },
]

export default function CertificatesSection() {
  const [certs, setCerts] = useState<Certificate[]>(FALLBACK_CERTS)
  const [preview, setPreview] = useState<Certificate | null>(null)

  useEffect(() => {
    supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setCerts(data)
      })
  }, [])

  return (
    <section id="certificates" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Certificates"
          title="Certifications & Courses"
          subtitle="Credentials and learning milestones I've achieved"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl overflow-hidden group cursor-pointer hover:border-amber-500/30 transition-all"
              onClick={() => setPreview(cert)}
            >
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-amber-900/20 to-blue-900/20 flex items-center justify-center">
                {cert.image_url ? (
                  <>
                    <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <Award size={40} className="text-amber-500/40" />
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{cert.title}</h3>
                <p className="text-amber-400 text-xs font-medium mb-1">{cert.issuer}</p>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                  <Calendar size={11} />
                  {cert.issue_date}
                </div>
                {cert.description && (
                  <p className="text-gray-500 text-xs line-clamp-2">{cert.description}</p>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <ExternalLink size={11} />
                    View credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-screen preview modal */}
      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative max-w-3xl w-full glass rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
            {preview.image_url ? (
              <img src={preview.image_url} alt={preview.title} className="w-full" />
            ) : (
              <div className="p-10 text-center">
                <Award size={64} className="text-amber-500/40 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl">{preview.title}</h3>
                <p className="text-amber-400 mt-1">{preview.issuer}</p>
                <p className="text-gray-500 mt-1 text-sm">{preview.issue_date}</p>
                {preview.description && <p className="text-gray-400 mt-4 text-sm">{preview.description}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
