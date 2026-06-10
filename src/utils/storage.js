const PROJECTS_KEY = 'peakedit_projects'
const DATA_KEY     = (id) => `peakedit_data_${id}`
const LAST_KEY     = 'peakedit_last'

export const getProjects    = ()     => JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]')
export const saveProjects   = (list) => localStorage.setItem(PROJECTS_KEY, JSON.stringify(list))
export const getLastId      = ()     => localStorage.getItem(LAST_KEY)
export const setLastId      = (id)   => localStorage.setItem(LAST_KEY, id)

export const getProjectData = (id) => {
  const raw = localStorage.getItem(DATA_KEY(id))
  return raw ? JSON.parse(raw) : null
}
export const saveProjectData = (id, data) =>
  localStorage.setItem(DATA_KEY(id), JSON.stringify(data))

export const deleteProjectData = (id) =>
  localStorage.removeItem(DATA_KEY(id))

export const upsertProjectMeta = (id, patch) => {
  const list = getProjects()
  const exists = list.find(p => p.id === id)
  const ts = new Date().toISOString()
  const updated = exists
    ? list.map(p => p.id === id ? { ...p, ...patch, updatedAt: ts } : p)
    : [{ id, ...patch, createdAt: ts, updatedAt: ts }, ...list]
  saveProjects(updated)
}
