import FocusTimer from './FocusTimer'

export default function Today({
  tasks,
  todayFocus,
  isDoneToday,
  onPromote,
  onRemoveFromToday,
  onToggleDone,
  onWrapUp,
  onUnwrap,
  todayWrapped,
}) {
  const focusTasks = todayFocus
    .map(id => tasks.find(t => t.id === id))
    .filter(Boolean)

  const canAddMore = todayFocus.length < 3
  const backlog = tasks.filter(t => !todayFocus.includes(t.id))

  return (
    <div className="today">
      <h1 className="page-title">Today</h1>

      <section className="focus-section">
        <h2 className="section-label">Top 3</h2>
        {focusTasks.length === 0 && !todayWrapped && (
          <p className="muted">Pick up to 3 tasks from the backlog to focus on today.</p>
        )}
        {todayWrapped && (
          <>
            <p className="muted">You're done for the day!</p>
            <button type="button" className="btn-primary" onClick={onUnwrap} style={{ marginTop: '0.75rem' }}>
              Unlock day
            </button>
          </>
        )}
        <ul className="focus-list">
          {focusTasks.map((t, i) => (
            <li key={t.id} className="focus-item">
              <button
                type="button"
                className="check"
                onClick={() => onToggleDone(t.id)}
                aria-label={isDoneToday(t.id) ? 'Mark not done' : 'Mark done'}
              >
                {isDoneToday(t.id) ? '✓' : '○'}
              </button>
              <span className={isDoneToday(t.id) ? 'done' : ''}>{t.title}</span>
              {!todayWrapped && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => onRemoveFromToday(t.id)}
                  aria-label="Remove from today"
                >
                  ×
                </button>
            )}
            </li>
          ))}
        </ul>
        {!todayWrapped && canAddMore && backlog.length > 0 && (
          <div className="add-from-backlog">
            <span className="section-sublabel">Add from backlog</span>
            <ul className="backlog-pills">
              {backlog.slice(0, 12).map(t => (
                <li key={t.id}>
                  <button
                    type="button"
                    className="pill"
                    onClick={() => onPromote(t.id)}
                  >
                    + {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {!todayWrapped && (
        <>
          <section className="timer-section">
            <FocusTimer />
          </section>

          <section className="wrap-section">
            <button type="button" className="btn-primary" onClick={onWrapUp}>
              Wrap up day
            </button>
            <p className="muted small">Lock today’s focus and record your streak.</p>
          </section>
        </>
      )}
    </div>
  )
}
