import { useState } from 'react'
import { createChauffeur, updateChauffeur } from '../api'

export default function ChauffeurForm({ item, vehicules, onSave, onCancel }) {
  const isEdit = !!item
  const [form, setForm] = useState({
    matricule: item?.matricule || '',
    nom: item?.nom || '',
    telephone: item?.telephone || '',
    permis_categorie: item?.permis_categorie || 'D',
    statut: item?.statut || 'disponible',
    vehicule_id: item?.vehicule_id || '',
    date_embauche: item?.date_embauche || '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = { ...form }
      data.vehicule_id = data.vehicule_id ? Number(data.vehicule_id) : null
      if (!data.date_embauche) delete data.date_embauche
      if (!data.telephone) delete data.telephone
      if (isEdit) {
        await updateChauffeur(item.chauffeur_id, data)
      } else {
        await createChauffeur(data)
      }
      onSave()
    } catch (err) {
      setError(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const availableVehicules = vehicules?.filter(v => v.etat === 'actif') || []

  return (
    <div className="chauffeur-form-modern">
      <h3>
        <span className="material-symbols-outlined">person</span>
        {isEdit ? 'Modifier le chauffeur' : 'Nouveau Chauffeur'}
      </h3>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="uppercase">Nom complet</label>
            <input 
              placeholder="Ex: Amadou Diop" 
              value={form.nom} 
              onChange={e => setForm({ ...form, nom: e.target.value })} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="uppercase">Matricule</label>
              <input 
                placeholder="M-XXXX" 
                value={form.matricule} 
                onChange={e => setForm({ ...form, matricule: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="uppercase">Téléphone</label>
              <input 
                placeholder="+221..." 
                value={form.telephone} 
                onChange={e => setForm({ ...form, telephone: e.target.value })} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="uppercase">Permis</label>
              <select value={form.permis_categorie} onChange={e => setForm({ ...form, permis_categorie: e.target.value })}>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
            <div className="form-group">
              <label className="uppercase">Statut</label>
              <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                <option value="disponible">Disponible</option>
                <option value="en_service">En service</option>
                <option value="conge">En congé</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="uppercase">Véhicule Assigné</label>
            <select value={form.vehicule_id} onChange={e => setForm({ ...form, vehicule_id: e.target.value })}>
              <option value="">— Aucun —</option>
              {availableVehicules.map(v => (
                <option key={v.id} value={v.id}>{v.immatriculation} ({v.marque} {v.modele})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="uppercase">Date d'embauche</label>
            <input type="date" value={form.date_embauche} onChange={e => setForm({ ...form, date_embauche: e.target.value })} />
          </div>
        </div>

        <div className="form-actions flex-col" style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour le profil' : 'Créer le profil'}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel} style={{ marginTop: '0.5rem' }}>
            Annuler
          </button>
        </div>

        <div className="form-info-box">
          <span className="material-symbols-outlined">shield</span>
          <p>
            Les informations personnelles sont cryptées et accessibles uniquement par le personnel autorisé.
          </p>
        </div>
      </form>
    </div>
  )
}
