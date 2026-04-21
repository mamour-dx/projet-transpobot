import { useState, useEffect } from 'react'
import { fetchHistory, clearHistory } from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function HistoryPanel({ refreshKey }) {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.role === 'admin'

  const loadHistory = () => {
    setLoading(true)
    fetchHistory()
      .then(data => { setHistory(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadHistory() }, [refreshKey])

  const handleClear = async () => {
    await clearHistory()
    setHistory([])
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="history-panel">
      <div className="panel-header">
        <span className="panel-title">
          <span className="material-symbols-outlined">history</span>
          {isAdmin ? 'Historique global' : 'Mon historique'}
        </span>
        {history.length > 0 && (
          <button className="panel-see-all" onClick={handleClear}>Effacer</button>
        )}
      </div>

      {loading ? (
        <p className="loading" style={{ padding: '1.5rem', fontSize: '0.8rem' }}>Chargement...</p>
      ) : history.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem 1.25rem' }}>
          <span className="material-symbols-outlined">chat_bubble</span>
          <p style={{ fontSize: '0.8rem' }}>Aucune conversation</p>
        </div>
      ) : (
        history.slice(0, 15).map((item, i) => (
          <div className="history-item" key={i}>
            <div className="history-item-query">
              {item.question.length > 55 ? item.question.slice(0, 55) + '...' : item.question}
            </div>
            <div className="history-item-meta">
              {isAdmin && item.username && (
                <span className="history-user-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: '0.7rem' }}>person</span>
                  {item.username}
                </span>
              )}
              {formatDate(item.created_at)} · {item.nb_resultats} résultat{item.nb_resultats !== 1 ? 's' : ''}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
