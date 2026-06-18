import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { Copy, Check } from 'lucide-react'

const MIGRATION_SQL = `-- Run once in your Supabase SQL Editor (Dashboard → SQL Editor)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value)
VALUES ('availability', '{"available": true, "label": "Open to internships"}')
ON CONFLICT (key) DO NOTHING;`

const LABEL_PRESETS = [
  'Open to internships',
  'Actively looking',
  'Available for freelance',
  'Open to collaborations',
  'Not available right now',
]

export default function SettingsPanel() {
  const [available, setAvailable] = useState(true)
  const [label, setLabel] = useState('Open to internships')
  const [tableReady, setTableReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'availability')
      .single()
      .then(({ data, error }) => {
        if (!error && data?.value) {
          const v = data.value as { available: boolean; label: string }
          setAvailable(v.available)
          setLabel(v.label)
          setTableReady(true)
        }
        setLoading(false)
      })
  }, [])

  const save = async () => {
    setSaving(true)
    const { error } = await supabase.from('site_settings').upsert({
      key: 'availability',
      value: { available, label },
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) {
      toast.error('Table not set up yet — run the SQL below first')
    } else {
      setTableReady(true)
      toast.success('Availability updated!')
    }
  }

  const copySQL = () => {
    navigator.clipboard.writeText(MIGRATION_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Availability toggle */}
      <div className="glass rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-white font-semibold text-base mb-0.5">Availability Status</h2>
          <p className="text-gray-500 text-sm">Controls the badge shown at the top of your hero section.</p>
        </div>

        {/* On/Off toggle */}
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div>
            <p className="text-white text-sm font-medium">Currently available</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {available ? 'Green pulsing dot shown on hero' : 'Badge shows as inactive'}
            </p>
          </div>
          <button
            onClick={() => setAvailable((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
              available ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                available ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Label presets */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Badge label</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {LABEL_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setLabel(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  label === preset
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'glass text-gray-400 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 placeholder-gray-600"
            placeholder="Or type a custom label…"
          />
        </div>

        {/* Preview */}
        <div className="pt-1">
          <p className="text-xs text-gray-500 mb-2">Preview</p>
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass text-sm font-medium ${
              available
                ? 'border border-amber-500/25 text-amber-300/80'
                : 'border border-white/10 text-gray-500'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {available && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${available ? 'bg-green-400' : 'bg-gray-600'}`} />
            </span>
            {label || 'Open to internships'}
          </div>
        </div>

        <Button onClick={save} loading={saving} className="w-full sm:w-auto">
          Save Changes
        </Button>
      </div>

      {/* Setup instructions — only show if table isn't ready */}
      {!tableReady && (
        <div className="glass rounded-2xl p-6 border border-amber-500/15">
          <h3 className="text-white font-semibold text-sm mb-1">One-time setup required</h3>
          <p className="text-gray-500 text-sm mb-4">
            Run this SQL once in your{' '}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              Supabase SQL Editor
            </a>{' '}
            to enable saving. After that, the toggle above will persist across sessions.
          </p>
          <div className="relative">
            <pre className="bg-black/40 rounded-xl p-4 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed whitespace-pre">
              {MIGRATION_SQL}
            </pre>
            <button
              onClick={copySQL}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              title="Copy SQL"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
