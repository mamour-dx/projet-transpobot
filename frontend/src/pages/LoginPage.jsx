import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="material-symbols-outlined">directions_bus</span>
        </div>

        {/* Header */}
        <div className="login-header">
          <h1>TranspoBot</h1>
          <p>Plateforme de gestion de flotte intelligente</p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="login-input-wrap">
              <span className="material-symbols-outlined">person</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Votre identifiant"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="login-input-wrap">
              <span className="material-symbols-outlined">lock</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer-links">
          {['Privacité', 'Conditions', 'Support 24/7'].map(label => (
            <span key={label} className="login-footer-link">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Ambient decor */}
      <div className="bg-decor-top" />
      <div className="bg-decor-bottom" />
    </div>
  )
}
