import { useEffect, useState } from 'react'
import { Mail, Trash2, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { ContactMessage } from '@/types'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'

export default function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  const load = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id)
    setMessages((msgs) => msgs.map((m) => m.id === id ? { ...m, read: true } : m))
  }

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg)
    if (!msg.read) markRead(msg.id)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await supabase.from('contact_messages').delete().eq('id', id)
    toast.success('Deleted')
    setMessages((msgs) => msgs.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const unread = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-gray-400 text-sm">{messages.length} messages</p>
        {unread > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
            {unread} unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="glass rounded-xl p-10 flex justify-center">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`glass rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-amber-500/20 ${!msg.read ? 'border-amber-500/20' : ''}`}
              onClick={() => openMessage(msg)}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!msg.read ? 'bg-amber-500/20' : 'bg-white/5'}`}>
                <Mail size={16} className={!msg.read ? 'text-amber-400' : 'text-gray-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-sm font-semibold ${!msg.read ? 'text-white' : 'text-gray-300'}`}>{msg.name}</span>
                  {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  <span className="text-gray-500 text-xs ml-auto">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-400 text-xs">{msg.subject}</p>
                <p className="text-gray-600 text-xs truncate mt-0.5">{msg.message}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); remove(msg.id) }}
                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {!messages.length && (
            <div className="glass rounded-xl p-10 text-center">
              <Mail size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No messages yet</p>
            </div>
          )}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs">From</span>
                <p className="text-white font-medium">{selected.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Email</span>
                <a href={`mailto:${selected.email}`} className="text-amber-400 hover:text-amber-300 block transition-colors">{selected.email}</a>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Subject</span>
                <p className="text-white">{selected.subject}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Date</span>
                <p className="text-gray-300">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs block mb-2">Message</span>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => remove(selected.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition-all">
                <Trash2 size={13} />
                Delete
              </button>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-500 rounded-xl text-white text-sm transition-all"
              >
                <Eye size={13} />
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
