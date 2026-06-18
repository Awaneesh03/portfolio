import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Upload, Image, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase'
import type { GalleryImage } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const EMPTY = { title: '', caption: '', category: 'events', image_url: '', order_index: 0 }

interface UploadingFile {
  name: string
  progress: 'uploading' | 'done' | 'error'
  url?: string
}

export default function GalleryPanel() {
  const [items, setItems] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<GalleryImage | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  // multi-upload queue for bulk photo add
  const [bulkModal, setBulkModal] = useState(false)
  const [bulkFiles, setBulkFiles] = useState<UploadingFile[]>([])
  const [bulkCategory, setBulkCategory] = useState('events')
  const [bulkUploading, setBulkUploading] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('gallery_images').select('*').order('order_index')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Single image upload (used in add/edit modal)
  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.gallery).upload(path, file)
    if (error) { toast.error(error.message); setUploading(false); return }
    const { data } = supabase.storage.from(STORAGE_BUCKETS.gallery).getPublicUrl(path)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1,
  })

  // Bulk upload (multiple photos at once)
  const onBulkDrop = useCallback(async (files: File[]) => {
    if (!files.length) return
    setBulkUploading(true)
    const queue: UploadingFile[] = files.map((f) => ({ name: f.name, progress: 'uploading' as const }))
    setBulkFiles(queue)

    const results: UploadingFile[] = [...queue]
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const path = `${Date.now()}_${i}_${file.name.replace(/\s+/g, '_')}`
      const { error } = await supabase.storage.from(STORAGE_BUCKETS.gallery).upload(path, file)
      if (error) {
        results[i] = { ...results[i], progress: 'error' }
        setBulkFiles([...results])
        continue
      }
      const { data } = supabase.storage.from(STORAGE_BUCKETS.gallery).getPublicUrl(path)
      results[i] = { ...results[i], progress: 'done', url: data.publicUrl }
      setBulkFiles([...results])
    }
    setBulkUploading(false)
  }, [])

  const { getRootProps: getBulkRootProps, getInputProps: getBulkInputProps, isDragActive: isBulkDragActive } = useDropzone({
    onDrop: onBulkDrop, accept: { 'image/*': [] }, multiple: true,
  })

  const saveBulk = async () => {
    const done = bulkFiles.filter((f) => f.progress === 'done' && f.url)
    if (!done.length) return toast.error('No images uploaded yet')
    setSaving(true)
    const rows = done.map((f, i) => ({
      title: f.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
      caption: '',
      category: bulkCategory,
      image_url: f.url!,
      order_index: items.length + i,
      created_at: new Date().toISOString(),
    }))
    const { error } = await supabase.from('gallery_images').insert(rows)
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success(`${done.length} photo${done.length > 1 ? 's' : ''} added!`)
    setSaving(false)
    setBulkModal(false)
    setBulkFiles([])
    load()
  }

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (img: GalleryImage) => {
    setEditing(img)
    setForm({ title: img.title, caption: img.caption ?? '', category: img.category, image_url: img.image_url, order_index: img.order_index })
    setModal(true)
  }

  const save = async () => {
    if (!form.title.trim()) return toast.error('Title required')
    if (!form.image_url && !editing) return toast.error('Please upload an image')
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('gallery_images').update(form).eq('id', editing.id)
        if (error) throw error
        toast.success('Updated!')
      } else {
        const { error } = await supabase.from('gallery_images').insert([{ ...form, created_at: new Date().toISOString() }])
        if (error) throw error
        toast.success('Photo added!')
      }
      setModal(false)
      setForm(EMPTY)
      load()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (img: GalleryImage) => {
    if (!confirm('Delete this photo?')) return
    setItems((prev) => prev.filter((i) => i.id !== img.id))
    if (img.image_url.includes('supabase')) {
      const pathMatch = img.image_url.match(/gallery\/(.+)$/)
      if (pathMatch) await supabase.storage.from(STORAGE_BUCKETS.gallery).remove([pathMatch[1]])
    }
    const { error } = await supabase.from('gallery_images').delete().eq('id', img.id)
    if (error) { toast.error(error.message); load() } else { toast.success('Deleted') }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{items.length} photos</p>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Upload size={14} />} onClick={() => { setBulkFiles([]); setBulkModal(true) }} size="sm">
            Upload Multiple
          </Button>
          <Button icon={<Plus size={14} />} onClick={openNew} size="sm">Add Photo</Button>
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-10 flex justify-center">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((img) => (
            <div key={img.id} className="glass rounded-xl overflow-hidden group">
              <div className="relative overflow-hidden bg-black/30 flex items-center justify-center min-h-40">
                {img.image_url ? (
                  <img src={img.image_url} alt={img.title} className="w-full object-contain max-h-72" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-amber-900/20 to-blue-900/20 flex items-center justify-center">
                    <Image size={32} className="text-amber-500/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEdit(img)}
                    className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(img)}
                    className="p-2 rounded-full bg-red-600/80 text-white hover:bg-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate">{img.title}</p>
                {img.caption && <p className="text-gray-500 text-xs mt-0.5 truncate">{img.caption}</p>}
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 capitalize">{img.category}</span>
              </div>
            </div>
          ))}
          {!items.length && (
            <div className="col-span-3 glass rounded-xl p-10 text-center text-gray-500 text-sm">
              No photos yet. Upload some!
            </div>
          )}
        </div>
      )}

      {/* Single photo modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Photo' : 'Add Photo'} size="md">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Photo {!editing && '*'}</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-amber-500/40'
              }`}
            >
              <input {...getInputProps()} />
              {form.image_url ? (
                <div className="relative inline-block">
                  <img src={form.image_url} alt="preview" className="max-h-40 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, image_url: '' })) }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-400"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-500 text-sm">{uploading ? 'Uploading...' : 'Drop photo or click to browse'}</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="e.g. Mumbai Tech Meetup 2024"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Caption / Location</label>
            <input
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="e.g. Presenting at HackNITR, Bhubaneswar — March 2024"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Album / Tag</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="e.g. hackathons, campus, events, travel"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => setModal(false)}>Cancel</Button>
            <Button size="sm" loading={saving || uploading} onClick={save}>
              {editing ? 'Save Changes' : 'Add Photo'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk upload modal */}
      <Modal open={bulkModal} onClose={() => setBulkModal(false)} title="Upload Multiple Photos" size="lg">
        <div className="space-y-5">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Album / Tag for all photos</label>
            <input
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="e.g. mumbai-trip, hackathons, campus-life"
            />
          </div>

          <div
            {...getBulkRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isBulkDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-amber-500/40'
            }`}
          >
            <input {...getBulkInputProps()} />
            <Upload size={28} className="mx-auto text-gray-500 mb-2" />
            <p className="text-white font-medium mb-1">Drop all photos here</p>
            <p className="text-gray-500 text-sm">Select multiple images at once — all will be uploaded</p>
          </div>

          {bulkFiles.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {bulkFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
                  {f.url && (
                    <img src={f.url} alt={f.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  )}
                  <span className="text-gray-300 text-sm flex-1 truncate">{f.name}</span>
                  <span className={`text-xs font-medium flex-shrink-0 ${
                    f.progress === 'done' ? 'text-green-400' :
                    f.progress === 'error' ? 'text-red-400' :
                    'text-amber-400'
                  }`}>
                    {f.progress === 'done' ? '✓ Done' : f.progress === 'error' ? '✗ Failed' : 'Uploading...'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setBulkModal(false)}>Cancel</Button>
            <Button
              size="sm"
              loading={saving || bulkUploading}
              onClick={saveBulk}
              disabled={!bulkFiles.some((f) => f.progress === 'done')}
            >
              Save {bulkFiles.filter((f) => f.progress === 'done').length || ''} Photos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
