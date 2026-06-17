import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Upload, Award } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase'
import type { Certificate } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const EMPTY = { title: '', issuer: '', issue_date: '', credential_url: '', image_url: '', description: '' }

export default function CertificatesPanel() {
  const [items, setItems] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('certificates').select('*').order('issue_date', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.certificates).upload(path, file)
    if (error) { toast.error(error.message); setUploading(false); return }
    const { data } = supabase.storage.from(STORAGE_BUCKETS.certificates).getPublicUrl(path)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
    toast.success('Image uploaded!')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 })

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (c: Certificate) => {
    setEditing(c)
    setForm({ title: c.title, issuer: c.issuer, issue_date: c.issue_date, credential_url: c.credential_url ?? '', image_url: c.image_url ?? '', description: c.description ?? '' })
    setModal(true)
  }

  const save = async () => {
    if (!form.title.trim()) return toast.error('Title required')
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('certificates').update(form).eq('id', editing.id)
        if (error) throw error
        toast.success('Updated!')
      } else {
        const { error } = await supabase.from('certificates').insert([{ ...form, created_at: new Date().toISOString() }])
        if (error) throw error
        toast.success('Certificate added!')
      }
      setModal(false)
      load()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this certificate?')) return
    await supabase.from('certificates').delete().eq('id', id)
    toast.success('Deleted')
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{items.length} certificates</p>
        <Button icon={<Plus size={14} />} onClick={openNew} size="sm">Add Certificate</Button>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-10 flex justify-center">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <div key={c.id} className="glass rounded-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-amber-900/20 to-blue-900/20 flex items-center justify-center">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                ) : (
                  <Award size={32} className="text-amber-500/40" />
                )}
              </div>
              <div className="p-4">
                <p className="text-white text-sm font-semibold line-clamp-1">{c.title}</p>
                <p className="text-amber-400 text-xs">{c.issuer}</p>
                <p className="text-gray-500 text-xs mt-0.5">{c.issue_date}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(c)} className="flex-1 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-1">
                    <Pencil size={11} /> Edit
                  </button>
                  <button onClick={() => remove(c.id)} className="flex-1 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-all flex items-center justify-center gap-1">
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!items.length && <div className="col-span-3 glass rounded-xl p-10 text-center text-gray-500 text-sm">No certificates yet.</div>}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Certificate' : 'Add Certificate'} size="md">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Certificate Image</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-amber-500/40'
              }`}
            >
              <input {...getInputProps()} />
              {form.image_url ? (
                <img src={form.image_url} alt="preview" className="max-h-32 mx-auto rounded-lg" />
              ) : (
                <>
                  <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500 text-sm">{uploading ? 'Uploading...' : 'Drop image or click to browse'}</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="Certificate title" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Issuer</label>
              <input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="e.g. Coursera" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Issue Date</label>
              <input value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="2025-09" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Credential URL</label>
            <input value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="https://..." />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none"
              placeholder="What did you learn?" />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => setModal(false)}>Cancel</Button>
            <Button size="sm" loading={saving} onClick={save}>{editing ? 'Save' : 'Add'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
