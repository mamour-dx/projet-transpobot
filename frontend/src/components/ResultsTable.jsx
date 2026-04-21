const COLUMN_LABELS = {
  trajet_id: 'Trajet',
  numero_ligne: 'Ligne',
  nom_ligne: 'Nom ligne',
  chauffeur_nom: 'Chauffeur',
  chauffeur_matricule: 'Matricule',
  immatriculation: 'Véhicule',
  marque: 'Marque',
  modele: 'Modèle',
  type_vehicule: 'Type',
  date_depart: 'Départ',
  date_arrivee: 'Arrivée',
  date_incident: 'Date incident',
  date_embauche: 'Embauche',
  nb_passagers: 'Passagers',
  recette: 'Recette (FCFA)',
  statut: 'Statut',
  etat_vehicule: 'État',
  gravite: 'Gravité',
  type_incident: 'Type',
  description: 'Description',
  resolu: 'Résolu',
  duree_reelle_minutes: 'Durée (min)',
  kilometrage: 'Km',
  capacite: 'Capacité',
  distance_km: 'Distance (km)',
  prix: 'Prix (FCFA)',
  categorie: 'Catégorie',
  nb_trajets: 'Nb trajets',
  recette_totale: 'Recette totale',
  total_passagers: 'Total passagers',
  incident_id: 'ID',
}

function formatValue(key, val) {
  if (val === null || val === undefined) return '—'
  if (val === true) return 'Oui'
  if (val === false) return 'Non'

  // Dates ISO
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}/.test(val)) {
    return new Date(val).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return new Date(val + 'T00:00:00').toLocaleDateString('fr-FR')
  }

  // Monétaire
  if (typeof val === 'number' && (key.includes('recette') || key.includes('prix'))) {
    return val.toLocaleString('fr-FR') + ' FCFA'
  }

  return String(val)
}

function exportCSV(data, keys) {
  const header = keys.map(k => COLUMN_LABELS[k] || k)
  const rows = data.map(row => keys.map(k => {
    const val = row[k]
    if (val === null || val === undefined) return ''
    if (val === true) return 'Oui'
    if (val === false) return 'Non'
    const str = String(val)
    // Escape CSV: wrap in quotes if contains comma, quote, or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"'
    }
    return str
  }))

  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transpobot_resultats_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ResultsTable({ data }) {
  if (!data || data.length === 0) return null

  const keys = Object.keys(data[0])

  return (
    <div className="results-table-wrapper">
      <div className="results-table-header">
        <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--primary)' }}>
          table_chart
        </span>
        <span>Résultats ({data.length})</span>
        <button className="export-csv-btn" onClick={() => exportCSV(data, keys)} title="Exporter en CSV">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>download</span>
          CSV
        </button>
      </div>
      <div className="results-table-scroll">
        <table>
          <thead>
            <tr>
              {keys.map(k => <th key={k}>{COLUMN_LABELS[k] || k}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {keys.map(k => <td key={k}>{formatValue(k, row[k])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
