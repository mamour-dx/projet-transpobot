import { useState } from 'react'
import { createVehicule, updateVehicule } from '../api'

export default function VehiculeForm({ item, onSave, onCancel }) {
  const isEdit = !!item
  const [form, setForm] = useState({
    immatriculation: item?.immatriculation || '',
    marque: item?.marque || '',
    modele: item?.modele || '',
    type: item?.type || 'bus',
    capacite: item?.capacite || '',
    etat: item?.etat || 'actif',
    kilometrage: item?.kilometrage || 0,
    date_mise_service: item?.date_mise_service || '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = { ...form, capacite: Number(form.capacite), kilometrage: Number(form.kilometrage) }
      if (!data.date_mise_service) delete data.date_mise_service
      if (isEdit) {
        await updateVehicule(item.id, data)
      } else {
        await createVehicule(data)
      }
      onSave()
    } catch (err) {
      setError(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="vehicule-form-modern">
      <h3>
        <span className="material-symbols-outlined">directions_bus</span>
        {isEdit ? 'Modifier le véhicule' : 'Nouveau Véhicule'}
      </h3>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="uppercase">Nom du Véhicule</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                placeholder="Marque" 
                value={form.marque} 
                onChange={e => setForm({ ...form, marque: e.target.value })} 
                required 
                className="w-full"
              />
              <input 
                placeholder="Modèle" 
                value={form.modele} 
                onChange={e => setForm({ ...form, modele: e.target.value })} 
                required 
                className="w-full"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="uppercase">Identifiant Unique</label>
            <input 
              placeholder="Ex: ID-XXXXXX" 
              value={form.immatriculation} 
              onChange={e => setForm({ ...form, immatriculation: e.target.value })} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="uppercase">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="bus">Bus</option>
                <option value="minibus">Minibus</option>
                <option value="car">Car</option>
              </select>
            </div>
            <div className="form-group">
              <label className="uppercase">Statut</label>
              <select value={form.etat} onChange={e => setForm({ ...form, etat: e.target.value })}>
                <option value="actif">Actif</option>
                <option value="maintenance">Maintenance</option>
                <option value="retire">Retiré</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="uppercase">Capacité (Pers.)</label>
              <input 
                type="number" 
                value={form.capacite} 
                onChange={e => setForm({ ...form, capacite: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="uppercase">Kilométrage</label>
              <input 
                type="number" 
                value={form.kilometrage} 
                onChange={e => setForm({ ...form, kilometrage: e.target.value })} 
              />
            </div>
          </div>
        </div>

        <div className="form-actions flex-col" style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Enregistrement...' : isEdit ? 'Sauvegarder les modifications' : 'Créer le véhicule'}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel} style={{ marginTop: '0.5rem' }}>
            Annuler l'opération
          </button>
        </div>

        <div className="form-info-box">
          <span className="material-symbols-outlined">info</span>
          <p>
            Toutes les entrées sont auditées en temps réel pour garantir l'intégrité des données de la flotte.
          </p>
        </div>
      </form>
    </div>
  )
}
