import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchVehicules, fetchChauffeurs, fetchIncidents, deleteVehicule, deleteChauffeur, fetchUsers, deleteUser } from '../api'
import VehiculeForm from '../components/VehiculeForm'
import ChauffeurForm from '../components/ChauffeurForm'
import IncidentForm from '../components/IncidentForm'
import UserForm from '../components/UserForm'

const TAB_ICONS = {
  vehicules: 'directions_bus',
  chauffeurs: 'person',
  incidents: 'warning',
  users: 'manage_accounts',
}

export default function AdminPage() {
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'

  const TABS = [
    { id: 'vehicules', label: 'Véhicules' },
    { id: 'chauffeurs', label: 'Chauffeurs' },
    { id: 'incidents', label: 'Incidents' },
    ...(isAdmin ? [{ id: 'users', label: 'Utilisateurs' }] : []),
  ]

  const [tab, setTab] = useState('vehicules')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [vehicules, setVehicules] = useState([])
  const [allVehicules, setAllVehicules] = useState([]) // For forms
  const [chauffeurs, setChauffeurs] = useState([])
  const [incidents, setIncidents] = useState([])
  const [users, setUsers] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async (targetTab = tab, targetPage = page) => {
    setLoading(true)
    try {
      let res;
      if (targetTab === 'vehicules') {
        res = await fetchVehicules(targetPage)
        setVehicules(res.items)
        setTotalPages(res.pages)
        // Also fetch all for the chauffeur form dropdown if not already loaded or on refresh
        const allRes = await fetchVehicules(1, 1000)
        setAllVehicules(allRes.items)
      } else if (targetTab === 'chauffeurs') {
        res = await fetchChauffeurs(targetPage)
        setChauffeurs(res.items)
        setTotalPages(res.pages)
      } else if (targetTab === 'incidents') {
        res = await fetchIncidents(targetPage)
        setIncidents(res.items)
        setTotalPages(res.pages)
      } else if (targetTab === 'users' && isAdmin) {
        res = await fetchUsers(targetPage)
        setUsers(res.items)
        setTotalPages(res.pages)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(tab, page)
  }, [tab, page])

  const reload = () => fetchData(tab, page)

  const handleEdit = (item) => { setEditItem(item); setShowForm(true) }
  const handleAdd = () => { setEditItem(null); setShowForm(true) }
  const handleClose = () => { setShowForm(false); setEditItem(null) }
  const handleSaved = () => { handleClose(); reload() }

  const handleDeleteVehicule = async (id) => {
    if (!confirm('Retirer ce véhicule ?')) return
    await deleteVehicule(id)
    reload()
  }

  const handleDeleteChauffeur = async (id) => {
    if (!confirm('Suspendre ce chauffeur ?')) return
    await deleteChauffeur(id)
    reload()
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await deleteUser(id)
    reload()
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Centre de <span className="accent">Contrôle</span>
          </h1>
          <p className="page-subtitle">
            Administration centrale de la flotte{isAdmin ? ' et des utilisateurs' : ''}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`admin-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => { setTab(t.id); setPage(1); setShowForm(false) }}
          >
            <span className="material-symbols-outlined text-base">
              {TAB_ICONS[t.id]}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">Chargement...</p>
      ) : (
        <div className={showForm ? 'admin-split-layout' : ''}>
          {/* Main Area: Tables */}
          <div className="table-container">
            {/* ── Véhicules ─────────────────────────────── */}
            {tab === 'vehicules' && (
              <>
                <div className="admin-section-header">
                  <h2>Véhicules ({vehicules.length})</h2>
                  {!showForm && (
                    <button className="btn-primary" onClick={handleAdd}>
                      <span className="material-symbols-outlined text-base">add_circle</span>
                      Ajouter
                    </button>
                  )}
                </div>
                <div className="results">
                  <table>
                    <thead>
                      <tr>
                        <th>Immat.</th><th>Marque</th><th>Modèle</th><th>Type</th>
                        <th>Capacité</th><th>État</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicules.map(v => (
                        <tr key={v.id}>
                          <td>{v.immatriculation}</td>
                          <td className="text-white font-medium font-body">{v.marque}</td>
                          <td className="text-muted">{v.modele}</td>
                          <td className="text-muted">{v.type}</td>
                          <td className="text-slate">{v.capacite}</td>
                          <td>
                            <span className={`badge ${v.etat === 'actif' ? 'badge-green' : v.etat === 'maintenance' ? 'badge-orange' : 'badge-red'}`}>
                              {v.etat}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-sm btn-edit" onClick={() => handleEdit(v)}>Modifier</button>
                              {v.etat !== 'retire' && (
                                <button className="btn-sm btn-danger" onClick={() => handleDeleteVehicule(v.id)}>Retirer</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── Chauffeurs ────────────────────────────── */}
            {tab === 'chauffeurs' && (
              <>
                <div className="admin-section-header">
                  <h2>Chauffeurs ({chauffeurs.length})</h2>
                  {!showForm && (
                    <button className="btn-primary" onClick={handleAdd}>
                      <span className="material-symbols-outlined text-base">person_add</span>
                      Ajouter
                    </button>
                  )}
                </div>
                <div className="results">
                  <table>
                    <thead>
                      <tr>
                        <th>Matricule</th><th>Nom</th><th>Téléphone</th>
                        <th>Permis</th><th>Statut</th><th>Véhicule</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chauffeurs.map(c => (
                        <tr key={c.chauffeur_id}>
                          <td>{c.matricule}</td>
                          <td className="text-white font-medium font-body">{c.nom}</td>
                          <td className="text-muted">{c.telephone || '—'}</td>
                          <td className="text-muted">{c.permis_categorie || '—'}</td>
                          <td>
                            <span className={`badge ${c.statut === 'disponible' ? 'badge-green' : c.statut === 'en_service' ? 'badge-orange' : 'badge-red'}`}>
                              {c.statut}
                            </span>
                          </td>
                          <td className={c.immatriculation ? 'text-white' : 'text-subtle italic'}>
                            {c.immatriculation || '—'}
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-sm btn-edit" onClick={() => handleEdit(c)}>Modifier</button>
                              {c.statut !== 'suspendu' && (
                                <button className="btn-sm btn-danger" onClick={() => handleDeleteChauffeur(c.chauffeur_id)}>Suspendre</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── Incidents ─────────────────────────────── */}
            {tab === 'incidents' && (
              <>
                <div className="admin-section-header">
                  <h2>Incidents ({incidents.length})</h2>
                </div>
                <div className="results">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th><th>Type</th><th>Gravité</th><th>Description</th>
                        <th>Date</th><th>Ligne</th><th>Chauffeur</th><th>Résolu</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.map(inc => (
                        <tr key={inc.incident_id}>
                          <td>{inc.incident_id}</td>
                          <td className="text-muted">{inc.type_incident}</td>
                          <td>
                            <span className={`badge ${inc.gravite === 'faible' ? 'badge-green' : inc.gravite === 'moyenne' ? 'badge-orange' : 'badge-red'}`}>
                              {inc.gravite}
                            </span>
                          </td>
                          <td className="text-muted" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inc.description}
                          </td>
                          <td className="text-subtle text-sm">
                            {new Date(inc.date_incident).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="text-muted">{inc.nom_ligne}</td>
                          <td className="text-muted">{inc.chauffeur_nom}</td>
                          <td>
                            {inc.resolu
                              ? <span className="badge badge-green">Oui</span>
                              : <span className="badge badge-red">Non</span>}
                          </td>
                          <td>
                            <button className="btn-sm btn-edit" onClick={() => handleEdit(inc)}>Modifier</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── Utilisateurs (Admin only) ──────────── */}
            {tab === 'users' && isAdmin && (
              <>
                <div className="admin-section-header">
                  <h2>Utilisateurs ({users.length})</h2>
                  {!showForm && (
                    <button className="btn-primary" onClick={handleAdd}>
                      <span className="material-symbols-outlined text-base">person_add</span>
                      Ajouter
                    </button>
                  )}
                </div>
                <div className="results">
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th><th>Nom</th><th>Rôle</th><th>Créé le</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>{u.username}</td>
                          <td className="text-white font-medium font-body">{u.nom || '—'}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-green'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="text-subtle text-sm">
                            {new Date(u.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-sm btn-edit" onClick={() => handleEdit(u)}>Modifier</button>
                              {u.username !== currentUser.username && (
                                <button className="btn-sm btn-danger" onClick={() => handleDeleteUser(u.id)}>Supprimer</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Pagination Controls */}
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

          {/* Side Panel: Forms */}
          {showForm && (
            <div className="form-side-panel">
              {tab === 'vehicules' && <VehiculeForm item={editItem} onSave={handleSaved} onCancel={handleClose} />}
              {tab === 'chauffeurs' && <ChauffeurForm item={editItem} vehicules={allVehicules} onSave={handleSaved} onCancel={handleClose} />}
              {tab === 'incidents' && <IncidentForm item={editItem} onSave={handleSaved} onCancel={handleClose} />}
              {tab === 'users' && <UserForm item={editItem} onSave={handleSaved} onCancel={handleClose} />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
