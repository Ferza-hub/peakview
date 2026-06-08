export const projects = [
  { id: 1, title: 'How I Made $100K as a Creator', duration: '1:24', platform: 'youtube',   color: '#7C3AED', lastEdited: '2 hours ago',   status: 'draft',     collaborators: 2, progress: 75 },
  { id: 2, title: 'Morning Routine Reel 2026',      duration: '0:45', platform: 'instagram', color: '#EC4899', lastEdited: 'Yesterday',      status: 'published', collaborators: 1, progress: 100 },
  { id: 3, title: 'Top 10 AI Tools Review',         duration: '2:10', platform: 'youtube',   color: '#2563EB', lastEdited: '3 days ago',    status: 'draft',     collaborators: 3, progress: 40 },
  { id: 4, title: 'Studio Setup Tour 2026',         duration: '0:58', platform: 'tiktok',   color: '#06B6D4', lastEdited: '1 week ago',    status: 'draft',     collaborators: 1, progress: 60 },
  { id: 5, title: 'Creator Burnout Honest Talk',    duration: '1:50', platform: 'youtube',   color: '#DC2626', lastEdited: '2 weeks ago',   status: 'draft',     collaborators: 0, progress: 20 },
  { id: 6, title: 'Brand Deal Tips for Beginners',  duration: '1:15', platform: 'youtube',   color: '#D97706', lastEdited: '3 weeks ago',   status: 'published', collaborators: 2, progress: 100 },
]

export const TOTAL_DURATION = 65

export const initialTracks = [
  {
    id: 'v1', type: 'video', label: 'V1', height: 40, muted: false, locked: false,
    clips: [
      { id: 'c1',  label: 'Intro.mp4',          start: 0,  duration: 8,  color: '#2563EB', type: 'video' },
      { id: 'c2',  label: 'Main_Interview.mp4',  start: 8,  duration: 27, color: '#7C3AED', type: 'video' },
      { id: 'c3',  label: 'Office_BRoll.mp4',    start: 35, duration: 10, color: '#0891B2', type: 'video' },
      { id: 'c4',  label: 'Interview_2.mp4',     start: 45, duration: 12, color: '#7C3AED', type: 'video' },
      { id: 'c5',  label: 'Outro.mp4',           start: 57, duration: 8,  color: '#059669', type: 'video' },
    ],
  },
  {
    id: 'v2', type: 'video', label: 'V2', height: 36, muted: false, locked: false,
    clips: [
      { id: 'c6',  label: 'Logo_Overlay.mov',            start: 0,  duration: 5, color: '#D97706', type: 'overlay' },
      { id: 'c7',  label: 'Lower Third — Alex Rivera',   start: 9,  duration: 6, color: '#BE185D', type: 'overlay' },
      { id: 'c8',  label: 'Lower Third — @alexrivera',   start: 47, duration: 5, color: '#BE185D', type: 'overlay' },
    ],
  },
  {
    id: 'a1', type: 'audio', label: 'Music', height: 32, muted: false, locked: false,
    clips: [
      { id: 'c9',  label: 'Chill_Vibes_LoFi.mp3', start: 0, duration: 65, color: '#16A34A', type: 'audio' },
    ],
  },
  {
    id: 'a2', type: 'audio', label: 'VO', height: 32, muted: false, locked: false,
    clips: [
      { id: 'c10', label: 'VO_Intro.wav', start: 2,  duration: 5,  color: '#0284C7', type: 'audio' },
      { id: 'c11', label: 'VO_Main.wav',  start: 10, duration: 23, color: '#0284C7', type: 'audio' },
      { id: 'c12', label: 'VO_Outro.wav', start: 58, duration: 5,  color: '#0284C7', type: 'audio' },
    ],
  },
  {
    id: 'sub', type: 'subtitle', label: 'Sub', height: 28, muted: false, locked: false,
    clips: [
      { id: 'c13', label: 'Hey, welcome back to the channel!',     start: 2,  duration: 2.8, color: '#F59E0B', type: 'subtitle' },
      { id: 'c14', label: "I'm Alex and today we're talking...",   start: 5,  duration: 3.2, color: '#F59E0B', type: 'subtitle' },
      { id: 'c15', label: 'So last year I decided to go all-in',   start: 10, duration: 3.5, color: '#F59E0B', type: 'subtitle' },
      { id: 'c16', label: 'And the results were incredible',       start: 14, duration: 3.0, color: '#F59E0B', type: 'subtitle' },
      { id: 'c17', label: "Here's exactly what I did...",          start: 18, duration: 2.5, color: '#F59E0B', type: 'subtitle' },
      { id: 'c18', label: 'First, consistency above everything',   start: 22, duration: 3.5, color: '#F59E0B', type: 'subtitle' },
      { id: 'c19', label: 'I posted 3 times a week minimum',      start: 26, duration: 3.5, color: '#F59E0B', type: 'subtitle' },
      { id: 'c20', label: 'The algorithm rewards consistency',     start: 30, duration: 3.2, color: '#F59E0B', type: 'subtitle' },
      { id: 'c21', label: 'Second lesson: know your numbers',     start: 35, duration: 3.0, color: '#F59E0B', type: 'subtitle' },
      { id: 'c22', label: 'Track every metric obsessively',       start: 39, duration: 3.0, color: '#F59E0B', type: 'subtitle' },
    ],
  },
  {
    id: 'fx', type: 'fx', label: 'FX', height: 28, muted: false, locked: false,
    clips: [
      { id: 'c23', label: 'Cinematic Color Grade', start: 0,  duration: 65, color: '#7C3AED', type: 'fx' },
      { id: 'c24', label: 'Film Grain',            start: 0,  duration: 65, color: '#525252', type: 'fx' },
      { id: 'c25', label: 'Cross Dissolve',        start: 7.5, duration: 1, color: '#DC2626', type: 'transition' },
    ],
  },
]

export const stockMusic = [
  { id: 1, title: 'Chill Vibes Lo-Fi',      artist: 'Studio Beats',  duration: '3:24', genre: 'Lo-Fi',     bpm: 85,  color: '#16A34A' },
  { id: 2, title: 'Epic Cinematic Rise',    artist: 'Epic Music Co.',duration: '2:45', genre: 'Epic',      bpm: 120, color: '#DC2626' },
  { id: 3, title: 'Upbeat Corporate',       artist: 'Business Beats',duration: '2:10', genre: 'Corporate', bpm: 130, color: '#2563EB' },
  { id: 4, title: 'Dreamy Ambient',         artist: 'Ambient Lab',   duration: '4:00', genre: 'Ambient',   bpm: 70,  color: '#7C3AED' },
  { id: 5, title: 'Funky Groove',           artist: 'Funk Factory',  duration: '2:55', genre: 'Funk',      bpm: 105, color: '#D97706' },
  { id: 6, title: 'Energetic Pop',          artist: 'Pop Studio',    duration: '3:12', genre: 'Pop',       bpm: 128, color: '#EC4899' },
  { id: 7, title: 'Soft Piano Ballad',      artist: 'Piano House',   duration: '3:40', genre: 'Piano',     bpm: 75,  color: '#0891B2' },
  { id: 8, title: 'Hip Hop Trap Beat',      artist: 'Urban Sounds',  duration: '2:30', genre: 'Hip-Hop',   bpm: 140, color: '#374151' },
  { id: 9, title: 'Morning Coffee Jazz',    artist: 'Jazz Corner',   duration: '4:15', genre: 'Jazz',      bpm: 90,  color: '#92400E' },
  { id: 10, title: 'Summer Electronic',    artist: 'EDM Lab',       duration: '3:00', genre: 'Electronic',bpm: 135, color: '#0284C7' },
]

export const stockFootage = [
  { id: 1,  title: 'City Time-Lapse 4K',    category: 'Urban',    duration: '0:30', color: '#1D4ED8' },
  { id: 2,  title: 'Nature Aerial Shot',     category: 'Nature',   duration: '0:20', color: '#059669' },
  { id: 3,  title: 'Business Team Meeting',  category: 'Business', duration: '0:45', color: '#7C3AED' },
  { id: 4,  title: 'Laptop + Coffee Desk',   category: 'Lifestyle',duration: '0:15', color: '#D97706' },
  { id: 5,  title: 'Ocean Sunset Drone',     category: 'Nature',   duration: '0:25', color: '#0891B2' },
  { id: 6,  title: 'Tech Background Loop',   category: 'Tech',     duration: '0:10', color: '#4F46E5' },
  { id: 7,  title: 'Studio Recording Session',category: 'Creative',duration: '0:35', color: '#BE185D' },
  { id: 8,  title: 'Walking City Streets',   category: 'Urban',    duration: '0:20', color: '#374151' },
]

export const transitions = [
  { id: 1, name: 'Cross Dissolve',  icon: '⟶', preview: '#7C3AED' },
  { id: 2, name: 'Fade to Black',   icon: '◼',  preview: '#111' },
  { id: 3, name: 'Slide Left',      icon: '←',  preview: '#2563EB' },
  { id: 4, name: 'Slide Right',     icon: '→',  preview: '#059669' },
  { id: 5, name: 'Zoom In',         icon: '⊕',  preview: '#DC2626' },
  { id: 6, name: 'Zoom Out',        icon: '⊖',  preview: '#D97706' },
  { id: 7, name: 'Glitch',          icon: '⚡',  preview: '#06B6D4' },
  { id: 8, name: 'Spin',            icon: '↺',  preview: '#EC4899' },
  { id: 9, name: 'Wipe',            icon: '▷',  preview: '#16A34A' },
]

export const colorPresets = [
  { id: 1, name: 'Cinematic',    preview: ['#1A0A00','#F5DEB3'], warm: 15,  contrast: 20, sat: -10 },
  { id: 2, name: 'Cool Tone',    preview: ['#001828','#B0D4E8'], warm: -20, contrast: 15, sat: 5  },
  { id: 3, name: 'Vibrant',      preview: ['#0D0024','#FFD700'], warm: 5,   contrast: 10, sat: 40 },
  { id: 4, name: 'Black & White',preview: ['#000','#FFF'],       warm: 0,   contrast: 30, sat: -100},
  { id: 5, name: 'Sunset',       preview: ['#8B0000','#FFD59E'], warm: 40,  contrast: 15, sat: 20 },
  { id: 6, name: 'Moody',        preview: ['#0A0A18','#6464A0'], warm: -10, contrast: 40, sat: -20},
]

export const templates = [
  { id: 1,  name: 'YouTube Intro Minimal',    category: 'intro',       duration: '0:05', color: '#FF0000', platform: 'youtube'   },
  { id: 2,  name: 'YouTube Outro Subscribe',  category: 'outro',       duration: '0:20', color: '#FF0000', platform: 'youtube'   },
  { id: 3,  name: 'Lower Third Minimal',      category: 'lower-third', duration: '0:05', color: '#7C3AED', platform: 'all'       },
  { id: 4,  name: 'Lower Third Bold',         category: 'lower-third', duration: '0:05', color: '#2563EB', platform: 'all'       },
  { id: 5,  name: 'TikTok Trending Hook',     category: 'intro',       duration: '0:03', color: '#06B6D4', platform: 'tiktok'    },
  { id: 6,  name: 'Reels Opening Title',      category: 'intro',       duration: '0:04', color: '#EC4899', platform: 'instagram' },
  { id: 7,  name: 'Tutorial Chapter Card',    category: 'chapter',     duration: '0:05', color: '#D97706', platform: 'youtube'   },
  { id: 8,  name: 'Review Score Overlay',     category: 'overlay',     duration: '0:06', color: '#16A34A', platform: 'all'       },
  { id: 9,  name: 'Subscribe Button Anim',    category: 'cta',         duration: '0:04', color: '#FF0000', platform: 'youtube'   },
  { id: 10, name: 'Social Media Bug',         category: 'overlay',     duration: 'loop', color: '#BE185D', platform: 'all'       },
  { id: 11, name: 'Travel Vlog Full Pack',    category: 'full',        duration: '3:00', color: '#0891B2', platform: 'youtube'   },
  { id: 12, name: 'Podcast Episode Template', category: 'full',        duration: '1:00', color: '#374151', platform: 'youtube'   },
]

export const mediaFiles = [
  { id: 1, name: 'Intro.mp4',           type: 'video', duration: '0:08', size: '120 MB', color: '#2563EB' },
  { id: 2, name: 'Main_Interview.mp4',  type: 'video', duration: '0:27', size: '380 MB', color: '#7C3AED' },
  { id: 3, name: 'Office_BRoll.mp4',    type: 'video', duration: '0:10', size: '145 MB', color: '#0891B2' },
  { id: 4, name: 'Interview_2.mp4',     type: 'video', duration: '0:12', size: '168 MB', color: '#7C3AED' },
  { id: 5, name: 'Outro.mp4',           type: 'video', duration: '0:08', size: '98 MB',  color: '#059669' },
  { id: 6, name: 'Logo_Overlay.mov',    type: 'video', duration: '0:05', size: '45 MB',  color: '#D97706' },
  { id: 7, name: 'Chill_Vibes.mp3',     type: 'audio', duration: '3:24', size: '8.2 MB', color: '#16A34A' },
  { id: 8, name: 'VO_Main.wav',         type: 'audio', duration: '0:23', size: '4.1 MB', color: '#0284C7' },
  { id: 9, name: 'VO_Intro.wav',        type: 'audio', duration: '0:05', size: '0.9 MB', color: '#0284C7' },
  { id: 10, name: 'Thumbnail_Draft.png',type: 'image', duration: null,   size: '1.2 MB', color: '#EC4899' },
]

export const collaborators = [
  { id: 1, name: 'Sarah Chen',  role: 'Editor',   color: '#EC4899', online: true  },
  { id: 2, name: 'Marcus Kim',  role: 'Designer', color: '#06B6D4', online: false },
  { id: 3, name: 'You',         role: 'Owner',    color: '#7C3AED', online: true  },
]

export const comments = [
  { id: 1, user: 'Sarah Chen',  userColor: '#EC4899', text: 'The transition at 0:35 feels abrupt. Try a cross-dissolve?', time: 35, ago: '2h ago',  resolved: false },
  { id: 2, user: 'Marcus Kim',  userColor: '#06B6D4', text: 'Lower third looks great! Color matches the brand kit.', time: 9,  ago: '1d ago',  resolved: true  },
  { id: 3, user: 'Sarah Chen',  userColor: '#EC4899', text: 'VO audio level is a bit low in the main section — boost +3dB?', time: 12, ago: '2d ago', resolved: false },
]

export const versionHistory = [
  { id: 1, label: 'v3 — Added B-Roll sequence',       ago: '2h ago',   user: 'Sarah Chen',  color: '#EC4899' },
  { id: 2, label: 'v2 — Color grade pass',             ago: 'Yesterday', user: 'Alex Rivera', color: '#7C3AED' },
  { id: 3, label: 'v1 — Initial cut',                  ago: '3 days ago',user: 'Alex Rivera', color: '#7C3AED' },
]

export const textAnimations = ['None', 'Fade In', 'Slide Up', 'Pop', 'Typewriter', 'Bounce', 'Glow']
export const fontFamilies = ['Inter', 'Poppins', 'Bebas Neue', 'Montserrat', 'Oswald', 'Playfair Display', 'Dancing Script']
export const subtitleLanguages = ['English', 'Indonesian', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Portuguese']
