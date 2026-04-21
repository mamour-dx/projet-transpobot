import Dashboard from '../components/Dashboard'
import TrajetsRecents from '../components/TrajetsRecents'
import HistoryPanel from '../components/HistoryPanel'
import NetworkActivity from '../components/NetworkActivity'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="home-page">
      {/* Dashboard header */}
      <div className="mb-2">
        <h1 className="font-headline text-3xl font-light text-white tracking-tight mb-1">
          Centre de <span className="text-primary font-medium">Contrôle</span>
        </h1>
        <p className="text-muted text-sm">
          Système opérationnel · Mise à jour en temps réel
        </p>
      </div>

      {/* Stats */}
      <Dashboard />

      {/* Bottom grid */}
      <div className="home-bottom-grid">
        <TrajetsRecents />
        <HistoryPanel refreshKey={0} />
      </div>

      {/* Admin: Network activity panel */}
      {isAdmin && <NetworkActivity />}
    </div>
  )
}
