import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../api'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import ResultsTable from '../components/ResultsTable'

const SUGGESTIONS = [
  { icon: 'route',      label: 'Trajets du mois',         question: 'Combien de trajets ont été effectués ce mois-ci ?' },
  { icon: 'emoji_events', label: 'Top chauffeur',         question: 'Quel chauffeur a le plus de trajets terminés ?' },
  { icon: 'build',      label: 'Véhicules en maintenance', question: 'Quels véhicules sont en maintenance ?' },
  { icon: 'warning',    label: 'Incidents graves',         question: 'Liste les incidents graves non résolus' },
  { icon: 'account_balance_wallet', label: 'Recettes',    question: 'Quelle est la recette totale de ce mois ?' },
  { icon: 'group',      label: 'Chauffeurs disponibles',   question: 'Quels chauffeurs sont disponibles ?' },
]

export default function AssistantPage() {
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
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Erreur de connexion au serveur. Vérifiez que le backend est bien lancé.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="assistant-page">
      <div className="assistant-container">
        {/* Chat card */}
        <div className="assistant-chat glass-card">
          {/* Header */}
          <div className="chat-header">
            <div className="flex items-center gap-4">
              <div className="chat-bot-avatar">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div>
                <h2 className="font-headline text-lg font-bold text-white">
                  TranspoBot IA
                </h2>
                <div className="flex items-center gap-2">
                  <div className="chat-online-dot" />
                  <span className="text-xs text-muted uppercase tracking-wide font-medium">
                    En ligne
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages" ref={chatBoxRef}>
            {messages.length === 0 && !loading && (
              <div className="assistant-welcome">
                <div className="assistant-welcome-icon">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <h3>Bonjour ! Je suis TranspoBot</h3>
                <p>Posez-moi vos questions sur la flotte, les trajets, les chauffeurs ou les incidents. Essayez une suggestion ci-dessous.</p>

                <div className="assistant-suggestions-grid">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="assistant-suggestion-card" onClick={() => handleSend(s.question)}>
                      <span className="material-symbols-outlined text-xl text-primary">
                        {s.icon}
                      </span>
                      <span className="assistant-suggestion-label">{s.label}</span>
                      <span className="assistant-suggestion-desc">{s.question}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <>
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} text={msg.text} sql={msg.sql} data={msg.data} />
                ))}
              </>
            )}

            {loading && (
              <div className="flex gap-3">
                <div className="msg-bot-icon">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div className="msg-bubble-bot flex items-center gap-1" style={{ padding: '0.75rem 1rem' }}>
                  <span className="loading-dot delay-0" />
                  <span className="loading-dot delay-150" />
                  <span className="loading-dot delay-300" />
                </div>
              </div>
            )}
          </div>

          {/* Quick chips when conversation started */}
          {messages.length > 0 && (
            <div className="assistant-chips">
              {SUGGESTIONS.slice(0, 4).map((s, i) => (
                <button key={i} className="chip" onClick={() => handleSend(s.question)} title={s.question}>
                  <span className="material-symbols-outlined text-sm">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>

      </div>
    </div>
  )
}
