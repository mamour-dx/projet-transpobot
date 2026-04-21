import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../api'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import Suggestions from './Suggestions'
import ResultsTable from './ResultsTable'

export default function ChatPanel({ onNewMessage }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const chatBoxRef = useRef(null)

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (question) => {
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setLoading(true)

    try {
      const data = await sendChatMessage(question)

      if (data.detail) {
        setMessages(prev => [...prev, { role: 'bot', text: `${data.detail}` }])
      } else {
        const hasData = data.data && data.data.length > 0
        const count = data.count || 0

        let botText = data.answer || 'Réponse reçue.'

        if (data.sql && count === 0) {
          botText += '\n\nAucun résultat trouvé pour cette requête.'
        } else if (count > 0) {
          botText += `\n\n${count} résultat${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}.`
        }

        setMessages(prev => [...prev, {
          role: 'bot',
          text: botText,
          sql: data.sql,
          data: hasData ? data.data : null
        }])
      }

      if (onNewMessage) onNewMessage()
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Erreur de connexion au serveur. Vérifiez que le backend est bien lancé.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card card-chat" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="chat-bot-avatar">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              TranspoBot IA
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div className="chat-online-dot" />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
                En ligne
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <Suggestions onSend={handleSend} />

      {/* Messages */}
      <div className="chat-messages" ref={chatBoxRef}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#475569' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#1e293b', display: 'block', marginBottom: '0.75rem' }}>smart_toy</span>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Bonjour ! Posez-moi vos questions sur la flotte, les trajets, les chauffeurs ou les incidents.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} text={msg.text} sql={msg.sql} data={msg.data} />
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="msg-bot-icon">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
            <div className="msg-bubble-bot" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.75rem 1rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#53ddfc', animation: 'bounce 1s infinite 0ms' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#53ddfc', animation: 'bounce 1s infinite 150ms' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#53ddfc', animation: 'bounce 1s infinite 300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={loading} />

    </div>
  )
}
