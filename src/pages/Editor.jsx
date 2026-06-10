import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../components/editor/TopBar'
import Preview from '../components/editor/Preview'
import Timeline from '../components/editor/Timeline'
import LeftPanel from '../components/editor/LeftPanel'
import RightPanel from '../components/editor/RightPanel'
import ExportModal from '../components/editor/ExportModal'
import PublishModal from '../components/editor/PublishModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { initialTracks, mediaFiles as defaultMedia, versionHistory, TOTAL_DURATION } from '../data/editorData'
import { getProjectData, saveProjectData, upsertProjectMeta, getProjects } from '../utils/storage'
import { genId, deepClone, parseDur } from '../utils/helpers'
import { useToast } from '../context/ToastContext'
import { setThumbnail, setWaveform } from '../utils/fileRegistry'
import { extractThumbnail } from '../utils/thumbnail'
import { computeWaveform } from '../utils/waveform'

const MAX_HIST = 30

export default function Editor() {
  const { id: pid } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [projectName, setProjectName] = useState('Untitled Project')
  const [format, setFormat]           = useState('16:9')
  const [saveStatus, setSaveStatus]   = useState('saved')
  const [tracks, setTracks]           = useState(initialTracks)
  const [mediaFiles, setMediaFiles]   = useState(defaultMedia)
  const [selectedClip, setSelectedClip] = useState(null)
  const [zoom, setZoom]               = useState(1)
  const [playing, setPlaying]         = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [history, setHistory]         = useState([])
  const [histIdx, setHistIdx]         = useState(-1)
  const histRef = useRef({ h: [], i: -1 })
  const [activeTab, setActiveTab]     = useState('media')
  const [showExport, setShowExport]   = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [confirmDel, setConfirmDel]   = useState(null)
  const [colorFilter, setColorFilter] = useState('')
  const [activeTransition, setActiveTransition] = useState(null)

  // Load project
  useEffect(() => {
    const data = getProjectData(pid) || { tracks: initialTracks, mediaFiles: defaultMedia, format: '16:9' }
    setTracks(data.tracks)
    setMediaFiles(data.mediaFiles || defaultMedia)
    setFormat(data.format || '16:9')
    const meta = getProjects().find(p => p.id === pid)
    if (meta) setProjectName(meta.title)
    const snap = [{ tracks: deepClone(data.tracks), mediaFiles: deepClone(data.mediaFiles || defaultMedia) }]
    setHistory(snap); setHistIdx(0)
    histRef.current = { h: snap, i: 0 }
    setSaveStatus('saved')
  }, [pid])

  // Commit to history
  const commit = useCallback((newTracks, newMedia) => {
    const { h, i } = histRef.current
    const snap = { tracks: deepClone(newTracks), mediaFiles: deepClone(newMedia) }
    const nh = [...h.slice(0, i + 1), snap].slice(-MAX_HIST)
    const ni = nh.length - 1
    histRef.current = { h: nh, i: ni }
    setHistory(nh); setHistIdx(ni)
    setTracks(newTracks); setMediaFiles(newMedia)
    setSaveStatus('unsaved')
  }, [])

  const persist = useCallback((t, m, fmt, name) => {
    setSaveStatus('saving')
    saveProjectData(pid, { tracks: t, mediaFiles: m, format: fmt })
    upsertProjectMeta(pid, { title: name })
    setSaveStatus('saved')
  }, [pid])

  // Autosave 30s
  useEffect(() => {
    if (saveStatus !== 'unsaved') return
    const timer = setTimeout(() => persist(tracks, mediaFiles, format, projectName), 30000)
    return () => clearTimeout(timer)
  }, [saveStatus, tracks, mediaFiles, format, projectName, persist])

  // Playback
  useEffect(() => {
    if (!playing) return
    const iv = setInterval(() => {
      setCurrentTime(t => {
        if (t >= TOTAL_DURATION) { setPlaying(false); return 0 }
        return parseFloat((t + 0.1).toFixed(1))
      })
    }, 100)
    return () => clearInterval(iv)
  }, [playing])

  const undo = useCallback(() => {
    const { h, i } = histRef.current
    if (i <= 0) return
    const ni = i - 1
    histRef.current.i = ni
    setHistIdx(ni); setTracks(h[ni].tracks); setMediaFiles(h[ni].mediaFiles)
    setSaveStatus('unsaved'); toast.add('Undo', 'info')
  }, [toast])

  const redo = useCallback(() => {
    const { h, i } = histRef.current
    if (i >= h.length - 1) return
    const ni = i + 1
    histRef.current.i = ni
    setHistIdx(ni); setTracks(h[ni].tracks); setMediaFiles(h[ni].mediaFiles)
    setSaveStatus('unsaved'); toast.add('Redo', 'info')
  }, [toast])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.code === 'Space') { e.preventDefault(); setPlaying(p => !p) }
      if (e.code === 'ArrowLeft')  { e.preventDefault(); setCurrentTime(t => Math.max(0, parseFloat((t-5).toFixed(1)))) }
      if (e.code === 'ArrowRight') { e.preventDefault(); setCurrentTime(t => Math.min(TOTAL_DURATION, parseFloat((t+5).toFixed(1)))) }
      if ((e.code === 'Delete' || e.code === 'Backspace') && selectedClip) {
        e.preventDefault(); setConfirmDel({ trackId: selectedClip._trackId, clipId: selectedClip.id, label: selectedClip.label })
      }
      if ((e.metaKey||e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.metaKey||e.ctrlKey) && e.key === 'y') { e.preventDefault(); redo() }
      if ((e.metaKey||e.ctrlKey) && e.key === 's') {
        e.preventDefault(); persist(tracks, mediaFiles, format, projectName); toast.add('Saved', 'success')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, selectedClip, tracks, mediaFiles, format, projectName, persist, toast])

  // ── Media CRUD ────────────────────────────────────────────────────────────
  const addMedia = useCallback((item) => {
    const newMedia = [...mediaFiles, { id: item.id, name: item.name, type: item.type, duration: item.duration, color: item.color }]
    let newTracks = tracks
    if (item.addToTrack) {
      const map = { video:'v1', audio:'a1', image:'v2', subtitle:'sub' }
      const tId = map[item.type] || 'v1'
      const trk = tracks.find(t => t.id === tId)
      if (trk && !trk.locked) {
        const last = trk.clips[trk.clips.length - 1]
        const start = last ? last.start + last.duration : 0
        const dur = parseDur(item.duration)
        const clip = { id: genId(), label: item.name, start, duration: dur, color: item.color, type: item.type, mediaId: item.id }
        newTracks = tracks.map(t => t.id === tId ? { ...t, clips: [...t.clips, clip] } : t)
      }
    }
    commit(newTracks, newMedia)
    toast.add(`"${item.name}" added`, 'success')
    // Async: generate thumbnail + waveform from real uploaded file
    if (item.file) {
      if (item.type === 'video') {
        extractThumbnail(item.file).then(thumb => setThumbnail(item.id, thumb)).catch(() => {})
      }
      if (item.type === 'audio' || item.type === 'video') {
        computeWaveform(item.file).then(wf => setWaveform(item.id, wf)).catch(() => {})
      }
    }
  }, [mediaFiles, tracks, commit, toast])

  const updateMedia = useCallback((id, patch) => {
    const newMedia = mediaFiles.map(m => m.id === id ? { ...m, ...patch } : m)
    const newTracks = tracks.map(t => ({ ...t, clips: t.clips.map(c => c.mediaId === id ? { ...c, label: patch.name||c.label, color: patch.color||c.color } : c) }))
    commit(newTracks, newMedia)
    toast.add('Media updated', 'success')
  }, [mediaFiles, tracks, commit, toast])

  const deleteMedia = useCallback((id) => {
    const newMedia = mediaFiles.filter(m => m.id !== id)
    const newTracks = tracks.map(t => ({ ...t, clips: t.clips.filter(c => c.mediaId !== id) }))
    commit(newTracks, newMedia)
    toast.add('Media removed', 'error')
  }, [mediaFiles, tracks, commit, toast])

  // ── Clip CRUD ──────────────────────────────────────────────────────────────
  const addClip = useCallback((trackId, clip, mediaItem) => {
    const newTracks = tracks.map(t => t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t)
    let newMedia = mediaFiles
    if (mediaItem && !mediaFiles.some(m => m.id === mediaItem.id)) {
      newMedia = [...mediaFiles, {
        id: mediaItem.id,
        name: mediaItem.name,
        type: mediaItem.type || 'video',
        duration: mediaItem.duration,
        color: mediaItem.color || '#7C3AED',
        ...(mediaItem.thumb ? { thumb: mediaItem.thumb } : {}),
      }]
    }
    commit(newTracks, newMedia)
  }, [tracks, mediaFiles, commit])

  const updateTracks = useCallback((newTracks) => {
    commit(newTracks, mediaFiles)
  }, [mediaFiles, commit])

  const askDeleteClip = useCallback((trackId, clipId, label) => {
    setConfirmDel({ trackId, clipId, label })
  }, [])

  const doDeleteClip = useCallback(() => {
    const { trackId, clipId } = confirmDel
    const newTracks = tracks.map(t => t.id === trackId ? { ...t, clips: t.clips.filter(c => c.id !== clipId) } : t)
    commit(newTracks, mediaFiles)
    if (selectedClip?.id === clipId) setSelectedClip(null)
    setConfirmDel(null)
    toast.add('Clip deleted', 'error')
  }, [confirmDel, tracks, mediaFiles, commit, selectedClip, toast])

  const addMediaToTimeline = useCallback((item) => {
    const map = { video:'v1', audio:'a1', image:'v2', subtitle:'sub' }
    const tId = map[item.type] || 'v1'
    const trk = tracks.find(t => t.id === tId)
    if (!trk || trk.locked) { toast.add('Track is locked', 'warning'); return }
    const last = trk.clips[trk.clips.length - 1]
    const start = last ? last.start + last.duration : 0
    const dur = parseDur(item.duration)
    const clip = { id: genId(), label: item.name, start, duration: dur, color: item.color, type: item.type, mediaId: item.id }
    const newTracks = tracks.map(t => t.id === tId ? { ...t, clips: [...t.clips, clip] } : t)
    commit(newTracks, mediaFiles)
    toast.add(`"${item.name}" added to timeline`, 'success')
  }, [tracks, mediaFiles, commit, toast])

  const splitClip = useCallback((trackId, clipId) => {
    const trk = tracks.find(t => t.id === trackId)
    const clip = trk?.clips.find(c => c.id === clipId)
    if (!clip || currentTime <= clip.start || currentTime >= clip.start + clip.duration) {
      toast.add('Place playhead inside the clip to split', 'warning'); return
    }
    const splitAt = currentTime - clip.start
    const a = { ...clip, id: genId(), duration: splitAt }
    const b = { ...clip, id: genId(), start: currentTime, duration: clip.duration - splitAt }
    const newTracks = tracks.map(t => t.id === trackId ? { ...t, clips: t.clips.flatMap(c => c.id === clipId ? [a, b] : [c]) } : t)
    commit(newTracks, mediaFiles)
    toast.add('Clip split', 'success')
  }, [tracks, mediaFiles, currentTime, commit, toast])

  // ── Caption CRUD ──────────────────────────────────────────────────────────
  const addCaption = useCallback((cap) => {
    const newClip = { id: genId(), label: cap.text, text: cap.text, start: cap.start, duration: Math.max(0.5, cap.end - cap.start), color: '#F59E0B', type: 'subtitle' }
    const newTracks = tracks.map(t => t.id === 'sub' ? { ...t, clips: [...t.clips, newClip] } : t)
    commit(newTracks, mediaFiles)
    toast.add('Caption added', 'success')
  }, [tracks, mediaFiles, commit, toast])

  const updateCaption = useCallback((id, patch) => {
    const newTracks = tracks.map(t => t.id === 'sub' ? { ...t, clips: t.clips.map(c => c.id === id ? { ...c, ...patch } : c) } : t)
    commit(newTracks, mediaFiles)
  }, [tracks, mediaFiles, commit])

  const deleteCaption = useCallback((id) => {
    const newTracks = tracks.map(t => t.id === 'sub' ? { ...t, clips: t.clips.filter(c => c.id !== id) } : t)
    commit(newTracks, mediaFiles)
    toast.add('Caption deleted', 'error')
  }, [tracks, mediaFiles, commit, toast])

  const generateCaptions = useCallback(() => {
    const clips = Array.from({ length: 6 }, (_, i) => ({
      id: genId(), label: `Caption ${i+1}`, text: `Caption ${i+1}`,
      start: i * 8, duration: 6, color: '#F59E0B', type: 'subtitle',
    }))
    const newTracks = tracks.map(t => t.id === 'sub' ? { ...t, clips: [...t.clips, ...clips] } : t)
    commit(newTracks, mediaFiles)
    toast.add('6 captions generated', 'success')
  }, [tracks, mediaFiles, commit, toast])

  const handleSelectClip = useCallback((clip, track) => {
    setSelectedClip(clip ? { ...clip, _trackId: track?.id } : null)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-[#080808] text-zinc-100 overflow-hidden select-none">
      <TopBar
        projectName={projectName}
        setProjectName={(n) => { setProjectName(n); setSaveStatus('unsaved') }}
        canUndo={histIdx > 0} canRedo={histIdx < history.length - 1}
        onUndo={undo} onRedo={redo}
        format={format} setFormat={setFormat}
        onExport={() => setShowExport(true)}
        onPublish={() => setShowPublish(true)}
        saveStatus={saveStatus}
        onSave={() => { persist(tracks, mediaFiles, format, projectName); toast.add('Saved', 'success') }}
      />

      <div className="flex-1 flex overflow-hidden">
        <LeftPanel
          activeTab={activeTab} setActiveTab={setActiveTab}
          mediaFiles={mediaFiles}
          onAddMedia={addMedia} onUpdateMedia={updateMedia} onDeleteMedia={deleteMedia}
          captions={tracks.find(t => t.id === 'sub')?.clips || []}
          onAddCaption={addCaption} onUpdateCaption={updateCaption}
          onDeleteCaption={deleteCaption} onGenerateCaptions={generateCaptions}
          onAddToTimeline={addMediaToTimeline}
          versionHistory={versionHistory}
          onEffectChange={({ filter }) => setColorFilter(filter)}
          onTransitionSelect={setActiveTransition}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Preview
            tracks={tracks}
            playing={playing} setPlaying={setPlaying}
            currentTime={currentTime} setCurrentTime={setCurrentTime}
            totalDuration={TOTAL_DURATION} selectedClip={selectedClip} format={format}
            mediaFiles={mediaFiles}
            colorFilter={colorFilter}
          />
          <Timeline
            tracks={tracks} currentTime={currentTime} setCurrentTime={setCurrentTime}
            totalDuration={TOTAL_DURATION} selectedClip={selectedClip}
            onSelectClip={handleSelectClip} zoom={zoom} setZoom={setZoom}
            onTracksChange={updateTracks} onAddClip={addClip}
            onDeleteClip={askDeleteClip} onSplitClip={splitClip}
            mediaFiles={mediaFiles}
          />
        </div>

        <RightPanel selectedClip={selectedClip} format={format} setFormat={setFormat} />
      </div>

      {showExport  && <ExportModal  onClose={() => setShowExport(false)} projectName={projectName} format={format} />}
      {showPublish && <PublishModal onClose={() => setShowPublish(false)} />}

      {confirmDel && (
        <ConfirmDialog
          title="Delete clip?"
          message={`"${confirmDel.label}" will be removed from the timeline.`}
          onConfirm={doDeleteClip}
          onCancel={() => setConfirmDel(null)}
        />
      )}
    </div>
  )
}
