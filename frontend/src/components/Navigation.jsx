import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import PasswordModal from './PasswordModal'

export default function Navigation() {
  const { user, logout } = useAuth()
  const [showPwdModal, setShowPwdModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = (user?.nom || user?.username || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className="top-nav">
        {/* Brand */}
        <NavLink to="/" className="nav-brand" onClick={closeMenu}>
          <span className="material-symbols-outlined">rocket_launch</span>
          <span className="nav-brand-text">TranspoBot</span>
        </NavLink>

        {/* Desktop nav — hidden on mobile */}
        <div className="nav-desktop">
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Tableau de bord
            </NavLink>
            <NavLink to="/vehicules" className={({ isActive }) => isActive ? 'active' : ''}>
              Véhicules
            </NavLink>
            <NavLink to="/chauffeurs" className={({ isActive }) => isActive ? 'active' : ''}>
              Chauffeurs
            </NavLink>
            <NavLink to="/gestion" className={({ isActive }) => isActive ? 'active' : ''}>
              Gestion
            </NavLink>
            <NavLink to="/assistant" className={({ isActive }) => isActive ? 'active chatbot-link' : 'chatbot-link'} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>bolt</span>
              Chatbot IA
            </NavLink>
          </div>

          <div className="nav-actions">
            <span className="nav-role-chip">{user?.role}</span>
            <button
              className="nav-icon-btn"
              onClick={() => setShowPwdModal(true)}
              title="Changer le mot de passe"
            >
              <span className="material-symbols-outlined">lock</span>
            </button>
            <div className="nav-user-avatar" title={user?.nom || user?.username}>
              {initials}
            </div>
            <button className="nav-icon-btn danger" onClick={logout} title="Se déconnecter">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>

        {/* Hamburger button (mobile only) */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className="material-symbols-outlined">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </nav>

      {/* Mobile overlay — outside top-nav to avoid transform stacking context */}
      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}

      {/* Mobile drawer — outside top-nav so position:fixed works relative to viewport */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Tableau de bord
          </NavLink>
          <NavLink to="/vehicules" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Véhicules
          </NavLink>
          <NavLink to="/chauffeurs" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Chauffeurs
          </NavLink>
          <NavLink to="/gestion" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Gestion
          </NavLink>
          <NavLink to="/assistant" className={({ isActive }) => isActive ? 'active chatbot-link' : 'chatbot-link'} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>bolt</span>
            Chatbot IA
          </NavLink>
        </div>

        <div className="nav-actions">
          <span className="nav-role-chip">{user?.role}</span>
          <button
            className="nav-icon-btn"
            onClick={() => { setShowPwdModal(true); closeMenu() }}
            title="Changer le mot de passe"
          >
            <span className="material-symbols-outlined">lock</span>
          </button>
          <div className="nav-user-avatar" title={user?.nom || user?.username}>
            {initials}
          </div>
          <button className="nav-icon-btn danger" onClick={logout} title="Se déconnecter">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>

      {showPwdModal && <PasswordModal onClose={() => setShowPwdModal(false)} />}

      {/* Ambient decorations */}
      <div className="bg-decor-top" />
      <div className="bg-decor-bottom" />
    </>
  )
}
