import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Achievement } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const EMPTY = { title: '', description: '', date: '', category: 'academic', icon: '🏆' }

export default function AchievementsPanel() {
  const [items, setItems] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('achievements').select('*').order('date', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (a: Achievement) => {
    setEditing(a)
    setForm({ title: a.title, description: a.description, date: a.date, category: a.category, icon: a.icon ?? '🏆' })
    setModal(true)
  }

  const save = async () => {
    if (!form.title.trim()) return toast.error('Title required')
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('achievements').update(form).eq('id', editing.id)
        if (error) throw error
        toast.success('Updated!')
      } else {
        const { error } = await supabase.from('achievements').insert([{ ...form, created_at: new Date().toISOString() }])
        if (error) throw error
        toast.success('Achievement added!')
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
    if (!confirm('Delete this achievement?')) return
    await supabase.from('achievements').delete().eq('id', id)
    toast.success('Deleted')
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{items.length} achievements</p>
        <Button icon={<Plus size={14} />} onClick={openNew} size="sm">Add Achievement</Button>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-10 flex justify-center">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="glass rounded-xl p-4 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">{a.icon || '🏆'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-semibold text-white text-sm">{a.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 capitalize">{a.category}</span>
                </div>
                <p className="text-gray-500 text-xs mb-1">{a.description}</p>
                <p className="text-gray-600 text-xs font-mono">{a.date}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"><Pencil size={13} /></button>
                <button onClick={() => remove(a.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          {!items.length && <div className="glass rounded-xl p-10 text-center text-gray-500 text-sm">No achievements yet.</div>}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Achievement' : 'Add Achievement'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3">
              <label className="text-xs text-gray-400 block mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="Achievement title" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Icon (emoji)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 text-center text-lg"
                placeholder="🏆" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none"
              placeholder="What did you accomplish?" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Date</label>
              <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="2025-09" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="academic, project, etc." />
            </div>
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
