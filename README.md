# PeakEdit — Video Editor Web App Template

> Full-stack React video editor template. Multi-track timeline, real video playback, Web Audio waveforms, AI captions via Whisper, dan full CRUD dengan localStorage persistence.

---

## Fitur Utama

### Editor
- **Multi-track timeline** — 6 track: V1 Main, V2 Overlay, Music, Voiceover, Subtitles, FX
- **Real video playback** — `<video>` element sync ke timeline playhead, scrubbing aktual
- **Waveform visualizer** — Web Audio API decode file audio → canvas waveform real
- **Video thumbnail** — Extract frame otomatis dari file video yang diupload
- **Subtitle overlay** — Caption tampil di preview canvas sesuai waktu
- **7 text animations** — Fade In, Slide Up, Typewriter, Pop, Bounce, Glitch, Neon
- **Color & transform** — Brightness, contrast, saturation, scale, rotation per clip
- **Transitions** — Cut, Fade, Dissolve, Wipe, Slide, Zoom antar clip

### CRUD Lengkap
- **Projects** — Create, rename inline, delete + confirm dialog, autosave 30s + Ctrl+S
- **Media Library** — Upload file sungguhan (drag & drop), add/edit/delete dengan cascade ke timeline
- **Clips** — Drag dari library ke track, reposition drag, resize kiri/kanan, split at playhead, delete
- **Captions** — Add manual (in/out time + teks), edit inline, delete, AI generate via Whisper

### AI & Integrasi
- **Auto-caption Whisper** — HuggingFace Inference API (`openai/whisper-small`), gratis tanpa API key
- **6 AI tools** — Auto-cut silence, B-roll suggestions, Script to video, Background remove, Auto-reframe, Highlight clipper
- **Graceful error handling** — Retry UI + error states di semua modal

### UX
- **Undo/Redo 30 langkah** — `useRef`-based history
- **Touch-friendly** — Semua fitur berjalan di tablet/touchscreen
- **Stacked toast notifications** — success / error / info / warning
- **Confirm dialog** — Sebelum semua operasi delete
- **Keyboard shortcuts** — `Space` play/pause · `←→` seek ±5s · `Delete` clip · `Ctrl+Z/Y` undo/redo · `Ctrl+S` save
- **localStorage persistence** — Project list + per-project data (tracks + media + format)
- **Format switching** — 16:9 / 9:16 / 1:1
- **8 project templates** — YouTube Intro, TikTok Hook, Subscribe Outro, Lower Third, dll

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

## Instalasi & Development Lokal

### Prerequisites
- Node.js 18+
- npm 9+

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

### Build untuk Production

```bash
npm run build
# Output ada di folder /dist — ini yang kamu upload ke hosting
```

---

## ⚠️ CARA DEPLOY — BACA INI SEBELUM DEPLOY

> **Penting:** PeakEdit adalah **Single Page Application (SPA)** — bukan server Node.js. Kamu **tidak** menjalankan `npm run dev` atau `npm start` di server production. Yang kamu deploy adalah folder `/dist` hasil build — berisi file HTML, CSS, dan JS statis.

### Kenapa ada masalah "404 saat refresh"?

SPA menggunakan client-side routing. Ketika user membuka `/editor/123` langsung (atau refresh), server mencari file `editor/123/index.html` yang tidak ada. Setiap platform butuh konfigurasi khusus agar selalu serve `index.html` dan biarkan React Router yang handle routing-nya.

---

## Deploy ke Vercel (Termudah — Recommended)

### Opsi A: Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Build dulu
npm run build

# Deploy
vercel --prod
```

Vercel otomatis detect Vite dan konfigurasi SPA routing. Tidak perlu setup tambahan.

### Opsi B: Via GitHub (Auto-deploy)

1. Push kode ke GitHub
2. Buka [vercel.com](https://vercel.com) → **Add New Project**
3. Import repository kamu
4. Framework Preset: pilih **Vite**
5. Klik **Deploy**

Setiap push ke `main` akan auto-deploy.

### Environment Variables di Vercel

Buka **Project Settings → Environment Variables**, tambahkan:
```
VITE_HF_TOKEN = hf_xxxxxxxxxxxxxxxxxxxxx
```

---

## Deploy ke Netlify

### Opsi A: Drag & Drop (Tanpa akun GitHub)

```bash
npm run build
```

Buka [app.netlify.com](https://app.netlify.com) → drag folder `/dist` ke halaman deploy.

### Opsi B: Via CLI

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### ⚠️ WAJIB: Fix SPA Routing di Netlify

Buat file `public/_redirects` (persis nama ini, tanpa ekstensi):

```
/*    /index.html    200
```

File ini akan masuk ke folder `/dist` saat build dan memberitahu Netlify untuk selalu serve `index.html`.

### Opsi C: Via GitHub (Auto-deploy)

1. Push ke GitHub
2. Netlify → **Add new site → Import an existing project**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Klik **Deploy**

Jangan lupa tambahkan `public/_redirects` seperti di atas.

---

## Deploy ke Cloudflare Pages

```bash
npm i -g wrangler
npm run build
wrangler pages deploy dist
```

Cloudflare Pages otomatis handle SPA routing. Tidak perlu konfigurasi tambahan.

Via GitHub: Settings → **Functions → Routes** tidak diperlukan untuk SPA biasa.

---

## Deploy ke VPS / Server Ubuntu (Nginx)

Cocok kalau kamu punya VPS (DigitalOcean, Linode, Hetzner, dll).

### 1. Build lokal, upload ke server

```bash
# Build lokal
npm run build

# Upload folder dist ke server
scp -r dist/ user@your-server:/var/www/peakedit/
```

### 2. Konfigurasi Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/peakedit;
    index index.html;

    # ⚠️ Ini yang paling penting untuk SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache aset statis
    location ~* \.(js|css|png|jpg|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

### 3. HTTPS dengan Certbot (Wajib untuk AI features)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

> **Penting:** Fitur AI caption (HuggingFace API) dan MediaRecorder export membutuhkan HTTPS. Di `http://` browser akan blokir request ke API eksternal (CORS + mixed content).

---

## Deploy ke Shared Hosting / cPanel

Shared hosting biasanya tidak support Nginx config. Gunakan `.htaccess` untuk Apache:

### 1. Build dan upload

```bash
npm run build
```

Upload **isi folder `/dist`** (bukan folder-nya) ke `public_html` via File Manager atau FTP.

### 2. Buat file `.htaccess` di `public_html`

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

> Pastikan `mod_rewrite` aktif di hosting kamu (hampir semua shared hosting sudah aktif by default).

---

## Deploy ke GitHub Pages

> **Catatan:** GitHub Pages cocok untuk demo/portfolio, tapi ada keterbatasan untuk app production (tidak support backend, HTTPS default tapi API calls perlu CORS-friendly).

### 1. Edit `vite.config.js`

```js
export default defineConfig({
  base: '/nama-repo-kamu/',   // ← tambahkan ini
  plugins: [react()],
})
```

### 2. Install plugin deploy

```bash
npm install --save-dev gh-pages
```

### 3. Tambah script di `package.json`

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### 4. Deploy

```bash
npm run deploy
```

Aktifkan GitHub Pages di repo Settings → Pages → Source: `gh-pages` branch.

---

## Environment Variables

Semua environment variable **harus** diawali dengan `VITE_` agar bisa diakses dari kode React.

### Tersedia

| Variable | Kegunaan | Default |
|---|---|---|
| `VITE_HF_TOKEN` | HuggingFace API token untuk AI caption | Tidak wajib — API gratis ada rate limit-nya |

### Cara setup

**Development:** Buat file `.env.local` di root project:
```
VITE_HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
```

**Production:** Set via dashboard platform hosting kamu (Vercel/Netlify/dll).

> `.env.local` sudah ada di `.gitignore`. Jangan commit token ke repository.

---

## Checklist Sebelum Go-Live

- [ ] `npm run build` berhasil tanpa error
- [ ] Test buka URL langsung (bukan dari dashboard) → tidak 404
- [ ] Test refresh halaman editor → tidak 404
- [ ] HTTPS aktif (bukan HTTP) → wajib untuk AI + export
- [ ] Coba upload video → playback di preview berjalan
- [ ] Coba export → file `.webm` ter-download
- [ ] Coba AI caption → response atau error message muncul (bukan freeze)
- [ ] Test di mobile/tablet → UI tidak terpotong

---

## Troubleshooting

### "Page not found" / 404 saat refresh atau buka URL langsung

Kamu belum konfigurasi SPA routing di hosting. Lihat bagian deploy untuk platform kamu di atas.

### AI caption tidak bekerja

- Pastikan sitemu pakai **HTTPS** (bukan HTTP)
- HuggingFace free tier punya rate limit — coba beberapa detik kemudian
- Kalau model sedang cold start, bisa timeout 20-30 detik — ini normal, tombol Retry akan muncul

### Export `.webm` tidak berjalan

- MediaRecorder butuh **Chrome atau Edge** — Firefox support terbatas, Safari tidak support
- Pastikan HTTPS aktif
- Kalau layar hitam di export: upload video dulu ke Media Library sebelum export

### Data hilang saat reload

- PeakEdit pakai **localStorage** — data tersimpan per browser, per domain
- Incognito/private mode: localStorage diblokir di beberapa browser
- Kalau deploy ke subdomain baru, data dari domain lama tidak akan muncul (ini expected)

### Video tidak bisa diputar setelah di-deploy

- File video tersimpan sebagai Blob URL — hanya hidup selama sesi browser
- Untuk production dengan persistent media, kamu perlu integrasi cloud storage (S3, Cloudinary, dll) — lihat bagian Customisasi di bawah

---

## Customisasi

### Ganti warna tema

Edit `tailwind.config.js`:
```js
colors: {
  ed: {
    bg:     '#080808',   // Background utama
    panel:  '#111111',   // Panel sidebar
    accent: '#7C3AED',   // Warna aksen (ganti sesuai brand)
  }
}
```

### Ganti logo & favicon

- Logo di `TopBar.jsx` — cari `PeakEdit` text dan ganti
- Favicon: edit `public/favicon.svg`
- Tab title: edit `<title>` di `index.html`

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

### Integrasi cloud storage untuk media

Edit `src/utils/fileRegistry.js` — ganti Blob URL logic dengan upload ke S3/Cloudinary:
```js
// Ganti blobUrl generation dengan:
const uploadResult = await uploadToCloudinary(file)
registry.set(id, { ...meta, blobUrl: uploadResult.secure_url })
```

### Gunakan AI API lain

Edit `src/utils/hfApi.js` — ganti endpoint Whisper:
```js
const response = await fetch(
  'https://api-inference.huggingface.co/models/YOUR_MODEL',
  { method: 'POST', body: audioFile }
)
```

### Tambah autentikasi nyata

Edit `src/context/AuthContext.jsx` — ganti mock login dengan API call ke backend kamu:
```js
const login = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  // handle token, redirect, dll
}
```

### Tambah halaman baru

Di `src/App.jsx`:
```jsx
<Route path="/analytics" element={<Analytics />} />
```

---

## Struktur Proyek

```
src/
├── App.jsx                         # Root + ToastProvider + Router
├── index.css                       # Tailwind + custom classes + keyframes
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
│   │   ├── ExportModal.jsx         # Export dengan progress bar + error states
│   │   └── PublishModal.jsx        # Publish ke YouTube/Instagram/TikTok
│   └── ui/
│       └── ConfirmDialog.jsx       # Modal konfirmasi delete
│
├── context/
│   └── ToastContext.jsx            # Stacked toast notifications
│
├── data/
│   └── editorData.js               # Mock data: tracks, media, templates (dengan clips)
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
| Chrome 90+ | ✅ Full (termasuk export) |
| Edge 90+ | ✅ Full (termasuk export) |
| Firefox 88+ | ✅ Sebagian (export `.webm` terbatas) |
| Safari 15+ | ⚠️ Playback OK, export tidak support MediaRecorder |

> Export video menggunakan MediaRecorder API — paling stabil di Chrome/Edge.

---

## Lisensi

Template ini dijual dengan lisensi **Extended License** — boleh digunakan untuk project komersial, SaaS, atau produk yang dijual ke end-user. Tidak boleh dijual ulang sebagai template.

---

## Support

Pertanyaan dan bug report: hubungi via platform tempat kamu membeli template ini.
