import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Database } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Skill, SkillCategory } from '@/types'
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_COLORS, STATIC_SKILLS } from '@/data'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const EMPTY: Omit<Skill, 'id'> = { name: '', category: 'language', proficiency: 70, order_index: 0 }

export default function SkillsPanel() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [activeTab, setActiveTab] = useState<SkillCategory>('language')

  const load = async () => {
    const { data } = await supabase.from('skills').select('*').order('category').order('order_index')
    // Always update from DB — never fall back to STATIC_SKILLS here so deletes actually stick
    setSkills(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (s: Skill) => {
    setEditing(s)
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency, order_index: s.order_index })
    setModal(true)
  }

  const save = async () => {
    if (!form.name.trim()) return toast.error('Name required')
    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('skills').update(form).eq('id', editing.id)
        if (error) throw error
        toast.success('Updated!')
      } else {
        const { error } = await supabase.from('skills').insert([form])
        if (error) throw error
        toast.success('Skill added!')
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
    if (!confirm('Delete this skill?')) return
    // Optimistic: remove from UI immediately so user sees it gone right away
    setSkills((prev) => prev.filter((s) => s.id !== id))
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
      load() // revert to real DB state on failure
    } else {
      toast.success('Deleted')
    }
  }

  const seedDefaults = async () => {
    if (!confirm(`This will insert all ${STATIC_SKILLS.length} default skills into the database. Continue?`)) return
    setSeeding(true)
    try {
      const rows = STATIC_SKILLS.map(({ id: _id, ...rest }) => rest)
      const { error } = await supabase.from('skills').insert(rows)
      if (error) throw error
      toast.success(`${STATIC_SKILLS.length} skills seeded!`)
      load()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setSeeding(false)
    }
  }

  const categories = Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]
  const filtered = skills.filter((s) => s.category === activeTab)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <p className="text-gray-400 text-sm">{skills.length} skills in database</p>
        <div className="flex items-center gap-2">
          {skills.length === 0 && !loading && (
            <Button variant="ghost" size="sm" icon={<Database size={14} />} onClick={seedDefaults} loading={seeding}>
              Seed {STATIC_SKILLS.length} defaults
            </Button>
          )}
          <Button icon={<Plus size={14} />} onClick={openNew} size="sm">Add Skill</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === cat ? 'text-white' : 'text-gray-400 hover:text-white glass'
            }`}
            style={activeTab === cat ? { background: `${SKILL_CATEGORY_COLORS[cat]}20`, color: SKILL_CATEGORY_COLORS[cat], border: `1px solid ${SKILL_CATEGORY_COLORS[cat]}30` } : {}}
          >
            {SKILL_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass rounded-xl p-10 flex justify-center">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((skill) => (
            <div key={skill.id} className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm font-medium">{skill.name}</span>
                  <span className="text-xs font-mono" style={{ color: SKILL_CATEGORY_COLORS[skill.category] }}>
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${skill.proficiency}%`,
                      background: `linear-gradient(90deg, ${SKILL_CATEGORY_COLORS[skill.category]}80, ${SKILL_CATEGORY_COLORS[skill.category]})`,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"><Pencil size={13} /></button>
                <button onClick={() => remove(skill.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          {!filtered.length && !skills.length && (
            <div className="glass rounded-xl p-8 text-center text-gray-500 text-sm">
              No skills in database yet.
              <br />
              <span className="text-gray-600 text-xs">Use "Seed defaults" above to import all {STATIC_SKILLS.length} skills at once.</span>
            </div>
          )}
          {!filtered.length && skills.length > 0 && (
            <div className="glass rounded-xl p-8 text-center text-gray-500 text-sm">
              No {SKILL_CATEGORY_LABELS[activeTab]} skills yet.
            </div>
          )}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Skill' : 'Add Skill'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Skill Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="e.g. React" />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SkillCategory })}
              className="w-full px-3 py-2 rounded-lg bg-[#16161e] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50">
              {categories.map((cat) => (
                <option key={cat} value={cat}>{SKILL_CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Proficiency: {form.proficiency}%</label>
            <input type="range" min={0} max={100} value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: +e.target.value })}
              className="w-full accent-amber-500" />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Order</label>
            <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: +e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50" />
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
