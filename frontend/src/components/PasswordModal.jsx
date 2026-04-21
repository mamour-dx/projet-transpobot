import { useState } from 'react'
import { changePassword } from '../api'

export default function PasswordModal({ onClose }) {
  const [current, setCurrent] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPwd.length < 4) {
      setError('Le nouveau mot de passe doit contenir au moins 4 caractères')
      return
    }
    if (newPwd !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    try {
      await changePassword(current, newPwd)
      setSuccess('Mot de passe modifié avec succès !')
      setTimeout(onClose, 1500)
    } catch (err) {
      setError(err.message || 'Erreur lors du changement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h3>Changer le mot de passe</h3>
        <p className="modal-subtitle">Sécurisez votre compte avec un nouveau mot de passe robuste.</p>

        {error && (
          <div className="form-error">
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>error</span>
            {error}
          </div>
        )}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label>Ancien mot de passe</label>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{
                position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                color: '#475569', pointerEvents: 'none', fontSize: '1.1rem',
              }}>lock_open</span>
              <input
                type="password"
                value={current}
                onChange={e => setCurrent(e.target.value)}
                placeholder="••••••••••••"
                required
                autoFocus
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  color: '#475569', pointerEvents: 'none', fontSize: '1.1rem',
                }}>key</span>
                <input
                  type="password"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Confirmer</label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  color: '#475569', pointerEvents: 'none', fontSize: '1.1rem',
                }}>verified_user</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-login" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Modification...' : 'Confirmer la modification'}
            </button>
            <button type="button" onClick={onClose} style={{
              background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
              fontSize: '0.875rem', textAlign: 'center', padding: '0.5rem',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}
            >
              Annuler
            </button>
          </div>
        </form>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          opacity: 0.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>shield</span>
            Chiffrement AES-256
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>history</span>
            Sécurisé
          </div>
        </div>
      </div>
    </div>
  )
}
