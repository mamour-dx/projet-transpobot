import { useState } from 'react'
import { updateIncident } from '../api'

export default function IncidentForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState({
    resolu: item?.resolu || false,
    date_resolution: item?.date_resolution ? item.date_resolution.slice(0, 16) : '',
    gravite: item?.gravite || 'faible',
    description: item?.description || '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleResoluChange = (checked) => {
    setForm({
      ...form,
      resolu: checked,
      date_resolution: checked && !form.date_resolution
        ? new Date().toISOString().slice(0, 16)
        : checked ? form.date_resolution : '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = { ...form }
      if (!data.date_resolution) data.date_resolution = null
      await updateIncident(item.incident_id, data)
      onSave()
    } catch (err) {
      setError(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="incident-form-modern">
      <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>warning</span>
        Gestion de l'Incident #{item.incident_id}
      </h3>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="uppercase">Gravité</label>
            <select value={form.gravite} onChange={e => setForm({ ...form, gravite: e.target.value })}>
              <option value="faible">Faible</option>
              <option value="moyenne">Moyenne</option>
              <option value="elevee">Élevée</option>
              <option value="critique">Critique</option>
            </select>
          </div>

          <div className="form-group">
            <label className="uppercase" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem 0', color: '#fff' }}>
              <input
                type="checkbox"
                checked={form.resolu}
                onChange={e => handleResoluChange(e.target.checked)}
                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--secondary)' }}
              />
              Marquer comme Résolu
            </label>
          </div>

          {form.resolu && (
            <div className="form-group animate-fade-in">
              <label className="uppercase">Date de résolution</label>
              <input 
                type="datetime-local" 
                value={form.date_resolution} 
                onChange={e => setForm({ ...form, date_resolution: e.target.value })} 
              />
            </div>
          )}

          <div className="form-group">
            <label className="uppercase">Description & Notes</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Détails de l'incident..."
              className="w-full"
            />
          </div>
        </div>

        <div className="form-actions flex-col" style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Traitement...' : 'Mettre à jour l\'incident'}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel} style={{ marginTop: '0.5rem' }}>
            Fermer sans enregistrer
          </button>
        </div>

        <div className="form-info-box">
          <span className="material-symbols-outlined">history</span>
          <p>
            Toute modification d'incident génère une entrée d'historique immuable pour les futurs audits de sécurité.
          </p>
        </div>
      </form>
    </div>
  )
}
