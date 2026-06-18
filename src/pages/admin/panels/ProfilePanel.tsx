import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PERSONAL_INFO } from '@/data'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { User, Link2, FileText } from 'lucide-react'

type ProfileForm = {
  name: string
  title: string
  subtitle: string
  email: string
  github: string
  linkedin: string
  location: string
  about: string
  aboutLong: string
}

const DEFAULT: ProfileForm = {
  name: PERSONAL_INFO.name,
  title: PERSONAL_INFO.title,
  subtitle: PERSONAL_INFO.subtitle,
  email: PERSONAL_INFO.email,
  github: PERSONAL_INFO.github,
  linkedin: PERSONAL_INFO.linkedin,
  location: PERSONAL_INFO.location,
  about: PERSONAL_INFO.about,
  aboutLong: PERSONAL_INFO.aboutLong,
}

function Field({ label, value, onChange, placeholder, mono }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 ${mono ? 'font-mono' : ''}`}
      />
    </div>
  )
}

function TextArea({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed"
      />
    </div>
  )
}

export default function ProfilePanel() {
  const [form, setForm] = useState<ProfileForm>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'profile')
      .single()
      .then(({ data }) => {
        if (data?.value) setForm({ ...DEFAULT, ...(data.value as Partial<ProfileForm>) })
        setLoading(false)
      })
  }, [])

  const set = <K extends keyof ProfileForm>(key: K) => (v: string) => setForm((f) => ({ ...f, [key]: v }))

  const save = async () => {
    setSaving(true)
    const { error } = await supabase.from('site_settings').upsert({
      key: 'profile',
      value: form,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Profile saved! Changes are live on your site.')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Personal info */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-amber-400" />
          <h2 className="text-white font-semibold text-sm">Personal Information</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={form.name} onChange={set('name')} placeholder="Your Name" />
          <Field label="Location" value={form.location} onChange={set('location')} placeholder="City, Country" />
          <Field label="Primary Title" value={form.title} onChange={set('title')} placeholder="B.Tech CSE (AI) Student" />
          <Field label="Subtitle / Role" value={form.subtitle} onChange={set('subtitle')} placeholder="Full Stack Developer" />
        </div>
      </div>

      {/* Links */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Link2 size={16} className="text-amber-400" />
          <h2 className="text-white font-semibold text-sm">Contact & Social Links</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email" value={form.email} onChange={set('email')} placeholder="you@example.com" mono />
          <Field label="GitHub URL" value={form.github} onChange={set('github')} placeholder="https://github.com/yourname" mono />
          <Field label="LinkedIn URL" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/yourname" mono />
        </div>
        <p className="text-gray-600 text-xs">These links appear on the hero social icons and throughout the site.</p>
      </div>

      {/* Bio */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} className="text-amber-400" />
          <h2 className="text-white font-semibold text-sm">Bio</h2>
        </div>
        <TextArea
          label="Short bio (shown in About section)"
          value={form.about}
          onChange={set('about')}
          rows={3}
        />
        <TextArea
          label="Full bio (shown on About page)"
          value={form.aboutLong}
          onChange={set('aboutLong')}
          rows={6}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} loading={saving}>
          Save Profile
        </Button>
        <button
          onClick={() => setForm(DEFAULT)}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  )
}
