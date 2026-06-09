import { useState } from 'react'
import { User, Link2, Bell, Palette, Download, Check, Youtube, Instagram, Twitter, Music } from 'lucide-react'

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${value ? 'bg-violet-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

const SECTIONS = [
  { id: 'profile',       label: 'Profile' },
  { id: 'platforms',     label: 'Platforms' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'branding',      label: 'Brand Kit' },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [profile, setProfile] = useState({ name: 'Alex Rivera', handle: '@alexrivera', bio: 'Tech & productivity creator. Helping 485K creators level up their workflow.', email: 'alex@alexrivera.com', niche: 'Tech & Productivity' })
  const [platforms, setPlatforms] = useState({ youtube: true, instagram: true, tiktok: true, twitter: true, pinterest: false })
  const [notifs, setNotifs] = useState({ newSubscriber: true, comments: true, milestones: true, analytics: false, brandDeals: true, weeklyDigest: true })
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-0.5">Manage your account preferences</p>
      </div>

      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <nav className="space-y-0.5">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === s.id ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeSection === 'profile' && (
            <div className="card space-y-5">
              <h2 className="font-semibold text-slate-900">Profile</h2>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                  A
                </div>
                <div>
                  <button className="btn-secondary text-sm mb-1.5">Change photo</button>
                  <p className="text-xs text-slate-400">JPG, PNG up to 5 MB</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Display Name', key: 'name', placeholder: 'Alex Rivera' },
                  { label: 'Handle', key: 'handle', placeholder: '@alexrivera' },
                  { label: 'Email', key: 'email', placeholder: 'alex@example.com' },
                  { label: 'Niche', key: 'niche', placeholder: 'Tech & Productivity' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      value={profile[f.key]}
                      onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                />
              </div>
              <button onClick={save} className="btn-primary">
                {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          )}

          {activeSection === 'platforms' && (
            <div className="card space-y-5">
              <h2 className="font-semibold text-slate-900">Connected Platforms</h2>
              <p className="text-sm text-slate-500">Connect your social accounts to enable analytics and scheduling.</p>
              <div className="space-y-3">
                {[
                  { id: 'youtube',   label: 'YouTube',   sub: '285K subscribers', color: '#FF0000', Icon: Youtube },
                  { id: 'instagram', label: 'Instagram', sub: '142K followers',   color: '#E1306C', Icon: Instagram },
                  { id: 'tiktok',    label: 'TikTok',    sub: '48.2K followers',  color: '#69C9D0', Icon: Music },
                  { id: 'twitter',   label: 'Twitter',   sub: '10K followers',    color: '#1DA1F2', Icon: Twitter },
                  { id: 'pinterest', label: 'Pinterest', sub: 'Not connected',    color: '#E60023', Icon: Link2 },
                ].map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: p.color + '20' }}>
                        <p.Icon size={20} style={{ color: p.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{p.label}</p>
                        <p className="text-xs text-slate-500">{p.sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {platforms[p.id] && (
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200">Connected</span>
                      )}
                      <Toggle value={platforms[p.id]} onChange={v => setPlatforms(prev => ({ ...prev, [p.id]: v }))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="card space-y-5">
              <h2 className="font-semibold text-slate-900">Notifications</h2>
              <div className="space-y-3">
                {[
                  { key: 'newSubscriber', label: 'New milestone subscriber alerts', sub: 'Get notified at 500K, 1M, etc.' },
                  { key: 'comments',      label: 'Comment mentions', sub: 'When someone replies to your comments' },
                  { key: 'milestones',    label: 'View milestones', sub: 'Videos reaching 100K, 500K, 1M views' },
                  { key: 'analytics',     label: 'Weekly analytics summary', sub: 'Performance report every Monday' },
                  { key: 'brandDeals',    label: 'Brand deal inquiries', sub: 'New sponsor messages in your inbox' },
                  { key: 'weeklyDigest',  label: 'Weekly creator digest', sub: 'Top tips and trending content ideas' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{n.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.sub}</p>
                    </div>
                    <Toggle value={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
                  </div>
                ))}
              </div>
              <button onClick={save} className="btn-primary">
                {saved ? <><Check size={16} /> Saved!</> : 'Save Preferences'}
              </button>
            </div>
          )}

          {activeSection === 'branding' && (
            <div className="card space-y-6">
              <h2 className="font-semibold text-slate-900">Brand Kit</h2>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Brand Colors</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Primary',   value: '#8B5CF6' },
                    { label: 'Secondary', value: '#EC4899' },
                    { label: 'Accent',    value: '#06B6D4' },
                  ].map(c => (
                    <div key={c.label}>
                      <label className="block text-xs text-slate-500 mb-2">{c.label}</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" defaultValue={c.value} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1" />
                        <input type="text" defaultValue={c.value} className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Typography</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Heading Font', value: 'Inter' },
                    { label: 'Body Font', value: 'Inter' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs text-slate-500 mb-2">{f.label}</label>
                      <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                        {['Inter', 'Poppins', 'DM Sans', 'Outfit', 'Plus Jakarta Sans'].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Data Export</h3>
                <div className="flex gap-3">
                  <button className="btn-secondary flex items-center gap-2">
                    <Download size={15} /> Export Analytics (CSV)
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Download size={15} /> Export Revenue (CSV)
                  </button>
                </div>
              </div>
              <button onClick={save} className="btn-primary">
                {saved ? <><Check size={16} /> Saved!</> : 'Save Brand Kit'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
