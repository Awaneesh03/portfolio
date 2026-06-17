import { motion } from 'framer-motion'
import { Shield, Code2 } from 'lucide-react'
import { GoogleIcon } from '@/components/ui/BrandIcons'
import { useAuth } from '@/context/AuthContext'

export default function AdminLogin() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-6 glow">
            <Code2 size={28} className="text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield size={16} className="text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Admin Portal</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Dashboard Access</h1>
          <p className="text-gray-400 text-sm mb-8">
            Sign in with your authorized Google account to access the portfolio admin dashboard.
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            <GoogleIcon size={18} />
            Continue with Google
          </button>

          <p className="mt-6 text-gray-600 text-xs">
            Access is restricted to authorized email only
          </p>
        </div>
      </motion.div>
    </div>
  )
}
