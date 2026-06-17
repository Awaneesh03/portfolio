import { useEffect, useState, useCallback } from 'react'
import { Upload, FileText, Download, CheckCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase'
import type { Resume } from '@/types'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function ResumePanel() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('resumes').select('*').order('uploaded_at', { ascending: false }).limit(1).single()
    if (data) setResume(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    if (file.type !== 'application/pdf') return toast.error('Only PDF files allowed')
    setUploading(true)
    const path = `resume_${Date.now()}.pdf`
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.resume).upload(path, file, { upsert: true })
    if (error) { toast.error(error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKETS.resume).getPublicUrl(path)
    const { error: dbError } = await supabase.from('resumes').insert([{
      file_url: publicUrl,
      uploaded_at: new Date().toISOString(),
      version: `v${Date.now()}`,
    }])
    if (dbError) { toast.error(dbError.message); setUploading(false); return }
    toast.success('Resume uploaded successfully!')
    setUploading(false)
    load()
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  return (
    <div className="space-y-6 max-w-2xl">
      {loading ? (
        <div className="glass rounded-xl p-10 flex justify-center">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {resume && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                  <CheckCircle size={22} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Current Resume</p>
                  <p className="text-gray-500 text-sm">
                    Uploaded {new Date(resume.uploaded_at).toLocaleDateString()} · {resume.version}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-gray-300 hover:text-white text-sm transition-all"
                  >
                    <FileText size={13} />
                    View
                  </a>
                  <a
                    href={resume.file_url}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:text-amber-300 text-sm transition-all"
                  >
                    <Download size={13} />
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">
              {resume ? 'Upload New Version' : 'Upload Resume'}
            </h3>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-amber-500/40 hover:bg-white/2'
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Uploading your resume...</p>
                </div>
              ) : (
                <>
                  <Upload size={32} className="mx-auto text-gray-500 mb-3" />
                  <p className="text-white font-medium mb-1">Drop your PDF resume here</p>
                  <p className="text-gray-500 text-sm mb-4">or click to browse files</p>
                  <Button variant="secondary" size="sm">Choose File</Button>
                  <p className="text-gray-600 text-xs mt-4">PDF only · Max 10MB</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
