const KEY = 'daily-focus-v1'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return getDefaultState()
    const data = JSON.parse(raw)
    const today = getTodayKey()
    const lastDate = data.lastDate ?? today
    const todayFocus = lastDate === today ? (data.todayFocus ?? []) : []
    return {
      tasks: data.tasks ?? [],
      todayFocus,
      dayRecords: data.dayRecords ?? {},
      lastDate: today,
    }
  } catch {
    return getDefaultState()
  }
}

function getDefaultState() {
  return {
    tasks: [],
    todayFocus: [],
    dayRecords: {},
    lastDate: getTodayKey(),
  }
}

export function save(state) {
  const toSave = {
    tasks: state.tasks,
    todayFocus: state.todayFocus,
    dayRecords: state.dayRecords,
    lastDate: state.lastDate ?? getTodayKey(),
  }
  localStorage.setItem(KEY, JSON.stringify(toSave))
}

export function getStreak(dayRecords) {
  const today = getTodayKey()
  let streak = 0
  let d = today
  while (dayRecords[d]?.wrapped) {
    streak++
    const prev = new Date(d)
    prev.setDate(prev.getDate() - 1)
    d = prev.toISOString().slice(0, 10)
  }
  return streak
}

export { getTodayKey }
