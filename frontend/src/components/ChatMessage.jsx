import { useState } from 'react'
import ResultsTable from './ResultsTable'

export default function ChatMessage({ role, text, sql, data }) {
  const [showSql, setShowSql] = useState(false)

  if (role === 'user') {
    return (
      <div className="msg-user">
        <div className="msg-bubble-user">{text}</div>
      </div>
    )
  }

  return (
    <div className="msg-bot">
      <div className="msg-bot-icon">
        <span className="material-symbols-outlined">smart_toy</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
        <div className="msg-bubble-bot">
          {text}
          {sql && (
            <>
              <button
                onClick={() => setShowSql(!showSql)}
                style={{
                  display: 'block',
                  marginTop: '0.8rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {showSql ? 'Masquer SQL ▲' : 'Voir SQL ▼'}
              </button>
              {showSql && (
                <div style={{
                  marginTop: '0.5rem',
                  background: 'var(--surface)',
                  border: '1px solid rgba(83,221,252,0.2)',
                  borderRadius: '0.75rem',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    padding: '0.4rem 1rem', 
                    fontSize: '0.65rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em', 
                    color: '#64748b', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>database</span>
                    SQL QUERY - ANALYTICS_ENGINE_V2
                  </div>
                  <pre style={{
                    padding: '0.75rem 1rem',
                    fontSize: '0.75rem',
                    color: '#53ddfc',
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    margin: 0
                  }}>
                    {sql}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
        {data && (
          <div style={{ 
            background: 'var(--surface)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '0.75rem', 
            overflow: 'hidden' 
          }}>
            <ResultsTable data={data} />
          </div>
        )}
      </div>
    </div>
  )
}
