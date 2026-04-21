import { useState, useEffect } from 'react'
import { fetchTrajetsRecents } from '../api'

const STATUS_STYLE = {
  termine:  { cls: 'badge-green',  label: 'Terminé' },
  en_cours: { cls: 'badge-orange', label: 'En cours' },
  planifie: { cls: 'badge-blue',   label: 'Planifié' },
}

export default function TrajetsRecents() {
  const [trajets, setTrajets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrajetsRecents()
      .then(data => { setTrajets(data.slice(0, 6)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const s = (statut) => STATUS_STYLE[statut] || { cls: 'badge-red', label: statut }

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span className="panel-title">
          <span className="material-symbols-outlined">route</span>
          Trajets récents
        </span>
        <button className="panel-see-all">Voir tout</button>
      </div>

      {loading ? (
        <p className="loading" style={{ padding: '1.5rem', fontSize: '0.8rem' }}>Chargement...</p>
      ) : trajets.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem 1.25rem' }}>
          <span className="material-symbols-outlined">route</span>
          <p style={{ fontSize: '0.8rem' }}>Aucun trajet enregistré</p>
        </div>
      ) : (
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '0.6rem 1rem', textAlign: 'left', color: '#475569', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.07em' }}>Ligne</th>
                <th style={{ padding: '0.6rem 1rem', textAlign: 'left', color: '#475569', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.07em' }}>Chauffeur</th>
                <th style={{ padding: '0.6rem 1rem', textAlign: 'left', color: '#475569', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.07em' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {trajets.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.7rem 1rem', color: '#fff', fontWeight: 500 }}>
                    {t.nom_ligne || t.numero_ligne}
                  </td>
                  <td style={{ padding: '0.7rem 1rem', color: '#94a3b8' }}>{t.chauffeur_nom}</td>
                  <td style={{ padding: '0.7rem 1rem' }}>
                    <span className={`badge ${s(t.statut).cls}`}>{s(t.statut).label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
