import { useAuth } from '@/context/AuthContext'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AccessDenied from './AccessDenied'
import { PageLoader } from '@/components/ui/LoadingSpinner'

export default function AdminPage() {
  const { user, loading, isAllowed } = useAuth()

  if (loading) return <PageLoader />
  if (!user) return <AdminLogin />
  if (!isAllowed) return <AccessDenied />
  return <AdminDashboard />
}
