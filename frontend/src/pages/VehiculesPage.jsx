import { useState, useEffect } from 'react'
import { fetchVehicules } from '../api'
import { useNavigate } from 'react-router-dom'

const ETAT_BADGE = {
  actif: 'badge-green',
  maintenance: 'badge-orange',
  retire: 'badge-red',
}

const ETAT_LABEL = {
  actif: 'Actif',
  maintenance: 'Maintenance',
  retire: 'Retiré',
}

export default function VehiculesPage() {
  const navigate = useNavigate()
  const [vehicules, setVehicules] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetchVehicules(page, 10)
      .then(res => {
        setVehicules(res.items)
        setTotalPages(res.pages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  const filtered = vehicules.filter(v =>
    v.immatriculation.toLowerCase().includes(filter.toLowerCase()) ||
    v.marque.toLowerCase().includes(filter.toLowerCase()) ||
    v.modele.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Véhicules
            <span className="badge-count">
              {vehicules.length} unités
            </span>
          </h1>
          <p className="page-subtitle">
            Supervision en temps réel de votre flotte logistique
          </p>
        </div>
        <div className="page-actions">
          <input
            type="text"
            className="filter-input"
            placeholder="Rechercher par immatriculation..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <button className="btn-primary" onClick={() => navigate('/gestion')}>
            <span className="material-symbols-outlined text-base">add_circle</span>
            Ajouter
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Chargement...</p>
      ) : (
        <div className="table-container">
          <div className="results">
            <table>
              <thead>
                <tr>
                  <th>Immatriculation</th>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Type</th>
                  <th>Capacité</th>
                  <th>État</th>
                  <th>Kilométrage</th>
                  <th>Mise en service</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr key={i}>
                    <td>{v.immatriculation}</td>
                    <td className="text-white font-medium font-body">{v.marque}</td>
                    <td className="text-subtle text-sm">{v.modele}</td>
                    <td className="text-muted">{v.type}</td>
                    <td className="text-slate text-center">{v.capacite}</td>
                    <td>
                      <span className={`badge ${ETAT_BADGE[v.etat] || ''}`}>
                        {ETAT_LABEL[v.etat] || v.etat}
                      </span>
                    </td>
                    <td className="text-muted">{v.kilometrage?.toLocaleString('fr-FR')} km</td>
                    <td className="text-subtle text-sm">
                      {v.date_mise_service
                        ? new Date(v.date_mise_service + 'T00:00:00').toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && !loading && (
            <div className="empty-state">
              <span className="material-symbols-outlined">directions_bus_filled</span>
              <p>Aucun véhicule trouvé</p>
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
