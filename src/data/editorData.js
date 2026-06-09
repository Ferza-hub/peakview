export const TOTAL_DURATION = 65

export const initialTracks = [
  {
    id: 'v1', label: 'V1 Main', type: 'video', muted: false, locked: false, height: 44,
    clips: [
      { id: 'c1', label: 'Intro Hook', start: 0, duration: 8, color: '#7C3AED', type: 'video' },
      { id: 'c2', label: 'Main Content A', start: 9, duration: 18, color: '#6D28D9', type: 'video' },
      { id: 'c3', label: 'B-Roll Insert', start: 28, duration: 10, color: '#5B21B6', type: 'video' },
      { id: 'c4', label: 'Main Content B', start: 39, duration: 15, color: '#7C3AED', type: 'video' },
      { id: 'c5', label: 'Outro', start: 55, duration: 10, color: '#4C1D95', type: 'video' },
    ]
  },
  {
    id: 'v2', label: 'V2 Overlay', type: 'video', muted: false, locked: false, height: 32,
    clips: [
      { id: 'c6', label: 'Logo Bug', start: 2, duration: 60, color: '#0E7490', type: 'video' },
      { id: 'c7', label: 'Lower Third', start: 10, duration: 5, color: '#06B6D4', type: 'video' },
    ]
  },
  {
    id: 'a1', label: 'Music', type: 'audio', muted: false, locked: false, height: 36,
    clips: [
      { id: 'c8', label: 'Intro Beat', start: 0, duration: 12, color: '#10B981', type: 'audio' },
      { id: 'c9', label: 'Main Track', start: 12, duration: 48, color: '#059669', type: 'audio' },
    ]
  },
  {
    id: 'a2', label: 'VO', type: 'audio', muted: false, locked: false, height: 32,
    clips: [
      { id: 'c10', label: 'Voiceover 1', start: 1, duration: 20, color: '#F59E0B', type: 'audio' },
      { id: 'c11', label: 'Voiceover 2', start: 28, duration: 25, color: '#D97706', type: 'audio' },
    ]
  },
  {
    id: 'sub', label: 'Subtitles', type: 'subtitle', muted: false, locked: false, height: 26,
    clips: [
      { id: 'c12', label: "Hey what's up everyone", start: 1, duration: 4, color: '#EF4444', type: 'subtitle', text: "Hey what's up everyone" },
      { id: 'c13', label: 'Today I want to show you', start: 5.5, duration: 3.5, color: '#EF4444', type: 'subtitle', text: 'Today I want to show you' },
    ]
  },
  {
    id: 'fx', label: 'FX', type: 'fx', muted: false, locked: false, height: 22,
    clips: [
      { id: 'c14', label: 'Zoom In', start: 0, duration: 2, color: '#8B5CF6', type: 'fx' },
      { id: 'c15', label: 'Flash', start: 27, duration: 1, color: '#EC4899', type: 'fx' },
    ]
  },
]

export const mediaFiles = [
  { id: 'm1', name: 'Main Interview.mp4', type: 'video', duration: '12:34', color: '#7C3AED' },
  { id: 'm2', name: 'B-Roll Office.mp4',  type: 'video', duration: '2:15',  color: '#6D28D9' },
  { id: 'm3', name: 'Drone Shots.mp4',    type: 'video', duration: '4:22',  color: '#5B21B6' },
  { id: 'm4', name: 'Product Demo.mp4',   type: 'video', duration: '3:10',  color: '#7C3AED' },
  { id: 'm5', name: 'BG Music Lo-Fi.mp3', type: 'audio', duration: '3:32',  color: '#10B981' },
  { id: 'm6', name: 'Voiceover Final.mp3',type: 'audio', duration: '8:45',  color: '#F59E0B' },
  { id: 'm7', name: 'SFX Whoosh.wav',     type: 'audio', duration: '0:02',  color: '#06B6D4' },
  { id: 'm8', name: 'Thumbnail BG.png',   type: 'image', duration: '—',     color: '#EC4899' },
  { id: 'm9', name: 'Logo Animated.mov',  type: 'video', duration: '0:05',  color: '#0E7490' },
  { id: 'm10', name: 'Subtitles EN.srt',  type: 'subtitle', duration: '—',  color: '#EF4444' },
]

export const stockMusic = [
  { id: 's1', title: 'Chill Lo-Fi Beats',   artist: 'AudioZen',    duration: '3:24', genre: 'Lo-Fi',     bpm: 85 },
  { id: 's2', title: 'Epic Trailer Rise',    artist: 'CineSound',   duration: '2:45', genre: 'Epic',      bpm: 140 },
  { id: 's3', title: 'Corporate Inspire',    artist: 'BizAudio',    duration: '3:10', genre: 'Corporate', bpm: 120 },
  { id: 's4', title: 'Summer Vibes Pop',     artist: 'SunTracks',   duration: '3:44', genre: 'Pop',       bpm: 128 },
  { id: 's5', title: 'Ambient Minimal',      artist: 'SpaceAudio',  duration: '4:00', genre: 'Ambient',   bpm: 70 },
  { id: 's6', title: 'Hip-Hop Groove',       artist: 'BeatMaker',   duration: '2:58', genre: 'Hip-Hop',   bpm: 95 },
  { id: 's7', title: 'Jazz Cafe Morning',    artist: 'JazzCat',     duration: '3:15', genre: 'Jazz',      bpm: 110 },
  { id: 's8', title: 'Motivation Hard',      artist: 'GymBeats',    duration: '3:30', genre: 'Epic',      bpm: 155 },
]

export const templates = [
  { id: 't1', name: 'YouTube Intro',      cat: 'Intro',       thumb: '#7C3AED' },
  { id: 't2', name: 'TikTok Hook',        cat: 'Intro',       thumb: '#EC4899' },
  { id: 't3', name: 'Subscribe Outro',    cat: 'Outro',       thumb: '#10B981' },
  { id: 't4', name: 'Channel Outro',      cat: 'Outro',       thumb: '#06B6D4' },
  { id: 't5', name: 'Name Lower Third',   cat: 'Lower Third', thumb: '#F59E0B' },
  { id: 't6', name: 'Social Bug',         cat: 'Lower Third', thumb: '#EF4444' },
  { id: 't7', name: 'Like+Subscribe CTA', cat: 'CTA',         thumb: '#8B5CF6' },
  { id: 't8', name: 'End Screen',         cat: 'CTA',         thumb: '#D97706' },
]

export const transitions = [
  { id: 'tr1', name: 'Cut',        icon: '✂️' },
  { id: 'tr2', name: 'Dissolve',   icon: '🌊' },
  { id: 'tr3', name: 'Fade Black', icon: '⬛' },
  { id: 'tr4', name: 'Wipe Right', icon: '➡️' },
  { id: 'tr5', name: 'Zoom In',    icon: '🔍' },
  { id: 'tr6', name: 'Slide Up',   icon: '⬆️' },
  { id: 'tr7', name: 'Glitch',     icon: '⚡' },
  { id: 'tr8', name: 'Spin',       icon: '🌀' },
  { id: 'tr9', name: 'Bounce',     icon: '🏀' },
]

export const colorPresets = [
  { id: 'cp1', name: 'Cinematic', colors: ['#0A0A0A','#1A1A2E','#E94560'] },
  { id: 'cp2', name: 'Warm Film', colors: ['#2C1810','#8B4513','#F4A460'] },
  { id: 'cp3', name: 'Cold Steel', colors: ['#0D1B2A','#1B4F72','#85C1E9'] },
  { id: 'cp4', name: 'Vivid Pop',  colors: ['#FF006E','#FB5607','#FFBE0B'] },
  { id: 'cp5', name: 'Matte BW',  colors: ['#2D2D2D','#808080','#F0F0F0'] },
  { id: 'cp6', name: 'Golden Hr', colors: ['#1A0A00','#8B4513','#FFD700'] },
]

export const collaborators = [
  { id: 'u1', name: 'Sarah K', color: '#EC4899', online: true  },
  { id: 'u2', name: 'Mike J',  color: '#06B6D4', online: true  },
  { id: 'u3', name: 'Jordan L',color: '#D97706', online: false },
]

export const comments = [
  { id: 'cm1', user: 'Sarah K', color: '#EC4899', text: 'The intro hook is great!', time: '2m ago', at: 1.2 },
  { id: 'cm2', user: 'Mike J',  color: '#06B6D4', text: 'Trim the B-roll a bit?',  time: '8m ago', at: 28 },
]

export const versionHistory = [
  { id: 'v1h', label: 'v0.3 — Added voiceover', time: '10 min ago', author: 'You' },
  { id: 'v2h', label: 'v0.2 — Color grade',      time: '1 hr ago',  author: 'Sarah K' },
  { id: 'v3h', label: 'v0.1 — Initial cut',       time: '2 hrs ago', author: 'You' },
]

export const textAnimations = ['Fade In','Slide Up','Typewriter','Pop','Bounce','Glitch','Neon']
export const fontFamilies   = ['Inter','Montserrat','Bebas Neue','Roboto','Playfair','Impact','Space Grotesk']
export const subtitleLanguages = ['English','Indonesian','Spanish','French','German','Japanese','Korean','Arabic']

export const stockFootage = [
  { id: 'sf1', name: 'City Timelapse 4K',  duration: '0:30', tags: 'city urban' },
  { id: 'sf2', name: 'Nature Forest Walk', duration: '0:45', tags: 'nature forest' },
  { id: 'sf3', name: 'Office Workspace',   duration: '0:20', tags: 'office work' },
  { id: 'sf4', name: 'Tech Abstract BG',   duration: '0:15', tags: 'tech abstract' },
  { id: 'sf5', name: 'People Walking',     duration: '0:25', tags: 'people street' },
]
