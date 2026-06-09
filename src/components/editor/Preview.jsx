import { useRef, useEffect, useMemo } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { fmtTime } from '../../utils/helpers'
import { getBlobUrl } from '../../utils/fileRegistry'

export default function Preview({
  tracks,
  playing,
  setPlaying,
  currentTime,
  setCurrentTime,
  totalDuration,
  selectedClip,
  format,
}) {
  const videoRef = useRef(null)
  const ASPECT = { '16:9': 'aspect-video', '9:16': 'aspect-[9/16]', '1:1': 'aspect-square' }[format] || 'aspect-video'

  // Find current clip on the v1 (primary video) track
  const currentClip = useMemo(() => {
    const v1 = tracks?.find(t => t.id === 'v1')
    if (!v1) return null
    return v1.clips.find(c => currentTime >= c.start && currentTime < c.start + c.duration) || null
  }, [tracks, currentTime])

  const blobUrl = currentClip?.mediaId ? getBlobUrl(currentClip.mediaId) : null

  // Find subtitle clip covering currentTime
  const subtitleClip = useMemo(() => {
    const sub = tracks?.find(t => t.id === 'sub')
    if (!sub) return null
    return sub.clips.find(c => currentTime >= c.start && currentTime < c.start + c.duration) || null
  }, [tracks, currentTime])

  // Update video src when blobUrl changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.src = blobUrl || ''
  }, [blobUrl])

  // Seek video when currentTime changes (scrubbing)
  useEffect(() => {
    const video = videoRef.current
    if (!video || !blobUrl) return
    const clipTime = currentTime - (currentClip?.start || 0)
    if (Math.abs(video.currentTime - clipTime) > 0.5) {
      video.currentTime = clipTime
    }
  }, [currentTime, blobUrl, currentClip])

  // Play/pause the video element
  useEffect(() => {
    const video = videoRef.current
    if (!video || !blobUrl) return
    if (playing) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [playing, blobUrl])

  // Sync currentTime back from video during playback
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      if (playing && blobUrl) {
        setCurrentTime((currentClip?.start || 0) + video.currentTime)
      }
    }

    const onEnded = () => {
      // Check if there's another clip after this one on v1
      const v1 = tracks?.find(t => t.id === 'v1')
      const hasNext = v1?.clips.some(c => c.start > (currentClip?.start || 0))
      if (!hasNext) {
        setPlaying(false)
      }
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [playing, blobUrl, currentClip, tracks, setCurrentTime, setPlaying])

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#080808] border-b border-[#1A1A1A] overflow-hidden py-3 min-h-0">
      {/* Canvas / Video area */}
      <div
        className={`${ASPECT} max-h-full rounded-lg overflow-hidden relative border border-[#1F1F1F] shadow-2xl`}
        style={{
          maxWidth: format === '9:16' ? '120px' : format === '1:1' ? '180px' : '320px',
          background: blobUrl ? '#000' : undefined,
        }}
      >
        {blobUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            muted
            playsInline
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a0533 0%, #080808 50%, #001a33 100%)' }}
          >
            <div className="text-center opacity-40">
              <div className="w-8 h-8 rounded-lg bg-violet-600/60 mx-auto mb-1.5 flex items-center justify-center">
                <Play size={14} className="text-white ml-0.5" />
              </div>
              <p className="text-[10px] text-zinc-500">Upload media to preview</p>
            </div>
          </div>
        )}

        {/* Subtitle overlay */}
        {subtitleClip && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/75 rounded px-2 py-1">
            <p className="text-[11px] text-white text-center leading-snug">
              {subtitleClip.text || subtitleClip.label}
            </p>
          </div>
        )}

        {/* Format badge */}
        <div className="absolute top-2 right-2 bg-black/60 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
          {format}
        </div>

        {/* Time display */}
        <div className="absolute bottom-2 left-2 bg-black/60 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded font-mono">
          {fmtTime(currentTime)}
        </div>
      </div>

      {/* Scrubber */}
      <div className="w-full max-w-sm mt-2 px-4">
        <input
          type="range"
          min="0"
          max={totalDuration}
          step="0.1"
          value={currentTime}
          onChange={e => setCurrentTime(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-0.5">
          <span>{fmtTime(currentTime)}</span>
          <span>{fmtTime(totalDuration)}</span>
        </div>
      </div>

      {/* Transport controls */}
      <div className="flex items-center gap-1 mt-1">
        <button onClick={() => setCurrentTime(0)} className="btn-ghost p-1.5">
          <SkipBack size={14} />
        </button>
        <button
          onClick={() => setPlaying(p => !p)}
          className="w-8 h-8 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center transition-colors"
        >
          {playing
            ? <Pause size={14} className="text-white" />
            : <Play size={14} className="text-white ml-0.5" />
          }
        </button>
        <button onClick={() => setCurrentTime(totalDuration)} className="btn-ghost p-1.5">
          <SkipForward size={14} />
        </button>
        <button className="btn-ghost p-1.5 ml-1">
          <Volume2 size={14} />
        </button>
      </div>
    </div>
  )
}
