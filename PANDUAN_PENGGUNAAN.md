# Panduan Penggunaan — PeakEdit Template

Panduan lengkap dari instalasi sampai customisasi untuk pembeli template.

---

## Daftar Isi

1. [Persiapan Awal](#1-persiapan-awal)
2. [Menjalankan Template](#2-menjalankan-template)
3. [Memahami Tampilan](#3-memahami-tampilan)
4. [Cara Pakai Dashboard](#4-cara-pakai-dashboard)
5. [Cara Pakai Editor](#5-cara-pakai-editor)
6. [Upload & Kelola Media](#6-upload--kelola-media)
7. [Edit Timeline](#7-edit-timeline)
8. [Buat & Edit Caption](#8-buat--edit-caption)
9. [Fitur AI (Whisper)](#9-fitur-ai-whisper)
10. [Export & Publish](#10-export--publish)
11. [Customisasi Tampilan](#11-customisasi-tampilan)
12. [Customisasi Fitur](#12-customisasi-fitur)
13. [Deploy ke Production](#13-deploy-ke-production)
14. [FAQ & Troubleshooting](#14-faq--troubleshooting)

---

## 1. Persiapan Awal

### Yang Kamu Butuhkan

- **Node.js versi 18 ke atas** — download di [nodejs.org](https://nodejs.org)
- **npm** (sudah termasuk di Node.js)
- Editor kode: VS Code direkomendasikan

### Cek Versi Node.js

```bash
node --version
# Harus muncul: v18.x.x atau lebih tinggi

npm --version
# Harus muncul: 9.x.x atau lebih tinggi
```

---

## 2. Menjalankan Template

```bash
# Masuk ke folder template
cd peakview

# Install semua package yang dibutuhkan (lakukan sekali saja)
npm install

# Jalankan server development
npm run dev
```

Setelah itu buka browser dan akses `http://localhost:5173`

Template sudah jalan! Kamu akan langsung melihat halaman Dashboard.

---

## 3. Memahami Tampilan

### Dashboard (`/`)

Halaman utama berisi daftar project video. Saat pertama kali dibuka, sudah ada **3 demo project** sebagai contoh.

```
┌─────────────────────────────────────────────────────┐
│  🔮 PeakEdit   Projects  Templates  Assets  Brand   │  ← Header + navigasi
├─────────────────────────────────────────────────────┤
│                                                     │
│  Your Projects                    [+ New Project]   │
│                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │   +    │  │ Demo 1 │  │ Demo 2 │  │ Demo 3 │   │  ← Grid project
│  │  New   │  │        │  │        │  │        │   │
│  └────────┘  └────────┘  └────────┘  └────────┘   │
└─────────────────────────────────────────────────────┘
```

### Editor (`/editor/:id`)

```
┌──────────────────────────────────────────────────────────────────┐
│ ← 🔮  [Nama Project]  ↩ ↪  [16:9|9:16|1:1]  ●Saved  Export  Publish │ ← TopBar
├───────┬─────────────────────────────────────────┬────────────────┤
│       │                                         │                │
│  Tab  │           Preview Video                 │   Inspector    │
│  Icons│                                         │   (Transform,  │
│       │     ┌─────────────────────┐             │   Color,       │
│  ──── │     │   <video> element   │             │   Audio)       │
│       │     └─────────────────────┘             │                │
│  8-tab│     [◀◀] [▶ Play] [▶▶]                 │                │
│  Panel│                                         │                │
│       ├─────────────────────────────────────────┤                │
│       │           Timeline                      │                │
│       │  V1 ████████████░░░░░░████████          │                │
│       │  Music ~~~~~~~~~~~~~~~~~~~              │                │
│       │  Sub  [cap1] [cap2]                     │                │
└───────┴─────────────────────────────────────────┴────────────────┘
```

---

## 4. Cara Pakai Dashboard

### Buat Project Baru

**Cara 1:** Klik tombol **"+ New Project"** di pojok kanan atas  
**Cara 2:** Klik card **"+ New"** di grid project

Project baru langsung terbuka di Editor.

### Rename Project

1. Hover ke card project
2. Klik ikon `⋯` (tiga titik) di pojok kanan atas card
3. Pilih **Rename**
4. Ketik nama baru → tekan `Enter` atau klik ✓

### Hapus Project

1. Klik ikon `⋯` di card project
2. Pilih **Delete**
3. Konfirmasi di dialog yang muncul

> Data project **langsung terhapus permanen** dari localStorage.

### Cari Project

Gunakan search box di header — hasil filter otomatis saat kamu mengetik.

---

## 5. Cara Pakai Editor

### Navigasi Dasar

| Tombol | Fungsi |
|---|---|
| `←` di TopBar | Kembali ke Dashboard |
| Input nama project | Klik langsung untuk rename |
| `16:9 / 9:16 / 1:1` | Ganti format canvas |

### Kontrol Playback

| Shortcut | Fungsi |
|---|---|
| `Space` | Play / Pause |
| `←` (arrow key) | Mundur 5 detik |
| `→` (arrow key) | Maju 5 detik |
| Klik ruler timeline | Set posisi playhead |
| Drag scrubber di preview | Scrub halus |

### Undo / Redo

| Shortcut | Fungsi |
|---|---|
| `Ctrl+Z` | Undo (hingga 30 langkah) |
| `Ctrl+Y` | Redo |
| Tombol ↩ ↪ di TopBar | Sama seperti shortcut |

### Save Project

| Cara | Kapan |
|---|---|
| `Ctrl+S` | Save manual seketika |
| Tombol **Save** di TopBar | Sama |
| Otomatis | Setiap 30 detik jika ada perubahan |

Status save terlihat di TopBar:
- `Auto-saved` (hijau) — sudah tersimpan
- `Unsaved` (kuning) — ada perubahan belum disimpan
- `Saving…` — sedang menyimpan

---

## 6. Upload & Kelola Media

### Upload File Baru

1. Di LeftPanel, pastikan tab **Media** aktif (ikon folder)
2. Klik tombol **+** di pojok kanan
3. Modal **Add Media** terbuka
4. **Drag & drop** file ke zona upload, atau klik zona untuk browse
5. Nama, tipe, dan durasi otomatis terisi dari metadata file
6. Aktifkan toggle **"Add directly to timeline"** jika mau langsung masuk ke track
7. Klik **Add Media**

**Format yang didukung:**
- Video: `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`
- Audio: `.mp3`, `.wav`, `.ogg`, `.aac`, `.flac`, `.m4a`
- Gambar: `.jpg`, `.png`, `.gif`, `.webp`
- Subtitle: `.srt`, `.vtt`, `.ass`

### Edit Media

1. Hover ke item media di panel
2. Klik ikon ✏️ yang muncul
3. Edit nama, tipe, atau durasi
4. Klik **Save**

Perubahan nama otomatis update ke semua clip di timeline yang menggunakan media tersebut.

### Hapus Media

1. Hover ke item media
2. Klik ikon 🗑️
3. Konfirmasi di dialog

> Menghapus media **otomatis menghapus semua clip** di timeline yang berasal dari media itu.

### Drag Media ke Timeline

1. Hover ke item media di panel
2. Klik dan tahan, drag ke track yang diinginkan di timeline
3. Lepas di posisi waktu yang diinginkan

---

## 7. Edit Timeline

### Pilih Clip

Klik satu kali pada clip di timeline. Clip terpilih ditandai dengan border putih.

### Pindah Clip (Drag)

1. Pilih clip
2. Klik dan tahan di bagian tengah clip
3. Drag kiri/kanan ke posisi baru
4. Lepas mouse

### Resize Clip

1. Pilih clip (muncul handle di tepi kiri dan kanan)
2. Klik dan tahan handle kiri → drag untuk ubah titik awal
3. Klik dan tahan handle kanan → drag untuk ubah durasi

### Split Clip

1. Pilih clip yang ingin dipotong
2. Set playhead ke posisi potongan (klik ruler atau drag scrubber)
3. Klik tombol ✂️ di toolbar timeline, atau tekan shortcut `S`

Clip akan terpotong menjadi dua bagian.

### Hapus Clip

**Cara 1:** Pilih clip → tekan `Delete` (konfirmasi dialog muncul)  
**Cara 2:** Pilih clip → klik tombol ✕ merah di pojok clip

### Mute / Lock Track

Gunakan tombol kecil di header track kiri:
- 🔊 / 🔇 — Mute/unmute track
- 🔓 / 🔒 — Lock/unlock track (clip di track terkunci tidak bisa diedit)

### Zoom Timeline

Gunakan tombol `−` dan `+` di toolbar timeline, atau lihat persentase zoom di antara keduanya.

---

## 8. Buat & Edit Caption

### Ke Tab Caption

Di LeftPanel, klik tab **Text** (ikon T).

### Tambah Caption Manual

1. Klik tombol **"+ Add Caption"** di bagian bawah daftar caption
2. Isi:
   - **Teks caption**
   - **In (s)** — waktu mulai dalam detik (contoh: `5.5`)
   - **Out (s)** — waktu selesai dalam detik (contoh: `9.0`)
3. Klik **Add**

Caption langsung muncul di track **Subtitles** di timeline.

### Edit Caption

1. Hover ke item caption di daftar
2. Klik ikon ✏️
3. Edit teks, waktu in, atau waktu out
4. Klik **Save**

### Hapus Caption

Hover ke item caption → klik ikon 🗑️ → konfirmasi.

### AI Generate Caption

Lihat bagian [Fitur AI](#9-fitur-ai-whisper) di bawah.

---

## 9. Fitur AI (Whisper)

### Auto-Caption dari File Audio

1. **Upload file audio/video** terlebih dahulu ke Media Library (lihat bagian 6)
2. Di tab **Text**, klik tombol **"⚡ Generate Captions"**
3. Template akan mengirim file audio ke **HuggingFace Whisper API** (gratis, tanpa API key)
4. Tunggu proses selesai

**Kemungkinan pesan yang muncul:**

| Pesan | Artinya | Yang harus dilakukan |
|---|---|---|
| "Mengirim audio ke Whisper AI..." | Normal, sedang proses | Tunggu |
| "Model AI sedang loading, coba lagi dalam 20 detik..." | Model HF cold start | Tunggu 20 detik, coba lagi |
| "Maaf antrian proses sedang penuh, mohon tunggu" | Rate limit / timeout | Coba lagi beberapa menit kemudian |

Jika API gagal, caption simulasi otomatis dibuat sebagai fallback.

### AI Tools Lainnya (Tab AI)

Di tab **AI** di LeftPanel, ada 6 tool:

| Tool | Fungsi |
|---|---|
| Auto-Cut Silence | Hapus bagian sunyi dari footage |
| B-Roll Suggestions | Saran clip B-roll yang relevan |
| Script to Video | Generate clip dari script teks |
| Background Remove | Hapus background dari clip |
| Auto-Reframe | Reframe untuk berbagai aspect ratio |
| Highlight Clipper | Extract momen terbaik otomatis |

Klik **Run** → loading bar muncul → selesai dengan notifikasi.

---

## 10. Export & Publish

### Export Video

1. Klik tombol **Export** di TopBar
2. Pilih format: `.mp4`, `.mov`, atau `.webm`
3. Pilih kualitas: 4K, 1080p, 720p, atau 480p
4. Klik **Export**
5. Progress bar animasi berjalan → selesai dengan notifikasi

### Publish

1. Klik tombol **Publish** di TopBar
2. Pilih platform: YouTube, Instagram, atau TikTok
3. Isi judul dan deskripsi video
4. Klik **Publish**

---

## 11. Customisasi Tampilan

### Ganti Warna Tema

Buka `tailwind.config.js`:

```js
ed: {
  bg:      '#080808',   // Background utama — ganti dengan warna brand kamu
  panel:   '#111111',   // Panel sidebar
  surface: '#1A1A1A',   // Surface card
  hover:   '#222222',   // Hover state
  border:  '#2A2A2A',   // Border
  accent:  '#7C3AED',   // Warna aksen utama (sekarang violet)
  cyan:    '#06B6D4',   // Playhead & highlight
  green:   '#10B981',   // Success
  red:     '#EF4444',   // Error/delete
  amber:   '#F59E0B',   // Warning/caption
}
```

Contoh: tema **biru gelap**:
```js
accent: '#2563EB',   // Biru
cyan:   '#0EA5E9',   // Biru muda
```

### Ganti Font

Di `index.html`, ubah Google Fonts link:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;600;700&display=swap" rel="stylesheet" />
```

Lalu di `index.css`:
```css
body {
  font-family: 'YOUR_FONT', system-ui, sans-serif;
}
```

### Ganti Nama & Logo

Di `index.html`:
```html
<title>NamaAppKamu — Video Studio</title>
```

Di setiap komponen yang menampilkan "PeakEdit", cari dan replace:
```bash
# Cari semua kemunculan "PeakEdit"
grep -r "PeakEdit" src/
```

Ganti teks dan ikon `<Zap>` di `TopBar.jsx` dan `Dashboard.jsx` dengan logo kamu.

---

## 12. Customisasi Fitur

### Tambah Track Baru

Edit `src/data/editorData.js`:

```js
export const initialTracks = [
  // ... track yang sudah ada ...
  {
    id: 'graphics',       // ID unik
    label: 'Graphics',    // Nama yang tampil
    type: 'video',        // 'video' | 'audio' | 'subtitle' | 'fx'
    muted: false,
    locked: false,
    height: 36,           // Tinggi track dalam pixel
    clips: []
  }
]
```

### Tambah Template Baru

Edit array `templates` di `src/data/editorData.js`:

```js
{ id: 't99', name: 'Nama Template', cat: 'Intro', thumb: '#FF6B6B' }
```

Kategori yang tersedia: `'Intro'`, `'Outro'`, `'Lower Third'`, `'CTA'`

### Sambungkan ke Backend Nyata

Saat ini data disimpan di `localStorage`. Untuk sambungkan ke API/database:

1. Buka `src/utils/storage.js`
2. Replace fungsi `saveProjectData` dan `getProjectData` dengan fetch ke API kamu:

```js
// Contoh dengan fetch
export const saveProjectData = async (id, data) => {
  await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export const getProjectData = async (id) => {
  const res = await fetch(`/api/projects/${id}`)
  return res.json()
}
```

3. Update `Editor.jsx` — tambahkan `await` di pemanggilan fungsi storage.

### Pakai API Key HuggingFace (Opsional)

Untuk rate limit lebih tinggi, daftar di [huggingface.co](https://huggingface.co) → Settings → Access Tokens → buat token gratis.

Edit `src/utils/hfApi.js`:
```js
headers: {
  'Authorization': 'Bearer hf_xxxxxxxxxxxxxxxxxxxx',  // Token kamu
  'Content-Type': audioFile.type,
},
```

---

## 13. Deploy ke Production

### Vercel (Paling Mudah)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Atau langsung production
vercel --prod
```

### Netlify

```bash
# Build dulu
npm run build

# Upload folder /dist ke netlify.com/drop
```

Atau via Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Hosting Biasa (cPanel, Niagahoster, dll)

```bash
# Build
npm run build
```

Upload semua isi folder `dist/` ke `public_html` atau `www` di hosting.

> Pastikan hosting support SPA routing — tambahkan `.htaccess`:
> ```apache
> RewriteEngine On
> RewriteBase /
> RewriteRule ^index\.html$ - [L]
> RewriteCond %{REQUEST_FILENAME} !-f
> RewriteCond %{REQUEST_FILENAME} !-d
> RewriteRule . /index.html [L]
> ```

---

## 14. FAQ & Troubleshooting

**Q: Error saat `npm install`?**  
A: Pastikan Node.js versi 18+. Coba hapus folder `node_modules` dan file `package-lock.json`, lalu jalankan `npm install` lagi.

---

**Q: Video tidak muncul di preview setelah upload?**  
A: Pastikan format video didukung browser (`.mp4` dengan codec H.264 paling kompatibel). File `.mov` dari iPhone biasanya perlu diconvert dulu.

---

**Q: Waveform tidak muncul di clip audio?**  
A: Waveform diproses async di background setelah upload. Tunggu beberapa detik lalu lihat lagi. Jika masih tidak muncul, browser mungkin tidak support Web Audio API untuk format file tersebut.

---

**Q: AI caption gagal terus?**  
A: HuggingFace free tier punya rate limit ketat. Coba:
1. Tunggu 2-3 menit
2. Gunakan file audio yang lebih kecil (compress dulu)
3. Daftar HuggingFace dan tambahkan API token (lihat bagian 12)

---

**Q: Data project hilang setelah refresh?**  
A: Data disimpan di `localStorage` browser. Data bisa hilang jika:
- Browser dalam mode incognito/private
- User membersihkan cache browser
- Pindah browser/device

Untuk production, sambungkan ke backend (lihat bagian 12).

---

**Q: Bagaimana cara reset semua data demo?**  
A: Buka DevTools browser (F12) → Application → Local Storage → hapus semua key yang diawali `peakedit_`.

---

**Q: Bisa dipakai untuk project komersial?**  
A: Ya, lisensi Extended License memperbolehkan penggunaan untuk produk komersial dan SaaS. Tidak boleh dijual ulang sebagai template.

---

## Butuh Bantuan?

Hubungi via platform tempat kamu membeli template ini. Sertakan:
- Screenshot error (jika ada)
- Versi Node.js yang dipakai (`node --version`)
- Browser yang dipakai
- Langkah yang sudah dicoba
