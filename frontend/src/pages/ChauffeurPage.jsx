import { useState, useEffect } from 'react'
import { fetchChauffeurs } from '../api'
import { useNavigate } from 'react-router-dom'

const STATUT_BADGE = {
  disponible: 'badge-green',
  en_service: 'badge-orange',
  conge: 'badge-blue',
  suspendu: 'badge-red',
}

const STATUT_LABEL = {
  disponible: 'Disponible',
  en_service: 'En service',
  conge: 'En congé',
  suspendu: 'Suspendu',
}

export default function ChauffeurPage() {
  const navigate = useNavigate()
  const [chauffeurs, setChauffeurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetchChauffeurs(page, 10)
      .then(res => {
        setChauffeurs(res.items)
        setTotalPages(res.pages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  const filtered = chauffeurs.filter(c =>
    c.nom.toLowerCase().includes(filter.toLowerCase()) ||
    c.matricule.toLowerCase().includes(filter.toLowerCase())
  )

  const countByStatus = (s) => chauffeurs.filter(c => c.statut === s).length

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Chauffeurs</h1>
          <p className="page-subtitle">Gestion opérationnelle et suivi du personnel naviguant</p>
        </div>
        <div className="page-actions">
          <input
            type="text"
            className="filter-input"
            placeholder="Rechercher par nom ou matricule..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <button className="btn-primary" onClick={() => navigate('/gestion')}>
            <span className="material-symbols-outlined text-base">person_add</span>
            Nouveau Chauffeur
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="material-symbols-outlined text-muted">groups</span>
          </div>
          <div className="stat-val">{chauffeurs.length}</div>
          <div className="stat-lbl">Total Effectif</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="material-symbols-outlined text-secondary">directions_car</span>
          </div>
          <div className="stat-val text-secondary">{countByStatus('en_service')}</div>
          <div className="stat-lbl">En service</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="material-symbols-outlined text-amber">bed</span>
          </div>
          <div className="stat-val text-amber">{countByStatus('disponible')}</div>
          <div className="stat-lbl">Disponibles</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <div className="stat-val text-error">{countByStatus('suspendu')}</div>
          <div className="stat-lbl">Suspendus</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="loading">Chargement...</p>
      ) : (
        <div className="table-container">
          <div className="results">
            <table>
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th>Permis</th>
                  <th className="text-center">Statut</th>
                  <th>Véhicule</th>
                  <th>Embauche</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={i}>
                    <td>{c.matricule}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar-box">
                          <span className="material-symbols-outlined text-primary text-lg">person</span>
                        </div>
                        <span className="text-white font-medium">{c.nom}</span>
                      </div>
                    </td>
                    <td className="text-muted">{c.telephone || '—'}</td>
                    <td>
                      <span className="badge-code">
                        {c.permis_categorie || '—'}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${STATUT_BADGE[c.statut] || ''}`}>
                        {STATUT_LABEL[c.statut] || c.statut}
                      </span>
                    </td>
                    <td className={c.immatriculation ? 'text-white' : 'text-subtle italic'}>
                      {c.immatriculation || 'Non assigné'}
                    </td>
                    <td className="text-muted text-sm">
                      {c.date_embauche
                        ? new Date(c.date_embauche + 'T00:00:00').toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && !loading && (
            <div className="empty-state">
              <span className="material-symbols-outlined">person_off</span>
              <p>Aucun chauffeur trouvé</p>
            </div>
          )}
          <div className="table-footer">
            <span className="table-footer-text">
              Page {page} sur {totalPages}
            </span>
          </div>

          {totalPages > 1 && (
            <div className="pagination-bar">
              <button 
                className="btn-pagination" 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              <div className="pagination-info">
                Page <span className="current-page">{page}</span> sur {totalPages}
              </div>

              <button 
                className="btn-pagination" 
                disabled={page >= totalPages} 
                onClick={() => setPage(p => p + 1)}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
