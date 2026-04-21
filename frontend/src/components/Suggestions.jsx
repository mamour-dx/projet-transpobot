const SUGGESTIONS = [
  { icon: 'route',      label: 'Trajets du mois',   question: 'Combien de trajets ont été effectués ce mois-ci ?' },
  { icon: 'emoji_events', label: 'Top chauffeur',   question: 'Quel chauffeur a le plus de trajets terminés ?' },
  { icon: 'build',      label: 'Maintenance',        question: 'Quels véhicules sont en maintenance ?' },
  { icon: 'warning',    label: 'Incidents',          question: 'Liste les incidents graves non résolus' },
  { icon: 'account_balance_wallet', label: 'Recettes', question: 'Quelle est la recette totale de ce mois ?' },
]

export default function Suggestions({ onSend }) {
  return (
    <div className="chat-suggestions" style={{ padding: '0.75rem 1.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
      {SUGGESTIONS.map((s, i) => (
        <button key={i} className="chip" onClick={() => onSend(s.question)} title={s.question}>
          <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>{s.icon}</span>
          {s.label}
        </button>
      ))}
    </div>
  )
}
