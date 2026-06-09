/**
 * Compute a normalized waveform from a File object using the Web Audio API.
 * Returns a Float32Array of `samples` peak values in [0, 1].
 */
export async function computeWaveform(file, samples = 200) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    let audioBuffer
    try {
      audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
    } finally {
      await audioCtx.close()
    }

    const channelData = audioBuffer.getChannelData(0)
    const blockSize = Math.floor(channelData.length / samples)
    const result = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      let peak = 0
      const offset = i * blockSize
      for (let j = 0; j < blockSize; j++) {
        const absVal = Math.abs(channelData[offset + j] || 0)
        if (absVal > peak) peak = absVal
      }
      result[i] = peak
    }

    // Normalize by max peak
    let max = 0
    for (let i = 0; i < result.length; i++) {
      if (result[i] > max) max = result[i]
    }
    if (max > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i] = result[i] / max
      }
    }

    return result
  } catch (err) {
    console.warn('computeWaveform error:', err)
    return new Float32Array(0)
  }
}
