import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Star, Globe, Upload, X, Database } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase'
import type { Project } from '@/types'
import { FALLBACK_PROJECTS } from '@/data'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const EMPTY: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  title: '', description: '', long_description: '', tech_stack: [], github_url: '',
  live_url: '', image_url: '', featured: false, order_index: 0, slug: '',
}

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.projects).upload(path, file)
    if (error) { toast.error(error.message); setUploading(false); return }
    const { data } = supabase.storage.from(STORAGE_BUCKETS.projects).getPublicUrl(path)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 })

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('order_index')
    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY); setTechInput(''); setModal(true) }
  const openEdit = (p: Project) => {
    setEditing(p)
    setForm({
      title: p.title, description: p.description, long_description: p.long_description ?? '',
      tech_stack: p.tech_stack, github_url: p.github_url ?? '', live_url: p.live_url ?? '',
      image_url: p.image_url ?? '', featured: p.featured, order_index: p.order_index, slug: p.slug ?? '',
    })
    setTechInput('')
    setModal(true)
  }

  const save = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('projects').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
        if (error) throw error
        toast.success('Project updated!')
      } else {
        const { error } = await supabase.from('projects').insert([{ ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        if (error) throw error
        toast.success('Project created!')
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
    if (!confirm('Delete this project?')) return
    setProjects((prev) => prev.filter((p) => p.id !== id))
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) { toast.error(error.message); load() } else { toast.success('Deleted') }
  }

  const seedDefaults = async () => {
    if (!confirm('This will insert all 6 default projects into the database. Continue?')) return
    setSeeding(true)
    try {
      const rows = FALLBACK_PROJECTS.map(({ id: _id, created_at: _ca, updated_at: _ua, ...rest }) => ({
        ...rest,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
      const { error } = await supabase.from('projects').insert(rows)
      if (error) throw error
      toast.success('6 default projects added!')
      load()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSeeding(false)
    }
  }

  const addTech = () => {
    const t = techInput.trim()
    if (t && !form.tech_stack.includes(t)) setForm({ ...form, tech_stack: [...form.tech_stack, t] })
    setTechInput('')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <p className="text-gray-400 text-sm">{projects.length} projects in database</p>
        <div className="flex items-center gap-2">
          {projects.length === 0 && !loading && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Database size={14} />}
              onClick={seedDefaults}
              loading={seeding}
            >
              Seed 6 defaults
            </Button>
          )}
          <Button icon={<Plus size={14} />} onClick={openNew} size="sm">New Project</Button>
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-10 flex justify-center">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-white text-sm">{p.title}</span>
                  {p.featured && <Star size={12} className="text-yellow-400" fill="currentColor" />}
                  {p.slug && <span className="text-xs text-gray-600 font-mono">/{p.slug}</span>}
                </div>
                <p className="text-gray-500 text-xs truncate">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tech_stack.slice(0, 4).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400">{t}</span>
                  ))}
                  {p.tech_stack.length > 4 && <span className="px-1.5 py-0.5 rounded text-xs text-gray-600">+{p.tech_stack.length - 4}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><GithubIcon size={14} /></a>}
                {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-400 transition-colors"><Globe size={14} /></a>}
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"><Pencil size={13} /></button>
                <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          {!projects.length && (
            <div className="glass rounded-xl p-10 text-center text-gray-500 text-sm">
              No projects in database yet.
              <br />
              <span className="text-gray-600 text-xs">Use "Seed 6 defaults" to import your existing projects, or add one manually.</span>
            </div>
          )}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'New Project'} size="lg">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="Project title" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Slug (for URL)</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 font-mono"
                placeholder="my-project-name" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Order Index</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: +e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer self-end pb-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-500" />
              <span className="text-gray-300 text-sm">Featured project</span>
            </label>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Short Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none"
              placeholder="Brief description for project cards" />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Long Description (detail page)</label>
            <textarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none"
              placeholder="Full write-up shown on the project detail page" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">GitHub URL</label>
              <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Live URL</label>
              <input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Project Screenshot</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-amber-500/40'
              }`}
            >
              <input {...getInputProps()} />
              {form.image_url ? (
                <div className="relative inline-block">
                  <img src={form.image_url} alt="preview" className="max-h-32 mx-auto rounded-lg" />
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
                  <Upload size={20} className="mx-auto text-gray-500 mb-1.5" />
                  <p className="text-gray-500 text-sm">{uploading ? 'Uploading...' : 'Drop screenshot or click to browse'}</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="Type tech and press Enter" />
              <button onClick={addTech} className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/30 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tech_stack.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs">
                  {t}
                  <button onClick={() => setForm({ ...form, tech_stack: form.tech_stack.filter((x) => x !== t) })} className="hover:text-red-400 transition-colors">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModal(false)}>Cancel</Button>
            <Button size="sm" loading={saving} onClick={save}>{editing ? 'Save Changes' : 'Create Project'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
