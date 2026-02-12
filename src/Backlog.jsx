import { useState } from 'react'

export default function Backlog({ tasks, todayFocus, onAdd, onEdit, onDelete, onPromote }) {
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    const t = newTitle.trim()
    if (t) {
      onAdd(t)
      setNewTitle('')
    }
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onEdit(editingId, editTitle.trim())
      setEditingId(null)
      setEditTitle('')
    }
  }

  const inToday = (id) => todayFocus.includes(id)
  const canPromote = todayFocus.length < 3

  return (
    <div className="backlog">
      <h1 className="page-title">Backlog</h1>
      <p className="muted">All tasks. Promote up to 3 to Today.</p>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New task..."
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn-primary">Add</button>
      </form>

      <ul className="backlog-list">
        {tasks.map(task => (
          <li key={task.id} className="backlog-item">
            {editingId === task.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  className="input"
                  autoFocus
                />
                <button type="button" className="btn-ghost" onClick={saveEdit}>Save</button>
                <button type="button" className="btn-ghost" onClick={() => { setEditingId(null); setEditTitle('') }}>Cancel</button>
              </>
            ) : (
              <>
                <span className="backlog-title">{task.title}</span>
                <div className="backlog-actions">
                  {canPromote && !inToday(task.id) && (
                    <button
                      type="button"
                      className="btn-ghost accent"
                      onClick={() => onPromote(task.id)}
                    >
                      Add to today
                    </button>
                  )}
                  {inToday(task.id) && <span className="badge">Today</span>}
                  <button type="button" className="btn-ghost" onClick={() => startEdit(task)}>Edit</button>
                  <button type="button" className="btn-ghost danger" onClick={() => onDelete(task.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {tasks.length === 0 && (
        <p className="muted">No tasks yet. Add one above.</p>
      )}
    </div>
  )
}
