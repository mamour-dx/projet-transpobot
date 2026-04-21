import { useState } from 'react'
import { createUser, updateUser } from '../api'

export default function UserForm({ item, onSave, onCancel }) {
  const isEdit = !!item
  const [form, setForm] = useState({
    username: item?.username || '',
    nom: item?.nom || '',
    role: item?.role || 'gestionnaire',
    password: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        const data = { username: form.username, nom: form.nom, role: form.role }
        if (form.password) data.password = form.password
        await updateUser(item.id, data)
      } else {
        if (!form.password) {
          setError('Le mot de passe est requis pour un nouvel utilisateur')
          setSaving(false)
          return
        }
        await createUser(form)
      }
      onSave()
    } catch (err) {
      setError(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="user-form-modern">
      <h3>
        <span className="material-symbols-outlined">manage_accounts</span>
        {isEdit ? 'Profil Utilisateur' : 'Nouvel Utilisateur'}
      </h3>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="uppercase">Nom d'utilisateur</label>
            <input 
              placeholder="Ex: adiouma92" 
              value={form.username} 
              onChange={e => setForm({ ...form, username: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="uppercase">Nom complet</label>
            <input 
              placeholder="Ex: Adiouma SOW" 
              value={form.nom} 
              onChange={e => setForm({ ...form, nom: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label className="uppercase">Rôle Système</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="gestionnaire">Gestionnaire (Standard)</option>
              <option value="admin">Administrateur (Total)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="uppercase">
              {isEdit ? 'Changer le mot de passe' : 'Mot de passe initial'}
            </label>
            <input 
              type="password" 
              placeholder={isEdit ? 'Laisser vide pour inchangé' : 'Requis'} 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
              {...(!isEdit ? { required: true } : {})} 
            />
          </div>
        </div>

        <div className="form-actions flex-col" style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Enregistrement...' : isEdit ? 'Sauvegarder les modifications' : 'Créer l\'utilisateur'}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel} style={{ marginTop: '0.5rem' }}>
            Annuler
          </button>
        </div>

        <div className="form-info-box">
          <span className="material-symbols-outlined">security</span>
          <p>
            L'attribution du rôle Administrateur donne un accès complet aux logs de sécurité et à la gestion des comptes.
          </p>
        </div>
      </form>
    </div>
  )
}
