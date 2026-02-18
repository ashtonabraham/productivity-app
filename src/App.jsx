import { useState, useEffect, useCallback } from 'react'
import { load, save, getStreak, getTodayKey } from './storage'
import Today from './Today'
import Backlog from './Backlog'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [todayFocus, setTodayFocus] = useState([])
  const [dayRecords, setDayRecords] = useState({})
  const [view, setView] = useState('today')

  useEffect(() => {
    const state = load()
    setTasks(state.tasks)
    setTodayFocus(state.todayFocus)
    setDayRecords(state.dayRecords)
  }, [])

  const saveState = useCallback((updates) => {
    if (updates.tasks !== undefined) setTasks(updates.tasks)
    if (updates.todayFocus !== undefined) setTodayFocus(updates.todayFocus)
    if (updates.dayRecords !== undefined) setDayRecords(updates.dayRecords)
    save({
      tasks: updates.tasks ?? tasks,
      todayFocus: updates.todayFocus ?? todayFocus,
      dayRecords: updates.dayRecords ?? dayRecords,
    })
  }, [tasks, todayFocus, dayRecords])

  const addTask = (title) => {
    const id = crypto.randomUUID()
    const next = [...tasks, { id, title, createdAt: Date.now() }]
    saveState({ tasks: next })
  }

  const updateTask = (id, title) => {
    const next = tasks.map(t => t.id === id ? { ...t, title } : t)
    saveState({ tasks: next })
  }

  const deleteTask = (id) => {
    const nextTasks = tasks.filter(t => t.id !== id)
    const nextFocus = todayFocus.filter(fid => fid !== id)
    saveState({ tasks: nextTasks, todayFocus: nextFocus })
  }

  const promoteToToday = (id) => {
    if (todayFocus.length >= 3 || todayFocus.includes(id)) return
    saveState({ todayFocus: [...todayFocus, id] })
  }

  const removeFromToday = (id) => {
    saveState({ todayFocus: todayFocus.filter(fid => fid !== id) })
  }

  const toggleDoneToday = (id) => {
    const key = getTodayKey()
    const record = dayRecords[key] ?? { focusIds: todayFocus, doneIds: [], wrapped: false }
    const doneIds = record.doneIds.includes(id)
      ? record.doneIds.filter(d => d !== id)
      : [...record.doneIds, id]
    const next = { ...dayRecords, [key]: { ...record, doneIds } }
    saveState({ dayRecords: next })
  }

  const wrapUpDay = () => {
    const key = getTodayKey()
    const record = dayRecords[key] ?? { focusIds: todayFocus, doneIds: [], wrapped: false }
    const next = { ...dayRecords, [key]: { ...record, focusIds: todayFocus, wrapped: true } }
    setDayRecords(next)
    save({ tasks, todayFocus, dayRecords: next })
    setTodayFocus([])
    saveState({ todayFocus: [], dayRecords: next })
  }

  const unwrapDay = () => {
    const key = getTodayKey()
    const record = dayRecords[key]
    if (!record) return
    const next = { ...dayRecords, [key]: { ...record, wrapped: false } }
    const restoredFocus = record.focusIds ?? []
    setDayRecords(next)
    setTodayFocus(restoredFocus)
    saveState({ todayFocus: restoredFocus, dayRecords: next })
  }

  const isDoneToday = (id) => {
    const key = getTodayKey()
    return (dayRecords[key]?.doneIds ?? []).includes(id)
  }

  const todayWrapped = (dayRecords[getTodayKey()]?.wrapped) ?? false
  const streak = getStreak(dayRecords)

  return (
    <>
      <header className="header">
        <span className="logo">🎯 Daily Focus</span>
        {streak > 0 && (
          <span className="streak-badge">🔥 {streak} day{streak !== 1 ? 's' : ''}</span>
        )}
        <nav>
          <button
            className={view === 'today' ? 'nav-active' : ''}
            onClick={() => setView('today')}
          >
            Today
          </button>
          <span className="nav-separator"> | </span>
          <button
            className={view === 'backlog' ? 'nav-active' : ''}
            onClick={() => setView('backlog')}
          >
            Tasklog
          </button>
        </nav>
      </header>
      <main className="main">
        {view === 'today' && (
          <Today
            tasks={tasks}
            todayFocus={todayFocus}
            isDoneToday={isDoneToday}
            onPromote={promoteToToday}
            onRemoveFromToday={removeFromToday}
            onToggleDone={toggleDoneToday}
            onWrapUp={wrapUpDay}
            onUnwrap={unwrapDay}
            todayWrapped={todayWrapped}
          />
        )}
        {view === 'backlog' && (
          <Backlog
            tasks={tasks}
            todayFocus={todayFocus}
            onAdd={addTask}
            onEdit={updateTask}
            onDelete={deleteTask}
            onPromote={promoteToToday}
          />
        )}
      </main>
    </>
  )
}
