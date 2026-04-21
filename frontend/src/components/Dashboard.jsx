import { useState, useEffect } from 'react'
import { fetchStats } from '../api'

const STAT_CONFIG = [
  {
    key: 'vehicules_actifs',
    label: 'Véhicules Actifs',
    icon: 'directions_bus',
    iconColor: 'var(--primary)',
    badgeText: '+12%',
    badgeStyle: { background: 'rgba(83,221,252,0.1)', color: 'var(--primary)' },
    valColor: '#fff',
  },
  {
    key: 'total_trajets',
    label: 'Trajets Terminés',
    icon: 'route',
    iconColor: 'var(--secondary)',
    badgeText: 'Total',
    badgeStyle: { background: 'rgba(107,255,143,0.1)', color: 'var(--secondary)' },
    valColor: 'var(--secondary)',
  },
  {
    key: 'trajets_en_cours',
    label: 'En cours',
    icon: 'directions_car',
    iconColor: 'var(--tertiary)',
    badgeText: 'Live',
    badgeStyle: { background: 'rgba(105,156,255,0.1)', color: 'var(--tertiary)' },
    valColor: 'var(--tertiary)',
  },
  {
    key: 'incidents_ouverts',
    label: 'Incidents Ouverts',
    icon: 'warning',
    iconColor: 'var(--error)',
    badgeText: '●',
    badgeStyle: { background: 'rgba(255,113,108,0.1)', color: 'var(--error)' },
    valColor: 'var(--error)',
  },
  {
    key: 'recette_totale',
    label: 'Recettes (CA)',
    icon: 'account_balance_wallet',
    iconColor: '#fbbf24',
    badgeText: 'FCFA',
    badgeStyle: { background: 'rgba(251,191,36,0.1)', color: '#fbbf24' },
    valColor: '#fbbf24',
    format: 'currency',
  },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => setStats(null))
  }, [])

  if (!stats) {
    return (
      <div className="stats-grid">
        {STAT_CONFIG.map((_, i) => (
          <div key={i} className="stat-card" style={{ minHeight: 130, opacity: 0.4 }} />
        ))}
      </div>
    )
  }

  return (
    <div className="stats-grid">
      {STAT_CONFIG.map((cfg) => (
        <div className="stat-card" key={cfg.key}>
          <div className="stat-card-header">
            <div className="stat-icon">
              <span className="material-symbols-outlined" style={{ color: cfg.iconColor }}>
                {cfg.icon}
              </span>
            </div>
            <span className="stat-badge" style={cfg.badgeStyle}>
              {cfg.badgeText}
            </span>
          </div>
          <div className="stat-val" style={{ color: cfg.valColor, fontSize: cfg.format === 'currency' ? '1.4rem' : undefined }}>
            {cfg.format === 'currency'
              ? (stats[cfg.key] ?? 0).toLocaleString('fr-FR')
              : (stats[cfg.key] ?? 0)}
          </div>
          <div className="stat-lbl">{cfg.label}</div>
        </div>
      ))}
    </div>
  )
}
