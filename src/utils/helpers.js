let counter = Date.now()
export const genId = () => `id_${(counter++).toString(36)}`

export const fmtTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  const ms = Math.round((s % 1) * 10)
  return `${m}:${sec.toString().padStart(2,'0')}.${ms}`
}

export const fmtTimeShort = (s) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2,'0')}`
}

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

export const parseDur = (str) => {
  if (!str) return 5
  const parts = str.split(':')
  if (parts.length === 2) return parseInt(parts[0]) * 60 + parseFloat(parts[1])
  return parseFloat(str) || 5
}
