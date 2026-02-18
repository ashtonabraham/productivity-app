import { useState, useEffect, useRef } from 'react'

const PRESETS = [
  { label: '15 min', minutes: 15 },
  { label: '25 min', minutes: 25 },
  { label: '45 min', minutes: 45 },
]
const BREAK_MINUTES = 5

export default function FocusTimer({ onPhaseChange }) {
  const [phase, setPhase] = useState('idle') // idle | work | break
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [workMinutes, setWorkMinutes] = useState(25)
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  useEffect(() => {
    onPhaseChange?.(phase)
  }, [phase, onPhaseChange])

  const stop = () => {
    setPhase('idle')
  }

  const startWork = (minutes) => {
    setWorkMinutes(minutes)
    setSecondsLeft(minutes * 60)
    setPhase('work')
  }

  useEffect(() => {
    if (phase !== 'work' && phase !== 'break') return
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          if (phaseRef.current === 'work') {
            setPhase('break')
            return BREAK_MINUTES * 60
          }
          setPhase('idle')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  const m = Math.floor(secondsLeft / 60)
  const s = secondsLeft % 60
  const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return (
    <div className="timer">
      {phase === 'idle' && (
        <>
          <h2 className="section-label">⏱️ FOCUS</h2>
          <div className="timer-presets">
            {PRESETS.map(({ label, minutes }) => (
              <button
                key={minutes}
                type="button"
                className="timer-preset"
                onClick={() => startWork(minutes)}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="muted small">Work session, then 5 min break.</p>
        </>
      )}
      {(phase === 'work' || phase === 'break') && (
        <>
          <h2 className="section-label timer-label">⏱️ FOCUS</h2>
          <div className="timer-display" data-phase={phase}>
            {timeStr}
          </div>
          <button type="button" className="btn-danger" onClick={stop}>
            ⏹️ Stop
          </button>
        </>
      )}
    </div>
  )
}
