import { motion } from 'framer-motion'
import { ShieldOff, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AccessDenied() {
  const { signOut, user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={28} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
        <p className="text-gray-400 mb-2">
          This admin panel is restricted to the portfolio owner only.
        </p>
        {user && (
          <p className="text-red-400/70 text-sm mb-6">
            <code className="text-xs">{user.email}</code> is not authorized.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 glass rounded-xl text-gray-300 hover:text-white text-sm transition-all"
          >
            <ArrowLeft size={14} />
            Back to Portfolio
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-600/30 text-sm transition-all"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  )
}
