# PeakEdit — Video Editor UI Template

> Full-stack React video editor template. Multi-track timeline, real video playback, Web Audio waveforms, AI captions via Whisper, dan full CRUD dengan localStorage persistence.

![PeakEdit Preview](https://placehold.co/1200x630/080808/7C3AED?text=PeakEdit+%E2%80%94+Video+Editor+Template)

---

## Demo

Jalankan lokal:
```bash
npm install && npm run dev
```

---

## Fitur Utama

### Editor
- **Multi-track timeline** — 6 track: V1 Main, V2 Overlay, Music, Voiceover, Subtitles, FX
- **Real video playback** — `<video>` element sync ke timeline playhead, scrubbing aktual
- **Waveform visualizer** — Web Audio API decode file audio → canvas waveform real
- **Video thumbnail** — Extract frame otomatis dari file video yang diupload
- **Subtitle overlay** — Caption tampil di preview canvas sesuai waktu

### CRUD Lengkap
- **Projects** — Create, rename inline, delete + confirm dialog, autosave 30s + Ctrl+S
- **Media Library** — Upload file sungguhan (drag & drop), add/edit/delete dengan cascade ke timeline
- **Clips** — Drag dari library ke track, reposition drag, resize kiri/kanan, split at playhead, delete
- **Captions** — Add manual (in/out time + teks), edit inline, delete, AI generate via Whisper

### AI & Integrasi
- **Auto-caption Whisper** — HuggingFace Inference API (`openai/whisper-small`), gratis tanpa API key
- **Graceful error handling** — Toast "Maaf antrian proses sedang penuh, mohon tunggu" saat rate limit/timeout
- **6 AI tools** — Auto-cut silence, B-roll suggestions, Script to video, Background remove, Auto-reframe, Highlight clipper

### UX
- **Undo/Redo 30 langkah** — `useRef`-based history (bebas stale closure)
- **Stacked toast notifications** — success / error / info / warning
- **Confirm dialog** — Sebelum semua operasi delete
- **Keyboard shortcuts** — `Space` play/pause · `←→` seek ±5s · `Delete` clip · `Ctrl+Z/Y` undo/redo · `Ctrl+S` save
- **localStorage persistence** — Project list + per-project data (tracks + media + format)
- **Format switching** — 16:9 / 9:16 / 1:1

---

## Tech Stack

| Library | Versi | Kegunaan |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.4 | Styling |
| React Router | 6.x | Routing (Dashboard / Editor) |
| Lucide React | 0.344 | Icons |
| Web Audio API | Native | Waveform |
| HuggingFace API | Free | Whisper AI captions |

---

## Struktur Proyek

```
src/
├── App.jsx                         # Root + ToastProvider + Router
├── index.css                       # Tailwind + custom classes
│
├── pages/
│   ├── Dashboard.jsx               # Project grid + CRUD
│   └── Editor.jsx                  # Editor orchestrator + semua callbacks
│
├── components/
│   ├── editor/
│   │   ├── TopBar.jsx              # Navigasi, undo/redo, format, save status
│   │   ├── LeftPanel.jsx           # 8-tab panel (Media/Templates/Text/Audio/Effects/AI/Stock/Collab)
│   │   ├── Preview.jsx             # Video element + subtitle overlay + transport controls
│   │   ├── Timeline.jsx            # Multi-track + drag/resize/drop + waveform canvas
│   │   ├── RightPanel.jsx          # Inspector (transform, color, audio)
│   │   ├── AddMediaModal.jsx       # Upload file + metadata extraction
│   │   ├── ExportModal.jsx         # Export dengan progress bar
│   │   └── PublishModal.jsx        # Publish ke YouTube/Instagram/TikTok
│   └── ui/
│       └── ConfirmDialog.jsx       # Modal konfirmasi delete
│
├── context/
│   └── ToastContext.jsx            # Stacked toast notifications
│
├── data/
│   └── editorData.js               # Mock data: tracks, media, templates, dll
│
└── utils/
    ├── helpers.js                  # genId, fmtTime, clamp, deepClone, parseDur
    ├── storage.js                  # localStorage: projects + project data
    ├── fileRegistry.js             # In-memory Map: mediaId → {file, blobUrl, waveform, thumbnail}
    ├── waveform.js                 # Web Audio API waveform computation
    ├── thumbnail.js                # Canvas frame extraction dari video
    └── hfApi.js                    # HuggingFace Whisper API + segmentTranscript
```

---

## Instalasi & Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Langkah

```bash
# 1. Clone atau extract template
git clone <repo-url>
cd peakview

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev

# 4. Buka browser
# → http://localhost:5173
```

### Build Production

```bash
npm run build
# Output ada di /dist — siap deploy ke Vercel, Netlify, atau hosting manapun
```

### Deploy ke Vercel (1 menit)

```bash
npm i -g vercel
vercel --prod
```

---

## Cara Customisasi

### Ganti warna tema

Edit `tailwind.config.js`:
```js
colors: {
  ed: {
    bg:     '#080808',   // Background utama
    panel:  '#111111',   // Panel sidebar
    accent: '#7C3AED',   // Warna aksen (violet)
    // ... ganti sesuai brand kamu
  }
}
```

### Tambah track baru

Edit `src/data/editorData.js`, array `initialTracks`:
```js
{
  id: 'custom1',
  label: 'My Track',
  type: 'video',       // 'video' | 'audio' | 'subtitle' | 'fx'
  muted: false,
  locked: false,
  height: 40,
  clips: []
}
```

### Gunakan AI API lain

Edit `src/utils/hfApi.js` — ganti endpoint Whisper dengan model lain atau API kamu sendiri:
```js
const response = await fetch(
  'https://api-inference.huggingface.co/models/YOUR_MODEL',
  { method: 'POST', body: audioFile }
)
```

### Tambah halaman baru

Di `src/App.jsx`:
```jsx
<Route path="/analytics" element={<Analytics />} />
```

---

## Keyboard Shortcuts

| Shortcut | Aksi |
|---|---|
| `Space` | Play / Pause |
| `←` / `→` | Seek ±5 detik |
| `Delete` | Hapus clip terpilih |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+S` | Save manual |

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Edge 90+ | ✅ Full |

> Web Audio API dan canvas thumbnail extraction membutuhkan browser modern.

---

## Lisensi

Template ini dijual dengan lisensi **Extended License** — boleh digunakan untuk project komersial, SaaS, atau produk yang dijual ke end-user. Tidak boleh dijual ulang sebagai template.

---

## Support

Pertanyaan dan bug report: hubungi via platform tempat kamu membeli template ini.
