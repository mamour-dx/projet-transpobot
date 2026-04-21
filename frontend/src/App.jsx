import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navigation from './components/Navigation'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AssistantPage from './pages/AssistantPage'
import VehiculesPage from './pages/VehiculesPage'
import ChauffeurPage from './pages/ChauffeurPage'
import AdminPage from './pages/AdminPage'

function App() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <>
      <Navigation />
      <div className="app-body">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/vehicules" element={<VehiculesPage />} />
          <Route path="/chauffeurs" element={<ChauffeurPage />} />
          <Route path="/gestion" element={<AdminPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App
