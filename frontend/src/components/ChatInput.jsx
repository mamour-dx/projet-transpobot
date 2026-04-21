import { useState, useRef } from 'react'
import { transcribeAudio } from '../api'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const mediaRecRef = useRef(null)
  const chunksRef = useRef([])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRec = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      mediaRec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        if (blob.size < 1000) return

        setTranscribing(true)
        try {
          const result = await transcribeAudio(blob)
          if (result.text) {
            setText(prev => prev ? prev + ' ' + result.text : result.text)
          }
        } catch (err) {
          console.error('[mic] transcription failed:', err)
        } finally {
          setTranscribing(false)
        }
      }

      mediaRecRef.current = mediaRec
      mediaRec.start()
      setRecording(true)
    } catch (err) {
      console.error('[mic] getUserMedia failed:', err)
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions de votre navigateur.')
    }
  }

  const stopRecording = () => {
    if (mediaRecRef.current && mediaRecRef.current.state === 'recording') {
      mediaRecRef.current.stop()
      mediaRecRef.current = null
    }
    setRecording(false)
  }

  const toggleMic = () => {
    if (recording) stopRecording()
    else startRecording()
  }

  return (
    <div className="chat-footer">
      <div className="chat-input-row">
        <div className="chat-input-wrap">
          <input
            className="chat-input"
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={
              recording ? 'Parlez maintenant...'
              : transcribing ? 'Transcription en cours...'
              : 'Posez une question sur la flotte...'
            }
            disabled={disabled || transcribing}
          />
        </div>

        <button
          className={`chat-mic-btn${recording ? ' recording' : ''}`}
          onClick={toggleMic}
          disabled={disabled || transcribing}
          type="button"
          title={recording ? "Arrêter l'enregistrement" : 'Dictée vocale'}
        >
          {transcribing ? (
            <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite', fontSize: '1.25rem' }}>
              progress_activity
            </span>
          ) : (
            <span className="material-symbols-outlined" style={{
              fontSize: '1.25rem',
              fontVariationSettings: recording ? "'FILL' 1" : "'FILL' 0",
            }}>
              mic
            </span>
          )}
        </button>

        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          type="button"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>send</span>
        </button>
      </div>
    </div>
  )
}
