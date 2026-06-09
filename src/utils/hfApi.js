/**
 * Transcribe audio using the free Hugging Face Inference API (Whisper Small).
 * No auth token required but rate-limited.
 */
export async function transcribeAudio(audioFile) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/openai/whisper-small',
      {
        method: 'POST',
        headers: {
          'Content-Type': audioFile.type || 'audio/mpeg',
        },
        body: audioFile,
        signal: controller.signal,
      }
    )

    if (response.status === 503) {
      throw new Error('loading')
    }
    if (response.status === 429) {
      throw new Error('quota')
    }
    if (!response.ok) {
      throw new Error(`http_${response.status}`)
    }

    const data = await response.json()
    return {
      text: data.text || '',
      chunks: data.chunks || [],
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('timeout')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Segment a plain-text transcript into caption segments, distributing time
 * proportionally based on sentence length.
 * Returns array of { text, start, end }.
 */
export function segmentTranscript(text, totalDurationSec) {
  if (!text || !text.trim()) return []

  // Split by sentence-ending punctuation
  const raw = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean)
  if (raw.length === 0) return []

  const totalChars = raw.reduce((sum, s) => sum + s.length, 0)
  if (totalChars === 0) return []

  const segments = []
  let cursor = 0

  for (let i = 0; i < raw.length; i++) {
    const proportion = raw[i].length / totalChars
    const duration = Math.max(0.5, proportion * totalDurationSec)
    const start = cursor
    const end = Math.min(cursor + duration, totalDurationSec)
    segments.push({ text: raw[i], start, end })
    cursor = end
  }

  return segments
}
