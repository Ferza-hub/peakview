import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/editor/TopBar'
import Preview from '../components/editor/Preview'
import Timeline from '../components/editor/Timeline'
import LeftPanel from '../components/editor/LeftPanel'
import RightPanel from '../components/editor/RightPanel'
import ExportModal from '../components/editor/ExportModal'
import PublishModal from '../components/editor/PublishModal'
import { initialTracks, collaborators, comments, versionHistory, TOTAL_DURATION } from '../data/editorData'

export default function Editor() {
  const navigate = useNavigate()

  // Playback
  const [playing, setPlaying]           = useState(false)
  const [currentTime, setCurrentTime]   = useState(0)

  // Project
  const [projectName, setProjectName]   = useState('How I Made $100K as a Creator')
  const [format, setFormat]             = useState('16:9')

  // Timeline
  const [tracks, setTracks]             = useState(initialTracks)
  const [selectedClip, setSelectedClip] = useState(null)
  const [zoom, setZoom]                 = useState(1)

  // History (undo/redo)
  const [history, setHistory]           = useState([initialTracks])
  const [histIdx, setHistIdx]           = useState(0)

  // UI
  const [activeLeftTab, setActiveLeftTab] = useState('media')
  const [showExport, setShowExport]       = useState(false)
  const [showPublish, setShowPublish]     = useState(false)

  // Playback loop
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

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.code === 'Space') { e.preventDefault(); setPlaying(p => !p) }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [histIdx, history])

  const updateTracks = useCallback((newTracks) => {
    const newHist = [...history.slice(0, histIdx + 1), newTracks]
    setHistory(newHist)
    setHistIdx(newHist.length - 1)
    setTracks(newTracks)
  }, [history, histIdx])

  const undo = () => {
    if (histIdx > 0) {
      const idx = histIdx - 1
      setHistIdx(idx)
      setTracks(history[idx])
    }
  }

  const redo = () => {
    if (histIdx < history.length - 1) {
      const idx = histIdx + 1
      setHistIdx(idx)
      setTracks(history[idx])
    }
  }

  const handleSelectClip = (clip, track) => {
    setSelectedClip(clip?.id === selectedClip?.id ? null : clip)
  }

  return (
    <div className="h-screen flex flex-col bg-[#080808] text-zinc-100 overflow-hidden select-none">
      <TopBar
        projectName={projectName}
        setProjectName={setProjectName}
        canUndo={histIdx > 0}
        canRedo={histIdx < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        format={format}
        setFormat={setFormat}
        onExport={() => setShowExport(true)}
        onPublish={() => setShowPublish(true)}
        collaborators={collaborators}
        onShowCollab={() => setActiveLeftTab('collab')}
      />

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel
          activeTab={activeLeftTab}
          setActiveTab={setActiveLeftTab}
          comments={comments}
          collaborators={collaborators}
          versionHistory={versionHistory}
        />

        {/* Center: Preview + Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Preview
            playing={playing}
            setPlaying={setPlaying}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            totalDuration={TOTAL_DURATION}
            selectedClip={selectedClip}
            format={format}
          />

          <Timeline
            tracks={tracks}
            setTracks={updateTracks}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            totalDuration={TOTAL_DURATION}
            selectedClip={selectedClip}
            onSelectClip={handleSelectClip}
            zoom={zoom}
            setZoom={setZoom}
          />
        </div>

        <RightPanel
          selectedClip={selectedClip}
          format={format}
          setFormat={setFormat}
        />
      </div>

      {showExport  && <ExportModal  onClose={() => setShowExport(false)} />}
      {showPublish && <PublishModal onClose={() => setShowPublish(false)} />}
    </div>
  )
}
