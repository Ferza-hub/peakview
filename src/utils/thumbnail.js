/**
 * Extract a thumbnail from a video file at a given time.
 * Returns a Promise<string> (JPEG data URL).
 */
export function extractThumbnail(file, timeSeconds = 1) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true

    const cleanup = () => {
      URL.revokeObjectURL(url)
      video.src = ''
    }

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(timeSeconds, video.duration * 0.1)
    }

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 160
        canvas.height = 90
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, 160, 90)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
        cleanup()
        resolve(dataUrl)
      } catch (err) {
        cleanup()
        reject(err)
      }
    }

    video.onerror = (err) => {
      cleanup()
      reject(err)
    }

    video.src = url
  })
}

/**
 * Get video metadata (duration, width, height) from a File.
 * Returns a Promise<{duration, width, height}>.
 */
export function getVideoMeta(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      const meta = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      }
      URL.revokeObjectURL(url)
      video.src = ''
      resolve(meta)
    }

    video.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }

    video.src = url
  })
}
