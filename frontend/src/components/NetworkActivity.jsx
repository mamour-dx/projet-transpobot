import { useState, useEffect } from 'react'
import { fetchHistoryStats } from '../api'

export default function NetworkActivity() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistoryStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))

    // Refresh every 30s
    const interval = setInterval(() => {
      fetchHistoryStats()
        .then(setStats)
        .catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return null

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Jamais'
    const d = new Date(dateStr)
    const now = new Date()
    const diffMin = Math.floor((now - d) / 60000)
    if (diffMin < 1) return 'À l\'instant'
    if (diffMin < 60) return `Il y a ${diffMin}min`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `Il y a ${diffH}h`
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="glass-card network-activity">
      <div className="panel-header">
        <span className="panel-title">
          <span className="material-symbols-outlined">monitoring</span>
          Activité réseau
        </span>
        <span className="network-live-dot" />
      </div>

      {/* Global stats */}
      <div className="network-stats-row">
        <div className="network-stat">
          <div className="network-stat-val" style={{ color: 'var(--primary)' }}>{stats?.requetes_1h || 0}</div>
          <div className="network-stat-label">Dernière heure</div>
        </div>
        <div className="network-stat">
          <div className="network-stat-val" style={{ color: 'var(--secondary)' }}>{stats?.requetes_24h || 0}</div>
          <div className="network-stat-label">24 heures</div>
        </div>
        <div className="network-stat">
          <div className="network-stat-val" style={{ color: '#fbbf24' }}>{stats?.total_requetes || 0}</div>
          <div className="network-stat-label">Total</div>
        </div>
        <div className="network-stat">
          <div className="network-stat-val" style={{ color: 'var(--tertiary)' }}>{stats?.nb_utilisateurs_actifs || 0}</div>
          <div className="network-stat-label">Actifs (24h)</div>
        </div>
      </div>

      {/* Per-user activity */}
      {stats?.users && stats.users.length > 0 && (
        <div className="network-users">
          <div className="network-users-header">
            <span>Utilisateur</span>
            <span>Requêtes</span>
            <span>Dernière activité</span>
          </div>
          {stats.users.map((u, i) => (
            <div className="network-user-row" key={i}>
              <div className="network-user-name">
                <span className={`network-user-dot ${u.requetes_1h > 0 ? 'active' : ''}`} />
                {u.username}
              </div>
              <div className="network-user-count">
                <span style={{ color: '#fff', fontWeight: 600 }}>{u.requetes_24h || 0}</span>
                <span style={{ color: '#475569' }}> / {u.total_requetes}</span>
              </div>
              <div className="network-user-time">
                {formatTime(u.derniere_activite)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
