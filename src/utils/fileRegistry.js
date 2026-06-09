// In-memory singleton registry: mediaId → { file, blobUrl, waveform, thumbnail }
const registry = new Map()

export function registerFile(mediaId, file) {
  const existing = registry.get(mediaId)
  if (existing?.blobUrl) {
    URL.revokeObjectURL(existing.blobUrl)
  }
  const blobUrl = URL.createObjectURL(file)
  registry.set(mediaId, { file, blobUrl, waveform: null, thumbnail: null })
  return blobUrl
}

export function getEntry(mediaId) {
  return registry.get(mediaId) || null
}

export function getBlobUrl(mediaId) {
  return registry.get(mediaId)?.blobUrl || null
}

export function setWaveform(mediaId, data) {
  const entry = registry.get(mediaId)
  if (entry) {
    entry.waveform = data
  }
}

export function setThumbnail(mediaId, dataUrl) {
  const entry = registry.get(mediaId)
  if (entry) {
    entry.thumbnail = dataUrl
  }
}
